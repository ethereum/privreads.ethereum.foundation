---
title: "A Sharded PIR Design for the Ethereum State"
description: "We are sharing our design for bringing Private Information Retrieval to Ethereum — a sharded, multi-engine architecture that hides what users read from remote servers."
date: 2026-03-05
author: "Ali Atiia"
type: "Research"
tags: ["pir", "privacy", "ethereum", "fhe"]
---

Today we are publishing our [sharded PIR design](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) — a step toward making every read from Ethereum's state private by default.

## The Problem

When a wallet checks your balance, looks up a transaction, or reads a smart contract's storage, it sends a query to a remote server. That server — whether an RPC provider, a light client gateway, or a full node — learns exactly which records you accessed. Over time, these access patterns paint a detailed picture: which accounts you control, which tokens you hold, which DeFi protocols you use, and when.

This [metadata leakage](https://ethereum.org/en/developers/docs/mev/) enables frontrunning, MEV extraction, and the correlation of on-chain pseudonyms with real-world identities. Even with encrypted connections, the _pattern_ of what you read reveals your intent.

[Private Information Retrieval](https://en.wikipedia.org/wiki/Private_information_retrieval) (PIR) can solve this: it allows clients to read data from a server without the server learning what was queried. The cryptographic guarantees are strong — the server processes an encrypted query and returns an encrypted response, learning nothing about the client's interest. However, PIR schemes come with significant performance overhead: server computation scales with database size, communication costs can be high, and preprocessing may be required. Applying PIR naively to all of Ethereum's state would be impractical.

## Our Approach: Sharded PIR

[Private Information Retrieval](https://en.wikipedia.org/wiki/Private_information_retrieval) (PIR) lets a client fetch a record from a database without the server learning which record was fetched. The server processes an encrypted query and returns an encrypted response — cryptographically guaranteed to reveal nothing about the client's interest.

Applying PIR to _all_ of Ethereum's state naively would be impractical. Ethereum's state is large (~100–300 GB depending on representation), heterogeneous (accounts, storage slots, contract code, receipts, logs), and constantly changing (new blocks every 12 seconds). No single PIR scheme handles all of these well.

Our design addresses this by **sharding** — segmenting Ethereum data into slices, each served by a PIR engine tuned for that slice's size, update frequency, and access profile:

- **Small, rarely-changing data** (contract bytecode, block headers): lightweight schemes with minimal overhead
- **Large, frequently-updated data** (live account and storage state): a [sidecar architecture](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) that decouples real-time updates from query processing
- **Append-only historical data** (transactions, receipts, logs): schemes optimized for immutable, growing datasets

Clients query all engines simultaneously. The key insight: _Q_ simultaneous queries to _N_ engines provide the same privacy as querying a single engine hosting the entire dataset — because the server cannot correlate queries across engines.

## Scheme-Agnostic by Design

The architecture abstracts over the underlying PIR scheme. We are actively evaluating multiple constructions, each with different tradeoffs:

- [**Plinko**](https://0xalizk.github.io/plinko-arch/) — a lattice-based scheme using [invertible PRFs](https://github.com/keewoolee/rms24) for efficient hint generation, well-suited to large databases
- [**RMS24**](https://github.com/keewoolee/rms24) — amortized sublinear PIR with strong server throughput and compact queries
- [**insPIRe**](https://igor53627.github.io/inspire-rs/protocol-visualization.html) — a preprocessing-free variant based on puncturable pseudorandom functions

This scheme-agnostic interface means the system improves as the field advances — new PIR constructions can be swapped in without changing the client or the API surface.

## What's in the Design Note

The [full design note](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) covers:

- A classification of PIR schemes by client/server statefulness
- The multi-dataset, multi-engine architecture and its privacy composition guarantees
- Sidecar architecture for absorbing state updates without disrupting query latency
- Strategies for handling Merkle proofs across trie levels
- The role of [Verifiable Binary Tries](https://pse.dev/projects/verifiable-ubt) (UBT) in reducing proof overhead — shrinking per-leaf proofs from ~4,800 bytes (MPT) to ~1,280 bytes
- Integration path: a [GraphQL interface](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) that mirrors Ethereum's JSON-RPC semantics while routing queries through PIR under the hood
- Open questions on delegated hint generation via FHE/MPC and sublinear server computation (DEPIR)

For [benchmarks and initial results](https://0xalizk.github.io/PIR-Eng-Notes/) across the schemes we are evaluating, see our engineering notes.

## What's Next

We are now moving from design to implementation. In the near term:

- Finalizing executable specs for our first scheme selections, following the [methodology](https://hackmd.io/@keewoolee/SJyGoXCzZe) we use for scheme evaluation
- Building a reference sidecar that runs alongside any Ethereum execution client
- Collaborating with wallet teams and RPC providers on integration
- Funding parallel research tracks through [Privacy Acceleration Proposals (PAPs)](https://efdn.notion.site/PAPs-0cbd98955541825296e201936c5361f2)

Read the [full design note here](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view). We welcome feedback — reach out via [GitHub](https://github.com/0xalizk) or find us at the [Ethereum Foundation](https://ethereum.foundation).
