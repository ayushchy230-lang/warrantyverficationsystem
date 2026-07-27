# Confidential Product Warranty Verification - Project Proposal

> **Midnight Hackathon Submission** | Category: **Level 3 - Confidential Credentials**

---

## Project Summary

**Confidential Product Warranty Verification** is a privacy-preserving decentralized application (dApp) built on the **Midnight blockchain** using zero-knowledge credentials. It allows customers to prove they own a valid product warranty without ever revealing sensitive personal data, purchase receipts, invoice numbers, product serial numbers, or customer identity.

**Live Preview**: https://warrantyverificationsystem.vercel.app/
**YouTube Demo**: https://youtu.be/pVFYvaooJho
**Repository**: https://github.com/ayushchy230-lang/midnight01

---

## Problem Statement

Today's traditional warranty systems are fundamentally broken from a privacy perspective:

| Problem | Impact |
|---|---|
| Customer PII exposed during verification | Identity theft risk |
| Purchase history linked to identity | Surveillance / profiling |
| Centralized warranty databases | Single point of data breach |
| Third-party verifiers see all sensitive data | Data leakage to retailers and insurers |
| No cryptographic proof of authenticity | Warranty fraud and counterfeiting |

**Data exposed in traditional warranty checks:**
- Full Customer Name & Contact Info
- Purchase Invoice & Store Receipts
- Product Serial Number
- Purchase Date & Store Location
- Financial Information (payment method)

---

## Solution

A zero-knowledge dApp where customers can prove:

> **"I own a valid warranty for this product."**

without disclosing **any** of the following:

- Invoice number or retailer receipt
- Customer identity, name, or email
- Product serial number
- Purchase date or location
- Warranty secret key or salt

The proof is generated **entirely client-side** as a ZK witness, and only the boolean result (`true` / `false`) is disclosed on-chain.

---

## Category Classification

| Field | Value |
|---|---|
| **Category** | Level 3 - Confidential Credentials |
| **Privacy Mechanism** | Zero-Knowledge Witnesses (`witness` keyword) |
| **On-chain Disclosure** | Boolean result only via `disclose()` |
| **Blockchain** | Midnight (Cardano ecosystem) |
| **Smart Contract Language** | Compact v0.31.1 |
| **Frontend** | React + Vite + TypeScript |
| **Live Demo** | https://warrantyverificationsystem.vercel.app/ |

### Why "Confidential Credentials"?

This project is a **Confidential Credential** dApp because:

1. The warranty acts as a **private credential** held by the customer.
2. The credential is committed as a **ZK hash** (commitment scheme) on-chain.
3. The customer **proves possession** of the credential without revealing its contents.
4. Only the **boolean verification result** is publicly observable - no personal data ever touches the ledger.

This is the canonical definition of a Confidential Credential as described by the Midnight documentation.

---

## Privacy Model & ZK Protocol Design

### Public (On-Chain Ledger State)

| Ledger Field | Type | Purpose |
|---|---|---|
| `productId` | `Uint<64>` | Public product identifier |
| `warrantyIssuer` | `Bytes<32>` | Manufacturer identifier |
| `defaultDuration` | `Uint<64>` | Default warranty window (seconds) |
| `issuedCount` | `Uint<64>` | Total warranties issued (aggregate) |
| `redeemedCount` | `Uint<64>` | Total warranties claimed (aggregate) |
| `registeredCommitments` | `Map<Bytes<32>, Uint<64>>` | Commitment hash to expiry timestamp |
| `claimedCommitments` | `Map<Bytes<32>, Boolean>` | Commitment hash to claimed flag |

### Private (Client-Side Witnesses - Never On-Chain)

| Witness | Type | Data |
|---|---|---|
| `customerIdentity()` | `Bytes<32>` | Customer email / identity hash |
| `invoiceNumber()` | `Bytes<32>` | Purchase invoice number |
| `serialNumber()` | `Bytes<32>` | Product serial number |
| `purchaseDate()` | `Uint<64>` | Unix timestamp of purchase |
| `warrantySecret()` | `Bytes<32>` | Customer private secret key |

