---
title: "Private Reads Update — March 2026"
description: "March highlights: LeanPIR scheme introduced, VIA spec nearing v1, Arti bootstrapping breakthrough, Ethrex collaboration for UBT, Q2 plan taking shape."
date: 2026-03-26
author: "Ali Atiia"
type: "Monthly Update"
tags: ["pir", "torjs", "ubt"]
---

## Highlights

- **Sharded PIR design published.** The [sharded PIR design](https://ethresear.ch/t/sharded-pir-design-for-the-ethereum-state/24552) for the Ethereum state is now published on ethresear.ch.

- **New PIR scheme: LeanPIR.** Keewoo is working on a new GPU-friendly scheme that could outperform [insPIRe](https://igor53627.github.io/inspire-rs/protocol-visualization.html) across all dimensions: ~30 ms server runtime for a 32 GB database, sub-second preprocessing (down from ~10 s), and <100 KB communication. It supersedes the earlier insPIRe GPU work and is being integrated into our Ethereum balance retrieval demo.

- **VIA spec approaching v1.** Turan's [VIA spec](https://github.com/turanzv/via-spec) implementation is progressing, covering VIA, VIA-B, and VIA-CB variants with reusable lattice primitives. The `/primitives` module is designed to be shared across all [ReSPIRe](https://eprint.iacr.org/2024/1165)-esque implementations.

- **Arti bootstrapping overhaul.** A Brotli-compressed ~3 MB bundle now replaces fetching thousands of micro-descriptors — a fundamentally different and much faster approach than the standard Tor bootstrap method (albeit with that one-time fetch itself not onion-routed). Working demo at [tor-js-gateway.voltrevo.com](https://tor-js-gateway.voltrevo.com/), docs at [voltrevo.github.io/arti](https://voltrevo.github.io/arti/).

- **Ethrex collaboration for UBT.** Kicked off a collaboration with [Ethrex](https://github.com/lambdaclass/ethrex) for client diversity on the UBT front, complementing ongoing work with Geth's Stateless team.

- **Presenting at Stateless Summit** on [PIR](/presentations/pir/) and [TorJS](/presentations/torjs/).

## Details

### [PIR for the Ethereum State](/workstreams/pir)

- [Design post](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) receiving feedback, targeting publication before April 1
- LeanPIR, new PIR scheme— ~30 ms for 32 GB, sub-second preprocessing, <100 KB communication
- [Harmony](https://eprint.iacr.org/2026/437) integrated into the PIR [benchmarks](https://0xalizk.github.io/PIR-Eng-Notes/), h/t [Ling Ren](https://sites.google.com/view/renling) for sharing it
- VIA spec v1 nearing completion
- Internal PIR demo: sidecar pattern with GPU-accelerated insPIRe for real-time ETH balance queries (cold start data from Google BigQuery, 100–300 account updates simulated per block)
- Sync with [Ling Ren](https://ece.illinois.edu/about/directory/faculty/renling) and group: agreement that doubly-stateless PIR is the right priority and that pre-processed schemes best reserved for immutable archival data, we sniped them into VIA they sniped us into HarmonyPIR

### [TorJS / Embedded Arti](/workstreams/torjs)

- Brotli-compressed ~3 MB bootstrap bundle replaces standard micro-descriptor fetching — fundamentally faster cold start
- Giving JavaScript direct socket access (bypassing WebSocket) matches raw Rust Arti performance in Node.js
- WASM compatibility code under review for upstream merge with Tor Project
- Q2 scope shaping up: Ethereum-sandboxed anonymous network (WebRTC transport as first milestone), wallet SDK integrations, a closer look at messenger protocols/apps (+ potentially embedding Arti in some)

### [Verifiable UBT](/workstreams/ubt)

- Ethrex collaboration kicked off for client diversity
- Geth integration waiting on Stateless team bug fixes and performance improvements
- A UBT state checker [utility](https://github.com/tkmct/ubt-checker)

## Looking Ahead to Q2

[Q2 plan](https://www.notion.so/efdn/Roadmaps-ca8d989555418381ae430193d009cec0?source=copy_link#7edd98955541833b831201acc41edb79) is being finalized (March 31). Key themes:

1. **PIR productionization** — sharded design with LeanPIR, VIA, Harmony, OnionV2 as potential initial engines; GPU acceleration collaborations
2. **Arti integrations** — Ethereum-sandboxed anonymous network, WebRTC transport, wallet SDK integrations
3. **UBT shadow chain** — running provably MPT-equivalent shadow chain, overcoming ubt-mpt [conversion](https://github.com/ethereum/go-ethereum/commit/58557cb4635d4e6f3e49fcdc82a6469554e929a6) performance blocker in Geth and accelerating [Ethrex route](https://github.com/lambdaclass/ethrex/pull/6380)
4. Continuing some collaborations, and pushing some new ones forward (PIR academia, GPU researchers/practitioners)
