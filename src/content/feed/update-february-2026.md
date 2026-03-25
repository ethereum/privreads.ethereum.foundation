---
title: "Private Reads Update — February 2026"
description: "February highlights: sharded PIR design draft finished, Arti performance improvements, PIR implementation grant approved, VIA scheme implementation started."
date: 2026-02-28
author: "Ali Atiia"
type: "Monthly Update"
tags: ["pir", "torjs", "ubt"]
---

*Originally published on [HackMD](https://notes.ethereum.org/@0xalizk/r1pArVsvWx).*

## Highlights

- **[Sharded PIR design](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) draft complete.** Finished the draft for the PIR system design and optimizations — covering multi-engine architecture, sidecar updates, and privacy composition guarantees.

- **Arti performance improvements.** Continued progress on the Arti Tor client with measurable performance gains, though optimization work continues (especially around WASM binary size and bootstrap latency).

- **PIR implementation grant approved.** Revised and approved a grant for a PIR implementation, accelerating the path from spec to production.

- **VIA scheme implementation started.** Began implementing the VIA PIR scheme as an additional engine option for the sharded architecture.

## Progress by Workstream

### [PIR for Ethereum State](./workstreams/pir)

- Sharded PIR system design drafted and under review
- VIA scheme implementation underway
- Grant approved for production PIR implementation
- Continued [benchmarking](https://0xalizk.github.io/PIR-Eng-Notes/) across scheme candidates

### [TorJS / Embedded Arti](./workstreams/torjs)

- Performance improvements shipped
- Ongoing collaboration with Tor Project on testing and internal audit
- Optimization of WASM binary and bootstrap flow continues

### [Verifiable UBT](./workstreams/ubt)

- Encountered challenges syncing UBT-enabled Geth at scale
- Stateless team is addressing the synchronization issues

## Looking Ahead to March

1. Finish [benchmarking PIR schemes](https://0xalizk.github.io/PIR-Eng-Notes/) and dig into GPU acceleration
2. Complete the VIA scheme reference implementation
3. Finish testing and internal auditing of the Tor Arti client in collaboration with the Tor Project
