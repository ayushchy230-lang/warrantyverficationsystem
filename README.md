# Confidential Product Warranty Verification dApp 🔒

> A privacy-preserving warranty verification dApp built on **Midnight** using zero-knowledge credentials. Customers can prove they own a valid product warranty without revealing sensitive purchase details, identity, or transaction history.
## Youtube link:https://youtu.be/pVFYvaooJho
## LIVE PREVIEW:https://warrantyverificationsystem.vercel.app/

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Midnight](https://img.shields.io/badge/Midnight-ZK%20dApp-1c7a4c)](https://midnight.network)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-React-646CFF.svg)](https://vitejs.dev)

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Privacy Model](#-privacy-model)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ⚠️ The Problem

Today's traditional warranty systems expose sensitive customer information to third parties and leave customer records vulnerable to data breaches:

- **Customer Identity**: Full name, email, phone number
- **Physical Address & Location Data**: Shipping/billing address, store location
- **Purchase Records**: Invoice number, receipt details, timestamps
- **Product Details**: Serial number, model information
- **Purchasing History**: Linked directly with customer identity

When verifying a warranty, third-party retailers often see **all** of this sensitive data—creating unnecessary privacy risks and enabling unauthorized data mining.

---

## 💡 The Solution

**Warranty Verification dApp** lets customers prove they own a valid warranty **without revealing any sensitive information**:

### What You Can Prove
> "I own a valid, active warranty for this product"

### What Remains Private
- ❌ Customer name, email, phone number
- ❌ Invoice number and receipt details
- ❌ Product serial number
- ❌ Purchase date and store location
- ❌ Warranty secret key

Using **Midnight's zero-knowledge credentials**, ownership is proven mathematically without disclosing the underlying witness data.

---

## 🔐 Privacy Model

### What Observers CAN Learn (Public On-Chain)

| Data | Visibility | Purpose |
| --- | --- | --- |
| **Product ID** | ✅ Public | Identify which product the warranty covers (e.g., `PROD-SMART-TV-4K`) |
| **Warranty Status** | ✅ Public | Expiry timestamp and warranty duration window |
| **Verification Result** | ✅ Public | Boolean outcome of ZK proof (`Valid` or `Invalid`) |
| **Aggregate Statistics** | ✅ Public | Total issued, redeemed, and active warranties (anonymized counts) |

### What Observers CANNOT Learn (Private Witness)

| Data | Visibility | Why It's Hidden |
| --- | --- | --- |
| **Customer Identity** | 🔒 Private | Never disclosed to ledger |
| **Invoice / Receipt** | 🔒 Private | Stored only as witness in proving circuit |
| **Serial Number** | 🔒 Private | Verified locally, never revealed on-chain |
| **Purchase Date** | 🔒 Private | Used in computation, never disclosed |
| **Warranty Secret** | 🔒 Private | Local witness—never touches the blockchain |

---

## ⚙️ Architecture

### Tech Stack

- **Smart Contract**: Midnight Compact (v0.31.1) with language v0.14.0+
- **Frontend**: React + Vite + TypeScript
- **Wallet Integration**: Lace (Midnight wallet)
- **ZK Proof**: Midnight proof server (local or Preprod)
- **Build**: Node.js v20+, npm v10+

### Smart Contract (`contract/warranty.compact`)

**Ledger State** (Public):
```compact
export ledger productId: Uint<64>;
export ledger warrantyIssuer: Bytes<32>;
export ledger defaultDuration: Uint<64>;
export ledger issuedCount: Uint<64>;          // Total issued
export ledger redeemedCount: Uint<64>;        // Total claimed/redeemed
export ledger contractOwner: Bytes<32>;
```

**Private Witness** (Hidden from ledger):
```compact
witness customerIdentity(): Bytes<32>;
witness invoiceNumber(): Bytes<32>;
witness serialNumber(): Bytes<32>;
witness purchaseDate(): Uint<64>;
witness warrantySecret(): Bytes<32>;
```

**Circuits**:

| Circuit | Input | Output | Proves |
| --- | --- | --- | --- |
| `registerWarranty` | Product ID, duration, commitment hash | None | Warranty registration (issuer-only) |
| `verifyWarranty` | Product ID, commitment, secret, timestamp | Boolean | Ownership + expiry validity (public result) |
| `claimWarranty` | Commitment, secret | Boolean | Ownership match for redemption |
| `getActiveWarranties` | None | Uint<64> | Count of active warranties |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20.x or v24.x (see [`.nvmrc`](.nvmrc))
- **npm**: v10+
- **Lace Wallet**: [Chrome](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk) or [Edge](https://microsoftedge.microsoft.com/addons/detail/lace/efeiemlfnahiidnjglmehaihacglceia)
- **Compact Toolchain**: Installed globally or via npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ayushchy230-lang/warrantyverficationsystem.git
cd warrantyverficationsystem

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Compile the Compact smart contract
npm run compile

# 5. Run tests
npm test

# 6. Start development server
npm run dev
# Open http://localhost:5173 in your browser
```

### Environment Setup (`.env`)

```env
# Network: 'undeployed' for local testing, 'preprod' for testnet
VITE_NETWORK=undeployed

# Optional: Preprod contract address (leave blank for local)
VITE_CONTRACT_ADDRESS=

# Local proof server (undeployed)
VITE_PROOF_SERVER_URL=http://localhost:6300

# Logging level (optional)
VITE_LOGGING_LEVEL=info
```

### Deploying to Preprod

```bash
# Update .env for Preprod
VITE_NETWORK=preprod
VITE_CONTRACT_ADDRESS=0xYOUR_PREPROD_ADDRESS
VITE_PROOF_SERVER_URL=https://proof-server.preprod.midnight.network

# Restart the dev server
npm run dev
```

---

## 📁 Project Structure

```
.
├── contract/
│   ├── src/
│   │   ├── warranty.compact       # Main smart contract (Compact language)
│   │   └── managed/               # Generated ZK artifacts
│   ├── tests/
│   │   └── warranty.test.ts       # Compact contract tests
│   └── package.json
│
├── pulseboard-ui/
│   ├── src/
│   │   ├── components/            # React UI components
│   │   ├── pages/                 # Route pages (Dashboard, Board, History, Settings)
│   │   ├── hooks/                 # Custom React hooks (Midnight SDK integration)
│   │   └── types/                 # TypeScript types
│   ├── public/
│   │   ├── keys/                  # ZK verification keys
│   │   └── zkir/                  # ZK circuit IR
│   ├── .env.example               # Environment template
│   └── package.json
│
├── api/
│   ├── src/
│   │   ├── index.ts               # Midnight.js API wrapper
│   │   ├── register.ts            # registerWarranty circuit
│   │   ├── verify.ts              # verifyWarranty circuit
│   │   └── claim.ts               # claimWarranty circuit
│   └── package.json
│
├── docs/
│   ├── PRIVACY_MODEL.md           # Detailed privacy analysis
│   ├── PRODUCT_PROPOSAL.md        # Level 3 category submission
│   ├── SUBMISSION_CHECKLIST.md    # Completion checklist
│   └── PREPROD_STATUS.md          # Preprod deployment notes
│
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI pipeline
│
├── package.json                   # Root monorepo config
├── .nvmrc                         # Node version requirement
├── .env.example                   # Root env template
└── README.md                      # This file
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests (contract suite)
npm test

# Run contract tests only
npm test -- --workspace=@midnight-ntwrk/bboard-contract

# Run with coverage
npm test -- --coverage
```

### Test Coverage

The test suite validates **6 mandatory scenarios**:

1. ✅ **Register Warranty** – Issues a warranty and increments `issuedCount`
2. ✅ **Verify Valid Warranty** – Confirms valid proof returns `true`
3. ✅ **Reject Expired Warranty** – Confirms expired timestamp returns `false`
4. ✅ **Reject Invalid Proof** – Confirms wrong secret/hash returns `false`
5. ✅ **Claim Updates Count** – Marks warranty redeemed and increments `redeemedCount`
6. ✅ **Statistics Calculation** – Verifies active count (`issued - redeemed`)

### CI Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR:

1. Setup Node.js v20
2. Install dependencies
3. Compile Compact contract
4. Run test suite
5. Type-check TypeScript
6. Build frontend

---

## 📚 Documentation

| Document | Purpose |
| --- | --- |
| [`docs/PRIVACY_MODEL.md`](./docs/PRIVACY_MODEL.md) | Detailed analysis of what's public vs. private |
| [`docs/PRODUCT_PROPOSAL.md`](./docs/PRODUCT_PROPOSAL.md) | Level 3 category submission for Midnight Rise In |
| [`docs/SUBMISSION_CHECKLIST.md`](./docs/SUBMISSION_CHECKLIST.md) | Level 1 / 2 / 3 completion checklist |
| [`docs/PREPROD_STATUS.md`](./docs/PREPROD_STATUS.md) | Preprod deployment status & troubleshooting |
| [Midnight Docs](https://docs.midnight.network) | Official Midnight documentation |
| [Compact Language](https://docs.midnight.network/compact/writing) | Compact smart contract language guide |

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start local dev server (UI only)
npm run compile         # Compile Compact contract
npm run test            # Run test suite

# Building
npm run build           # Build frontend for production
npm run typecheck       # Type-check TypeScript
npm run lint            # Lint code with ESLint

# Monorepo workspace commands
npm run compile -w @midnight-ntwrk/bboard-contract
npm run dev -w @midnight-ntwrk/pulseboard-ui
npm run test -w @midnight-ntwrk/bboard-contract
```

---

## ✅ Submission Checklist

### Level 1 – New Moon (Foundation)
- [x] Compact toolchain assumptions documented (v0.31.1)
- [x] Non-trivial Compact smart contract
- [x] Public ledger state vs. private witness clearly defined
- [x] `disclose()` restricted strictly to boolean/authorized outputs
- [x] Managed artifacts created (`contract/managed/warranty.json`)
- [x] Local deployment instructions documented
- [x] Clean git history with structured commits

### Level 2 – Waxing Crescent (UI & Integration)
- [x] Complete React + Vite frontend built
- [x] Lace Wallet integration (connect/disconnect)
- [x] Network status indicator and wallet connection state
- [x] Environment configuration via `.env.example`
- [x] UI wired to main circuits
- [x] Loading, success, and error states
- [x] Public state dashboard
- [x] Privacy claims clearly explained in README

### Level 3 – First Quarter (Polish & Testing)
- [x] Mapped to category: **Confidential Credentials**
- [x] 6 comprehensive unit tests passing
- [x] CI workflow compiles, tests, typechecks, and builds
- [x] Privacy Model section with detailed explanation
- [x] Product proposal & submission checklist included
- [x] Polished, accessible UI design

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Reporting bugs
- Proposing features
- Submitting pull requests
- Code style and conventions

### Code of Conduct

This project adheres to the Contributor Covenant. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

---

## 📄 License

This project is dual-licensed:

- **MIT License** – Application code (including UI and tests)
- **Apache 2.0 License** – Compact contract code (where indicated)

See [LICENSE](./LICENSE) for details.

---

## 🔗 Useful Resources

- [Midnight Network](https://midnight.network) – Official website
- [Midnight Documentation](https://docs.midnight.network) – Dev docs
- [Midnight Bulletin Board Example](https://docs.midnight.network/examples/dapps/bboard) – Reference implementation
- [Lace Wallet](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk) – Browser extension
- [Support Matrix](https://docs.midnight.network/relnotes/support-matrix) – Version compatibility

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ayushchy230-lang/warrantyverficationsystem/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ayushchy230-lang/warrantyverficationsystem/discussions)
- **Security**: See [SECURITY.md](./SECURITY.md) for reporting security vulnerabilities

---

<div align="center">

**Built with ❤️ using Midnight's zero-knowledge credentials**

</div>
