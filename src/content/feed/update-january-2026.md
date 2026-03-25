---
title: "Private Reads Update — January 2026"
description: "January highlights: Plinko & RMS spec and reference implementation complete, PAPs launched, Tor Project collaboration underway, ethers.js integration PR submitted."
date: 2026-01-31
author: "Ali Atiia"
type: "Monthly Update"
tags: ["pir", "torjs", "ubt", "paps"]
---

*Originally published on [HackMD](https://notes.ethereum.org/@0xalizk/H13omVW9We).*

## Highlights

- **PIR specification complete.** Finished the specification and [reference implementation](https://github.com/keewoolee/rms24) for [Plinko](https://0xalizk.github.io/plinko-arch/) & RMS PIR schemes with optimizations. A production-grade implementation anchored on this spec is work-in-progress.

- **[PAPs launched](https://efdn.notion.site/PAPs-0cbd98955541825296e201936c5361f2).** Released Privacy Acceleration Proposals — microgrant-funded proposals designed to accelerate privacy-related tooling and research.

- **Tor Project collaboration.** Initiated collaboration with the [Tor Project](https://www.torproject.org/) to embed [Arti](https://gitlab.torproject.org/tpo/core/arti) in browsers. Pull requests submitted and review cycles underway.

- **ethers.js integration.** Submitted a PR to integrate [tor-js](https://github.com/voltrevo/arti) into [ethers.js](https://github.com/ethers-io/ethers.js), enabling wallets to route RPC calls through Tor with minimal code changes.

- **Spotlight video series.** Started coordination with EcoDev Digital Studio on a video series highlighting privacy developments in the Ethereum ecosystem.

## Progress by Workstream

### [PIR for Ethereum State](./workstreams/pir)

- Reference implementations for Plinko & RMS completed
- Production builds underway
- Initial [sharded PIR design](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) sketched
- GPU acceleration tested — $50 cost to generate hints for a 100 GB dataset

### [TorJS / Embedded Arti](./workstreams/torjs)

- Weekly alignment calls with Tor Project maintained
- Security reviews completed on key components
- Integration efforts advancing (ethers.js PR)

### [Verifiable UBT](./workstreams/ubt)

- Sync in progress against mainnet
- Addressing conversion-flow issues at ~3M block threshold

### Ecosystem & Acceleration

- Coordination initiated with teams working on FHE, GPU acceleration, and PIR
- [PAPs](https://efdn.notion.site/PAPs-0cbd98955541825296e201936c5361f2) published and open for proposals

## Q1 2026 Roadmap Alignment

Established a spec-driven approach for PIR work, with goals for:
1. Arti WASM functionality and performance
2. Sharded PIR system design publication
3. Improved team communication cadence (monthly updates, quarterly wrap-ups)

## Looking Ahead to February

1. Publish the [sharded PIR system design](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) with decoupled clients and sharded servers
2. Address performance issues in the Arti browser client
3. Resolve UBT-Geth synchronization edge cases and demonstrate execution with OpenVM
