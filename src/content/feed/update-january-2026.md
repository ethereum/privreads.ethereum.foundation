---
title: "Private Reads Update — January 2026"
description: "January highlights: RMS24 spec and reference implementation complete, multi-engine PIR backend architecture defined, PAPs launched, Tor Project collaboration underway, ethers.js integration PR submitted."
date: 2026-01-31
author: "Ali Atiia"
type: "Monthly Update"
tags: ["pir", "torjs", "ubt", "paps"]
---

*Originally published on [HackMD](https://notes.ethereum.org/@0xalizk/H13omVW9We).*

## Highlights

- **RMS24 specification and reference implementation complete.** Keewoo finished the [RMS24 spec](https://github.com/keewoolee/rms24) with keyword PIR extension and optimizations, using a unified Python specification language for defining PIR scheme primitives. The spec serves as source of truth for agent-assisted production implementations.

- **Multi-engine PIR architecture defined.** Established the [sharded PIR design](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view): different PIR engines for different data slices (hot mutable state, full state with proofs, immutable logs, archival data), each tuned for size and access profile. Clients query all engines asynchronously — bottlenecked only by the slowest engine they actually need.

- **[PAPs launched](https://efdn.notion.site/PAPs-0cbd98955541825296e201936c5361f2).** Released Privacy Acceleration Proposals — microgrant-funded proposals designed to accelerate privacy-related tooling and research. Adopting a lean, iterative micro-grant approach for surgical 1–2 week tasks.

- **Tor Project collaboration.** Initiated hands-on collaboration with the [Tor Project](https://www.torproject.org/) to embed [Arti](https://gitlab.torproject.org/tpo/core/arti) in browsers. Evaluating two paths: refining [webtor-rs](https://github.com/voltrevo/arti/tree/webtor) vs. making the real `arti-client` compile to WASM. Pull requests submitted and review cycles underway.

- **ethers.js integration.** Submitted a PR to integrate [tor-js](https://github.com/voltrevo/arti) into [ethers.js](https://github.com/ethers-io/ethers.js), enabling wallets to route RPC calls through Tor with minimal code changes.

- **Spotlight video series.** Started coordination with EcoDev Digital Studio on a privacy spotlight video series.

## Details

### [PIR for the Ethereum State](/workstreams/pir)

- RMS24 spec and reference implementation completed with keyword PIR extension
- GPU acceleration benchmarked — DPF-based approach fits entire Ethereum state in GPU memory, though cost remains high (~$500K server for 100 TPS at current performance)
- Seoul National University group identified as working on GPU acceleration of [insPIRe](https://igor53627.github.io/inspire-rs/protocol-visualization.html); open to collaboration
- Data slicing strategy defined: different frontends (wallets, light clients, tax software) have different latency/data requirements aligned to different PIR schemes
- Sharded PIR system design sketched with multi-dataset, multi-engine architecture

### [TorJS / Embedded Arti](/workstreams/torjs)

- Weekly alignment calls with Tor Project established
- Arti patches submitted for WebAssembly compatibility
- WebRTC peer discovery component demonstrated
- ethers.js and viem SDK integrations advancing

### [Verifiable UBT](/workstreams/ubt)

- UBT conversion running on local chain; mainnet sync being set up
- Three debug RPCs implemented: `debug_getUBTState`, `debug_executionWitnessUBT`, `debug_getUBTProof`
- [OpenVM](https://book.openvm.dev/) selected as initial zkVM proving backend (GPU prover)
- Architecture decoupled: UBT state conversion, RPC serving, and proving (Keeper) operate independently

### Ecosystem & Acceleration

- [PAPs](https://efdn.notion.site/PAPs-0cbd98955541825296e201936c5361f2) published and open for proposals
- Coordination initiated with teams working on FHE, GPU acceleration, and PIR
- An external RPC provider expressed interest in experimenting with PIR deployment

## Looking Ahead to February

1. Publish the [sharded PIR system design](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view)
2. Resolve the Arti WASM compilation path — aim for end-to-end functionality
3. Resolve UBT-Geth synchronization edge cases at the ~3M block threshold
4. Engage first PAP micro-grant recipient for PIR scheme analysis