### ZK Circuit Flow

```
CLIENT DEVICE
  Private Witness Data:
  { customerIdentity, invoiceNumber, serialNumber, purchaseDate, warrantySecret }
          |
          v
  [ computeWarrantyCommitment() ]
          |
          v
  commitmentHash (public) ─────────────────────────────►

MIDNIGHT BLOCKCHAIN
  verifyWarranty(productId, commitmentHash, secretKey, timestamp)
          |
          v
  exists in registeredCommitments?
  currentTimestamp <= expiry?
  secretKey == witness.warrantySecret()
          |
          v
  disclose(true | false)

  PUBLIC OUTPUT: Boolean only. No PII. No secrets.
```

---

## Midnight Features Utilized

| Feature | Usage |
|---|---|
| **`export ledger`** | Public aggregate statistics, commitment maps |
| **`witness`** | All customer PII and secrets - executed locally |
| **`disclose()`** | Strictly limited to boolean verification result |
| **`Map<K, V>`** | Commitment hash registry and claimed status map |
| **ZK Proof Generation** | Client-side commitment scheme via SHA-256 hashing |

---

## Architecture Overview

```
midnight01/
├── contract/
│   ├── warranty.compact          # Midnight Compact smart contract
│   └── managed/
│       └── warranty.json         # Compiled contract artifacts
├── src/
│   ├── components/               # React UI components
│   ├── services/
│   │   └── midnightService.ts    # Midnight SDK interface
│   └── utils/
│       └── cryptoUtils.ts        # ZK commitment utilities
├── tests/
│   └── warranty.test.ts          # 6 comprehensive unit tests
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions CI pipeline
├── PROPOSAL.md                   # This document
└── README.md                     # Setup & usage instructions
```

---

## Test Coverage (6 Mandatory Scenarios)

| # | Test | Expected |
|---|---|---|
| 1 | Register warranty → commitment on ledger | `issuedCount` increments |
| 2 | Verify valid warranty with correct secret | Returns `true` |
| 3 | Reject expired warranty | Returns `false` |
| 4 | Reject invalid proof (wrong secret / fake hash) | Returns `false` |
| 5 | Claim warranty → updates public redeemed count | `redeemedCount` increments |
| 6 | Statistics: active = issued minus redeemed | Correct aggregate math |

---

## CI/CD Pipeline

Every push and pull request to `main` triggers the full pipeline:

1. Checkout & Node.js v20 setup
2. `npm ci` - install dependencies
3. `npm run compile` - compile Compact contract
4. `npm test` - run all 6 unit tests (Vitest)
5. `npm run typecheck` - TypeScript type checking
6. `npm run build` - production frontend build

**CI Status**: [![CI](https://github.com/ayushchy230-lang/midnight01/actions/workflows/ci.yml/badge.svg)](https://github.com/ayushchy230-lang/midnight01/actions/workflows/ci.yml)

---

## Submission Checklist

### Level 3 - First Quarter (Confidential Credentials)
- [x] Project mapped to official category: Confidential Credentials
- [x] 6 comprehensive unit tests passing
- [x] GitHub Actions CI workflow (compile, test, typecheck, build)
- [x] Live CI badge in README
- [x] Privacy Model section detailing observer visibility
- [x] PROPOSAL.md with full project proposal
- [x] Polished glassmorphic dark UI design
- [x] Live deployment: https://warrantyverificationsystem.vercel.app/

---

## Author

| Field | Detail |
|---|---|
| **GitHub** | [ayushchy230-lang](https://github.com/ayushchy230-lang) |
| **Repository** | [midnight01](https://github.com/ayushchy230-lang/midnight01) |
| **Live Preview** | [warrantyverificationsystem.vercel.app](https://warrantyverificationsystem.vercel.app/) |
| **Demo Video** | [YouTube](https://youtu.be/pVFYvaooJho) |
| **Submission Level** | Level 3 - First Quarter (Confidential Credentials) |

---

*Built with love on Midnight - where privacy is a first-class citizen.*
