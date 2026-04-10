---
title: "Introducing Private Reads"
description: "An overview of the Private Reads team and our mission to bring privacy-preserving reads to Ethereum."
date: 2026-01-05
author: "Ali Atiia"
type: "Announcement"
tags: ["pir", "privacy"]
---

We are a team within the [Ethereum Foundation](https://ethereum.foundation) focused on making privacy-preserving reads of Ethereum data practical and accessible.

## The Problem

When you query Ethereum data from a remote server — checking your balance, looking up a transaction, reading contract state — your access patterns leak information. Servers learn which accounts you monitor, which tokens you hold, and how your on-chain and off-chain identities correlate.

**This leakage undermines other privacy measures** (like shielding) and exposes users to [frontrunning](https://ethereum.org/en/developers/docs/mev/), MEV extraction, and identity correlation.

## Focus

We tackle privacy along two axes:

1. **Privacy of "what"** — Using [Private Information Retrieval](/workstreams/pir/) (PIR) to protect *what* Ethereum users are reading from RPC servers. We are currently specc'ing multiple schemes (one in-house and others from recent literature) towards a [sharded design](https://notes.ethereum.org/U9xM4VOPR9isPK7lOZJUQg?view) aiming to blanket the entire Ethereum data — hot state and cold archival state.

2. **Privacy of "who"** — Through [TorJS](/workstreams/torjs/), which at the core has [Arti adapted](/feed/embedding-arti-in-the-browser) to WASM we ensure servers cannot learn *who* is making the request (network-level anonymization).

3. **Infra**  — Productionizing tooling to boost privacy work: binary-trie-enabled EL client as the source of data for our PIR work and -as a side benefit- a resource for wallets and light-clients to begin migrating to binary tries ahead of its [upgrade](https://eips.ethereum.org/EIPS/eip-7864); we also run a Snowflake instance to bridge from browser context to Tor (but only for development/testing purposes).

4. **Acceleration** - [Ideas](https://www.notion.so/efdn/PAPs-0cbd98955541825296e201936c5361f2) we don't have the bandwidth to work on but would like to see happy; we accelerate them though targeted grants. 