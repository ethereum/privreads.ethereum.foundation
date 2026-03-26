---
title: "Private Reads Update — March 2026"
description: "March highlights: LeanPIR scheme introduced, VIA spec nearing v1, Arti bootstrapping breakthrough, Ethrex collaboration for UBT, Q2 plan taking shape."
date: 2026-03-26
author: "Ali Atiia"
type: "Monthly Update"
tags: ["pir", "torjs", "ubt"]
---

## Highlights

- **New PIR scheme: LeanPIR.** Keewoo designed a new GPU-friendly scheme with <100KB communication for 8GB databases and massive parallelism — a strong candidate for the sharded PIR architecture.

- **VIA spec approaching v1.** Turan's [VIA spec](https://github.com/turanzv/via-spec) implementation is progressing well, covering VIA, VIA-B, and VIA-CB variants with reusable lattice primitives. The `/primitives` module is designed to be shared across all [ReSPIRe](https://eprint.iacr.org/2024/1605)-esque implementations.

- **Arti bootstrapping breakthrough.** Adding zed/deflate support massively improved WASM bootstrap times. A working demo is live at [tor-js-gateway.voltrevo.com](https://tor-js-gateway.voltrevo.com/) with docs at [voltrevo.github.io/arti](https://voltrevo.github.io/arti/).

- **Ethrex collaboration for UBT.** Kicked off a collaboration with [Ethrex](https://github.com/lambdaclass/ethrex) for client diversity on the [UBT](https://pse.dev/projects/verifiable-ubt) front, complementing ongoing work with Geth's Stateless team.

- **Presenting at Stateless Summit** on PIR and TorJS.

## Progress by Workstream

### [PIR for Ethereum State](/workstreams/pir)

- LeanPIR scheme designed — GPU-friendly with low communication overhead
- [Harmony](https://eprint.iacr.org/2023/1733) integrated into the PIR [benchmarks](https://0xalizk.github.io/PIR-Eng-Notes/)
- VIA spec v1 nearing completion via [PAP-2.1](https://efdn.notion.site/PAPs-0cbd98955541825296e201936c5361f2) grant
- PIR demo built: sidecar pattern with [insPIRe](https://igor53627.github.io/inspire-rs/protocol-visualization.html) + GPU acceleration for real-time ETH balance queries
- [Design post](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) receiving feedback, soon to be public

### [TorJS / Embedded Arti](/workstreams/torjs)

- Deflate compression support dramatically improved bootstrapping
- Socket support added for NodeJS environments (useful for native wallets)
- Preparing upstream merge with Tor Project
- Q2 scope shaping up: Ethereum-sandboxed network, WebRTC transport, messenger app integrations

### [Verifiable UBT](/workstreams/ubt)

- Ethrex collaboration kicked off for client diversity
- [UBT state checker UI](https://github.com/tkmct/ubt-checker) developed
- Geth integration waiting on Stateless team bug fixes and performance improvements

## Looking Ahead to Q2

Q2 plan is being finalized (March 31). Key themes:

1. **PIR productionization** — sharded design with LeanPIR, VIA, and RMS/Harmony as initial engines; GPU acceleration collaboration
2. **Arti integrations** — Ethereum-sandboxed anonymous network, WebRTC transport, wallet SDK adoption
3. **UBT shadow chain** — running provably MPT-equivalent shadow chain
4. **New collaborations** — [University of Illinois Ren group](https://ece.illinois.edu/) on algorithmic PIR with lattice crypto expertise
