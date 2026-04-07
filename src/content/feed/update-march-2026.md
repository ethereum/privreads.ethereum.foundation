---
title: "Private Reads Update — March 2026"
description: "March highlights: LeanPIR scheme introduced, VIA spec nearing v1, Arti bootstrapping breakthrough, Ethrex collaboration for UBT, Q2 plan taking shape."
date: 2026-03-26
author: "Ali Atiia"
type: "Monthly Update"
tags: ["pir", "torjs", "ubt"]
---

## Highlights

- **New PIR scheme: LeanPIR.** Keewoo designed a new GPU-friendly scheme that outperforms [insPIRe](https://igor53627.github.io/inspire-rs/protocol-visualization.html) across all dimensions: ~30 ms server runtime for a 32 GB database, sub-second preprocessing (down from ~10 s), and <100 KB communication. It supersedes the earlier insPIRe GPU work and is being integrated into our Ethereum balance retrieval demo.

- **VIA spec approaching v1.** Turan's [VIA spec](https://github.com/turanzv/via-spec) implementation is progressing well, covering VIA, VIA-B, and VIA-CB variants with reusable lattice primitives. The `/primitives` module is designed to be shared across all [ReSPIRe](https://eprint.iacr.org/2024/1605)-esque implementations.

- **Arti bootstrapping breakthrough.** A Brotli-compressed ~3 MB bundle now replaces fetching thousands of micro-descriptors — a fundamentally different and much faster approach than the standard Tor bootstrap method. Working demo at [tor-js-gateway.voltrevo.com](https://tor-js-gateway.voltrevo.com/), docs at [voltrevo.github.io/arti](https://voltrevo.github.io/arti/).

- **Ethrex collaboration for UBT.** Kicked off a collaboration with [Ethrex](https://github.com/lambdaclass/ethrex) for client diversity on the UBT front, complementing ongoing work with Geth's Stateless team.

- **Presenting at Stateless Summit** on [PIR](/presentations/pir/) and [TorJS](/presentations/torjs/).

## Details

### [PIR for the Ethereum State](/workstreams/pir)

- LeanPIR scheme designed — ~30 ms for 32 GB, sub-second preprocessing, <100 KB communication
- [Harmony](https://eprint.iacr.org/2023/1733) integrated into the PIR [benchmarks](https://0xalizk.github.io/PIR-Eng-Notes/)
- VIA spec v1 nearing completion via [PAP-2.1](https://efdn.notion.site/PAPs-0cbd98955541825296e201936c5361f2) grant
- PIR demo built: sidecar pattern with GPU-accelerated insPIRe for real-time ETH balance queries (cold start data from Google BigQuery, 100–300 account updates simulated per block)
- [Design post](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) receiving feedback, targeting publication before April 1
- Confirmed with [Ling Ren](https://ece.illinois.edu/about/directory/faculty/renling) (UIUC): doubly-stateless PIR is the right priority; pre-processed schemes (Plinko, RMS) best reserved for immutable archival data

### [TorJS / Embedded Arti](/workstreams/torjs)

- Brotli-compressed ~3 MB bootstrap bundle replaces standard micro-descriptor fetching — fundamentally faster cold start
- Giving JavaScript direct socket access (bypassing WebSocket) matches raw Rust Arti performance in Node.js
- ~15,000 lines of WASM compatibility code under review for upstream merge with Tor Project
- Q2 scope shaping up: Ethereum-sandboxed anonymous network (WebRTC transport as first milestone), wallet SDK integrations, messenger app support

### [Verifiable UBT](/workstreams/ubt)

- Ethrex collaboration kicked off for client diversity
- [UBT state checker UI](https://github.com/tkmct/ubt-checker) developed
- Geth integration waiting on Stateless team bug fixes and performance improvements

## Looking Ahead to Q2

Q2 plan is being finalized (March 31). Key themes:

1. **PIR productionization** — sharded design with LeanPIR, VIA, and RMS/Harmony as initial engines; GPU acceleration collaboration
2. **Arti integrations** — Ethereum-sandboxed anonymous network, WebRTC transport, wallet SDK adoption
3. **UBT shadow chain** — running provably MPT-equivalent shadow chain
4. Continuing some collaborations, and pushing some new ones forward (PIR academia, GPU researchers/practitioners)
