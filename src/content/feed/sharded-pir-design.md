---
title: "A Sharded PIR Design for the Ethereum State"
description: "Our design for bringing Private Information Retrieval to Ethereum — a sharded, multi-engine architecture that hides what users read from remote servers."
date: 2026-03-05
author: "Ali Atiia"
type: "Research"
tags: ["pir", "privacy", "ethereum", "fhe"]
---

_Update Mar 31: published on [ethresear.ch](https://ethresear.ch/t/sharded-pir-design-for-the-ethereum-state/24552)._

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

The architecture abstracts over the underlying PIR scheme. We are actively building, evaluating, and integrating multiple constructions — each paired with a data slice based on its tradeoffs:

- **LeanPIR** (in-house, unpublished) — a doubly-stateless, GPU-optimized scheme with <100 KB communication for multi-GB databases and sub-second preprocessing. Our primary candidate for hot mutable state where both client and server must remain stateless to avoid session linkability.
- [**VIA**](https://github.com/turanzv/via-spec) — a lattice-based scheme with reusable primitives, being specified and implemented across three variants (VIA, VIA-B, VIA-CB) via a [PAP microgrant](https://efdn.notion.site/PAPs-0cbd98955541825296e201936c5361f2).
- [**OnionPIRv2**](https://eprint.iacr.org/2023/1510) — an FHE-native single-server scheme with strong performance characteristics for medium-sized databases.
- [**Harmony**](https://eprint.iacr.org/2023/1733) / [**RMS24**](https://github.com/keewoolee/rms24) — preprocessing-based schemes well-suited to immutable or slowly-changing data slices where one-time hint generation cost is amortized over many queries.

This scheme-agnostic interface means the system improves as the field advances — new PIR constructions can be swapped in without changing the client or the API surface.

## What's Next

We are now moving from design to implementation. In the near term:

- Flesh out the sharded design architecture — the software engineering side of things
- Finish our in-house scheme and decide on which 2+ schemes to choose for the first iteration of the sharded design
- Hopefully we can make it in Q2: end-to-end testing of the sharded design with at least one integration (most likely an Ethereum SDK such as [ethers.js](https://docs.ethers.org/) or [viem](https://viem.sh/), and one select wallet like [Kohaku](https://github.com/ethereum/kohaku) that integrates with it — if it proves easier we may also go with a light client as the first integration)

Read the [full design note here](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view).
