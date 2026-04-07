---
title: "Embedding Tor in Browser Wallets, Frontends, and dApps"
description: "A technical account of our effort to compile Arti — the Tor Project's Rust implementation — to WebAssembly, enabling wallets and dApps to route traffic through Tor directly from the browser."
date: 2026-03-20
author: "Andrew Morris & Ali Atiia"
type: "Engineering"
tags: ["torjs", "arti", "wasm", "tor", "privacy"]
---

Over the past three months Jan - Mar 2026 we have been working on embedding [Arti](https://gitlab.torproject.org/tpo/core/arti) — the Tor Project's official Rust implementation — into the browser via WebAssembly. The goal: give every wallet and dApp a `fetch()` call that routes through Tor, with no external software required.

This post covers what we did, what broke, and how we fixed it.

**TL;DR:**

- We compiled the Rust Tor client (Arti) to WebAssembly
- Any wallet or dApp can route traffic through Tor with a few lines of TypeScript
- [Snowflake](https://snowflake.torproject.org/) pluggable transport enables connectivity even in constrained environments (no access to socket) or in censored jurisdictions that block Tor
- Bootstrap time was reduced from ~3 minutes to seconds via fast-bootstrap and deflate support
- A TypeScript wrapper provides a `fetch()`-compatible API with IndexedDB persistence and cross-tab locking
- The code is functional; upstream merge with the Tor Project is in progress in hands-on collab with TP team


## Why Arti

We previously shipped tor-js, an npm module built on [Echalot](https://github.com/nicehash/echalot), a JavaScript Tor implementation. It validated the concept — we integrated it into wallet SDKs ([ethers.js](https://docs.ethers.org/), [viem](https://viem.sh/)) for network privacy — but had limitations: behavioral divergence from the canonical Tor client, and security gaps identified by the [Tor Project](https://www.torproject.org/) that would have required essentially reimplementing Tor to close. The foundational [webtor-rs](https://github.com/voltrevo/arti/tree/webtor) work by Igor Barinov ported the concept to Rust, bringing it closer to Arti but still maintaining a separate implementation.

Arti is the [Tor Project's designated successor](https://blog.torproject.org/arti_100_released/) to the C tor client — written in Rust, actively maintained, and designed to be embeddable. If we could get `arti-client` to compile to WASM, we'd inherit its security properties and completeness without maintaining a divergent fork.

The problem: Arti was never designed for the browser. It assumes threads, native sockets, filesystem access, SQLite, system time, and C/assembly-linked cryptography (`ring`). None of these exist in WASM.

## Diagnosing the Blockers

We cataloged everything preventing Arti from compiling to `wasm32-unknown-unknown` (the standard WASM compilation target):

1. **`std::time::Instant`** — unavailable in WASM. Used pervasively across ~30 crates for RTT measurement, congestion control, and guard rotation.
2. **Threads and `tokio`** — WASM is single-threaded. Every `Send + Sync` bound, every `spawn()` call, every blocking operation needs rethinking.
3. **Native sockets** — no TCP/UDP in the browser. All networking must go through WebSocket or WebRTC.
4. **SQLite** — Arti uses it for directory caching and persistent state. Not available in WASM.
5. **`ring` (crypto backend for rustls)** — requires C and assembly compilation. Need a pure-Rust crypto backend.
6. **`getrandom`** — does not work out of the box on WASM, though it supports a `wasm_js` feature flag that uses `crypto.getRandomValues()`. Required feature-flag configuration across multiple crate versions.

We evaluated two paths: (a) continuing to refine [webtor-rs](https://github.com/voltrevo/arti/tree/webtor), or (b) making the real `arti-client` compile to WASM. The Tor Project team had mixed views — one warned it would be "painful," another saw it as the right long-term path. We initially pursued both, but rapid prototyping progress on option (b) in early February made the decision clear: a working `arti-client` prototype materialized within days, and we pivoted fully.

## Making Arti Compile to WASM

Two cross-cutting changes were needed before anything else.

**Cross-platform time.** We created the [`tor-time`](https://github.com/voltrevo/arti/tree/tor-time) crate — a thin abstraction that uses `web_time::Instant` (backed by `performance.now()`) on WASM and `std::time::Instant` on native. The initial pass touched [22 files across several crates](https://github.com/voltrevo/arti/commit/91afd5a4) including `tor-circmgr`, `tor-guardmgr`, and `tor-error`; the [full isolation effort](https://github.com/voltrevo/arti/commit/c0761bdb) spanned ~28 crates.

**Removing `Send` bounds.** In Rust, the `Send` trait marks data that can safely move between threads. Since WASM has only one thread, these bounds are unnecessary and often prevent compilation. We created [`tor-async-compat`](https://github.com/voltrevo/arti/commit/b1ebe05c), a proc macro crate that rewrites `#[async_trait]` to `#[async_trait(?Send)]` on WASM targets. This rippled across [51 files](https://github.com/voltrevo/arti/commit/b1ebe05c) in `tor-chanmgr`, `tor-circmgr`, `tor-dirmgr`, `tor-proto`, `tor-hsclient`, `tor-hsservice`, and more.

**WASM memory optimization.** The `psl` crate (for Public Suffix List lookups) compiled the entire PSL into thousands of Rust constants, causing WASM compilation to consume 10GB+ of memory. We [replaced it](https://github.com/voltrevo/arti/tree/wasm-arti-client) with 1Password's `public-suffix` crate, which uses a compact trie (~430KB), bringing WASM memory usage to a manageable ~2.6GB.

## The WASM Runtime

With time and threading resolved, we built the [`WasmRuntime`](https://github.com/voltrevo/arti/commit/fd30fa07) — the bridge between Arti's abstractions and browser APIs:

- **Sleep**: `gloo_timers::future::TimeoutFuture` wrapping `setTimeout`
- **Wall clock**: `js_sys::Date::now()` for `SystemTime`
- **Spawn**: `wasm_bindgen_futures::spawn_local()` — delegates to the browser's event loop
- **Networking**: Stubbed — actual transport comes from the Snowflake layer (described below)
- **Blocking**: Panics — there is no thread to block on

The same day, we added [in-memory directory storage](https://github.com/voltrevo/arti/commit/b87705fd) and a [memory-backed state manager](https://github.com/voltrevo/arti/commit/fd820950) as SQLite replacements. These serve as the synchronous Rust-side cache; on the browser side, an IndexedDB layer provides persistence across sessions, syncing to and from the in-memory store.

By the end of February 2, `arti-client` compiled to WASM. It did not yet bootstrap successfully — that required the transport and debugging work that followed.

## Snowflake Transport

Browsers can't open raw TCP connections. To reach the Tor network, we use [Snowflake](https://snowflake.torproject.org/) — a [pluggable transport](https://tb-manual.torproject.org/circumvention/) (a swappable networking layer that disguises Tor traffic to bypass censorship).

The transport stack from outer to inner:

```
WebSocket or WebRTC
  → KCP (reliable delivery over unreliable channels)
    → SMUX (session multiplexing — multiple streams over one connection)
      → TLS (rustls — added for the WASM integration)
        → Tor protocol (arti-client)
```

We implemented a [`SnowflakeChannelFactory`](https://github.com/voltrevo/arti/commit/6a5c09d7) (+741 lines) that plugs into arti-client's channel manager as a proper pluggable transport. Both WebSocket and [WebRTC](https://github.com/voltrevo/arti/commit/4c9abf51) modes are supported.

A critical bug surfaced immediately: [directory downloads stalled](https://github.com/voltrevo/arti/commit/116494f3) because the SMUX (Session MUltipleXer) window update logic was overwriting pending updates before they were sent. We fixed this and tuned KCP window sizes to 65535 (matching upstream Snowflake), plus reduced download parallelism for the constrained transport.

## The TLS Pivot

Our initial approach used `subtle-tls` — a custom pure-Rust TLS 1.3 implementation from the webtor-rs project. It worked, but had [certificate verification issues](https://github.com/voltrevo/arti/commit/2994692d) and was a major blocker for merging into upstream Arti.

We [replaced it entirely](https://github.com/voltrevo/arti/commit/d4cf18c2) (-8,434 / +307 lines) with `futures-rustls` backed by [`rustls-rustcrypto`](https://github.com/RustCrypto/rustls-rustcrypto/) — a pure-Rust crypto backend that compiles to WASM without needing `ring` or any C code. The TLS protocol logic in [rustls](https://github.com/rustls/rustls) is [professionally audited](https://github.com/rustls/rustls#audit) and battle-tested. A caveat: `rustls-rustcrypto` itself is still experimental (alpha status), and the RustCrypto primitives it uses have not undergone the same level of audit as `ring`. This is a known trade-off; we are tracking the maturity of this dependency and exploring options for a dedicated audit.

## Fast Bootstrap

The first working prototype bootstrapped in **~3 minutes** in WASM versus ~15 seconds native. Parsing ~10,000 microdescriptors (compact summaries of Tor relay capabilities) in single-threaded WASM is expensive, and the Snowflake transport adds latency. Debugging this was harder than expected — we encountered stalls at higher concurrency settings, and `performance.now()` precision limitations (reduced post-Spectre/Meltdown) may affect Tor's timing-sensitive congestion control.

We addressed this on three fronts:

1. **[Fast bootstrap from archive](https://github.com/voltrevo/arti/commit/115c234c)**: A `bootstrap.zip` containing pre-built consensus, authority certs, and microdescriptors is fetched over HTTPS and pre-populated into the directory cache. For microdescriptors, we use lightweight text splitting + browser-native SHA-256 (via `crypto.subtle.digest()`) instead of full parsing — avoiding ~3 seconds of overhead for 10k entries.

2. **Deflate support**: Adding zlib/deflate decompression for consensus documents [massively improved](https://github.com/voltrevo/arti/tree/wasm-arti-client) bootstrap time when downloading from the Tor network directly — this was the single biggest breakthrough.

3. **[UI thread yields](https://github.com/voltrevo/arti/commit/c3223691)**: `sleep(0)` yields during document loading to prevent the browser from freezing while processing thousands of descriptors.

**A note on trust:** The fast-bootstrap archive is fetched over a plain HTTPS connection before Tor is operational, meaning the user's IP is visible to the bootstrap server. The consensus and authority cert signatures are verified using Arti's own parsers, but this is a weaker trust model than standard Tor bootstrapping (which fetches from multiple directory authorities over Tor itself). We view fast-bootstrap as an optional optimization — users who need stronger guarantees can bootstrap directly from the Tor network at the cost of longer startup time.

## TypeScript Wrapper & Developer Experience

The Rust/WASM layer exposes low-level bindings via `wasm-bindgen`. We wrapped these in a [TypeScript package](https://github.com/voltrevo/arti/commit/0a00857f) with a high-level API:

```typescript
import { TorClient } from 'tor-js';

const tor = new TorClient();
await tor.ready();

const response = await tor.fetch('https://api.example.com/data');
```

The package includes:
- Multiple WASM loading strategies (CDN with content-hash verification, local file, inline base64)
- [IndexedDB storage](https://github.com/voltrevo/arti/commit/0a00857f) for persistent directory caching across browser sessions
- Filesystem storage for Node.js (enabling native wallet use cases)
- [Cross-tab locking](https://github.com/voltrevo/arti/commit/05920120) so multiple browser tabs can share Tor state without corrupting each other's directory cache
- [Bulk IndexedDB loading](https://github.com/voltrevo/arti/commit/2f5360cf) (`getAll()` instead of item-by-item) to cut startup time

## Security Considerations

This is a functional prototype, not a hardened production release. Key caveats:

- **`rustls-rustcrypto` is experimental.** The TLS protocol logic (rustls) is audited, but the underlying crypto primitives (RustCrypto) carry security warnings and have not undergone equivalent scrutiny. We are exploring audit options.
- **Reduced timer precision.** Post-Spectre/Meltdown, browsers limit `performance.now()` resolution. This may degrade Tor's congestion control and padding schemes, potentially affecting traffic-analysis resistance.
- **No process isolation.** The WASM Tor client runs in the same JavaScript context as the dApp it serves. A compromised dApp could inspect WASM memory.
- **Fast-bootstrap trust model.** As noted above, the bootstrap server sees the user's IP and could serve a malicious view of the network if compromised. Consensus signatures are verified, but this is a trade-off users should understand.
- **WASM fingerprinting.** A WASM-based Tor client has execution characteristics that differ from standard Tor Browser, potentially making users distinguishable.

A comprehensive [internal code review](https://github.com/voltrevo/arti/tree/main/wasm-notes) has been conducted — 34 review items identified and resolved across the WASM integration, covering security, correctness, and code quality. We plan to pursue an external audit before recommending production use.

## What's Next

The `wasm-arti-client` branch is functional (~6,100 lines of new Rust + TypeScript wrapper, with changes across 10+ upstream Arti crates). Remaining work:

- **Upstream merge**: We have been collaborating with the Tor Project through weekly syncs since January, and they have been actively involved in debugging and code review. The `tor-time` and `tor-async-compat` crates are under review; once merged, the main WASM integration follows.
- **Security audit**: An external audit of the WASM-specific integration layers is planned.
- **WebRTC as default transport**: Replacing WebSocket with WebRTC would remove the centralizing effect of WebSocket-based bridges, which is a priority for both us and the Tor Project.
- **npm publish**: The `tor-js` package will be published once the merge path is clear.
- **PIR for Tor bootstrapping**: Instead of downloading 10% of all microdescriptors (Tor's current approach to hide which relays the client will use), we are exploring whether [Private Information Retrieval](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) could complement this — fetching only the descriptors needed while revealing nothing about which ones were requested. The Tor Project has expressed interest in revisiting PIR for this purpose.
- **Wallet SDK integration**: Working with wallet teams to offer a privacy toggle backed by Arti.

The code is at [github.com/voltrevo/arti](https://github.com/voltrevo/arti) on the `wasm-arti-client` branch. This work is part of a collaboration with the [Tor Project](https://www.torproject.org/) team, with the goal of merging these changes into upstream Arti.
