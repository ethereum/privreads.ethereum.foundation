---
title: "Private Reads Update — February 2026"
description: "February highlights: Arti compiles to WASM, sharded PIR design draft finished, PIR grant approved for VIA scheme, Ethereum-sandboxed mixnet concept explored."
date: 2026-02-28
author: "Ali Atiia"
type: "Monthly Update"
tags: ["pir", "torjs", "ubt"]
---

*Originally published on [HackMD](https://notes.ethereum.org/@0xalizk/r1pArVsvWx).*

## Highlights

- **Arti compiles to WASM.** By February 2, `arti-client` compiled to WebAssembly for the first time — a major milestone. The team pivoted fully to making the real Arti client work in the browser (over maintaining a separate implementation). TLS was replaced with `rustls-rustcrypto` (pure Rust, no C dependencies), and the standard JavaScript API improvements shipped.

- **[Sharded PIR design](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) draft complete.** Finished the draft for the PIR system design — covering multi-engine architecture, four data slices, sidecar updates, and privacy composition guarantees. Shared with external researchers for feedback.

- **PIR grant approved (VIA scheme).** Approved a [PAP micro-grant](https://efdn.notion.site/PAPs-0cbd98955541825296e201936c5361f2) for Turan to produce a Pythonic reference specification for the VIA PIR scheme, prioritizing cryptographic correctness, clean abstractions, and portable tests.

- **PIR for Tor bootstrap proposed.** Andrew proposed using PIR to privately retrieve only the Tor relay descriptors needed at startup — eliminating the need to download the full directory. The Tor Project expressed interest in revisiting PIR for this purpose.

- **Ethereum-sandboxed mixnet explored.** Began exploring an Ethereum-specific anonymized routing network where exit nodes drop non-Ethereum RPC traffic, potentially encouraging more people to run nodes by guaranteeing traffic type.

## Details

### [PIR for Ethereum State](./workstreams/pir)

- Sharded PIR system design drafted with taxonomy of schemes by client/server statefulness
- Four Ethereum data slices defined: hot mutable state (~2 GB), state with proofs (~100–300 GB), immutable logs/receipts (hundreds of GB), archival (4–20 TB)
- VIA scheme implementation started via PAP grant; Turan identified VIA as most promising for the initial slices
- [Benchmarking](https://0xalizk.github.io/PIR-Eng-Notes/) continuing — ranking schemes by speed with focus on the top 5 most promising candidates
- Convergence on [ReSPIRe](https://eprint.iacr.org/2024/1605) family for minimizing preprocessing costs
- Explored FHE-based PIR collaboration for GPU-accelerated approaches with external teams

### [TorJS / Embedded Arti](./workstreams/torjs)

- `arti-client` compiles to WASM (Feb 2) — end-to-end functionality achieved (Feb 10)
- TLS pivot: replaced custom `subtle-tls` with `rustls-rustcrypto` (-8,434 / +307 lines)
- Standard JavaScript response objects with streaming support added
- PIR for Tor bootstrap idea prototyped — could complement fast-bootstrap for private relay selection
- Upstream merge strategy: break work into multiple smaller PRs for Tor Project review
- Project name consolidated under **TorJS** (replacing separate Arti/webtor-rs naming)

### [Verifiable UBT](./workstreams/ubt)

- Mainnet conversion sync running but hit issues with ephemeral diff layers disappearing after ~3M blocks
- Switched from PathDB diffs to queue-based approach for more reliable block-by-block conversion
- Implemented most RPCs; created a simple [UI for testing](https://github.com/tkmct/ubt-checker) UBT vs MPT Merkle roots
- Resolved memory issues by capping max batch size during conversion
- Guillaume (Geth team) working on offline full-database conversion approach — perfectly parallelizable

## Looking Ahead to March

1. Finish [benchmarking PIR schemes](https://0xalizk.github.io/PIR-Eng-Notes/) — focus on GPU acceleration
2. Complete the VIA scheme reference specification
3. Finish testing and auditing of the Arti WASM client in collaboration with the Tor Project
4. Address UBT sync performance — explore Ethrex as alternative client for diversity
