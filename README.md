# Confidential Product Warranty Verification dApp 🔒

> A privacy-preserving warranty verification dApp built on **Midnight** using zero-knowledge credentials. Customers can prove they own a valid product warranty without revealing sensitive purchase receipts, invoice numbers, product serial numbers, or personal identity.

---

## 📌 Product Proposal & Category

### Category: Level 3 - Confidential Credentials ✅
This application is built as a **Confidential Credential** dApp on Midnight. Rather than storing sensitive purchase credentials directly on an immutable ledger or broadcasting personal customer records, the user proves possession of a valid credential (the product warranty) using client-side zero-knowledge witnesses without exposing the underlying data.

---

## ⚠️ Problem

Today's traditional warranty systems expose sensitive customer information to third parties, store databases vulnerable to leaks, and link purchasing history directly with identity:

- Customer Full Name
- Phone Number & Physical Address
- Purchase Invoice & Store Receipts
- Product Serial Number
- Purchase Date & Store Location

Anyone verifying a warranty often sees all of this sensitive data.

---

## 💡 Solution

The dApp lets a customer prove:

> **"I own a valid warranty."**

without revealing:

- Invoice number
- Customer identity / email
- Purchase receipt
- Product serial number
- Purchase location

---

## 🔐 Privacy Model & Zero-Knowledge Protocol

### What Observers CAN Learn (Public On-Chain Ledger)
- **Product ID**: The public product identifier (e.g. `PROD-SMART-TV-4K`).
- **Warranty Duration**: Expiry timestamp window.
- **Aggregate Statistics**: Total number of issued warranties, total redeemed warranties, and active warranties count.
- **Disclosed Verification Result**: Only the boolean result of a ZK proof execution (`true` or `false`).

### What Observers CANNOT Learn (Private Witness - Hidden Forever)
- ❌ Customer name, email, phone number, or identity.
- ❌ Invoice number or retailer receipt details.
- ❌ Product serial number.
- ❌ Purchase date or exact purchase location.
- ❌ Customer warranty secret key or salt.

---

## ⚡ Midnight Features Used

- ✅ **Public ledger state**: Contract tracks aggregate metrics (`issuedCount`, `redeemedCount`, `productId`).
- ✅ **Private witness**: Witness data (`customerIdentity`, `invoiceNumber`, `serialNumber`, `warrantySecret`) is executed locally on client.
- ✅ **Zero-knowledge proof**: Generates ZK proof off-chain.
- ✅ **`disclose()` function**: Limits circuit return strictly to the boolean verification result (`true`/`false`).

---

## ⚙️ Compact Toolchain & Smart Contract (`contract/warranty.compact`)

- **Compact Compiler Version**: `0.31.1` (pragma `language_version >= 0.14.0;`)
- **Standard Library**: `import CompactStandardLibrary;`
- **Managed Artifacts**: Generated in `contract/managed/` directory (`contract/managed/warranty.json`).

```compact
pragma language_version >= 0.14.0;

import CompactStandardLibrary;

export ledger productId: Uint<64>;
export ledger warrantyIssuer: Bytes<32>;
export ledger defaultDuration: Uint<64>;
export ledger issuedCount: Uint<64>;
export ledger redeemedCount: Uint<64>;
export ledger contractOwner: Bytes<32>;

witness customerIdentity(): Bytes<32>;
witness invoiceNumber(): Bytes<32>;
witness serialNumber(): Bytes<32>;
witness purchaseDate(): Uint<64>;
witness warrantySecret(): Bytes<32>;

export circuit registerWarranty(pId: Uint<64>, duration: Uint<64>, commitmentHash: Bytes<32>): []
export circuit verifyWarranty(pId: Uint<64>, commitmentHash: Bytes<32>, secretKey: Bytes<32>, currentTimestamp: Uint<64>): Boolean
export circuit claimWarranty(commitmentHash: Bytes<32>, secretKey: Bytes<32>): Boolean
export circuit getActiveWarranties(): Uint<64>
```

---

## 🌐 Preprod Deployment Status (Mentor Guidance)

> **Deployment Status**: **BLOCKED / WAIVED** per official mentor instruction.
> 
> *Mentor Guidance:* "If Preview/Preprod deployment is blocked or unable to complete, do not block the project. The mentor said: 'If you're unable to deploy, just build the full-stack dApp and submit it. Skip the deployment part for now. Vibe-code the full-stack dApp using the prompt, then submit.'"
> 
> The project includes a complete full-stack TypeScript ZK contract simulator and Midnight SDK interface so that all functionality, ZK verification logic, frontend flows, and unit tests run 100% locally out-of-the-box.

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v20+ or v24+
- **NPM**: v10+

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Contents of `.env.example`:
```env
VITE_NETWORK=undeployed
VITE_CONTRACT_ADDRESS=
VITE_PROOF_SERVER_URL=http://localhost:6300
```

### 4. Local Undeployed Contract Setup / Compilation
```bash
npm run setup -- --network undeployed
# or
npm run compile
```

### 5. Run Automated Tests
```bash
npm test
```

### 6. Start Frontend Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 Switching to Preprod Testnet

Once a Preprod contract address is deployed, update your `.env` configuration:

```env
VITE_NETWORK=preprod
VITE_CONTRACT_ADDRESS=0xYOUR_PREPROD_CONTRACT_ADDRESS
VITE_PROOF_SERVER_URL=https://proof-server.preprod.midnight.network
```

Restart the frontend (`npm run dev`) to connect directly to the Midnight Preprod testnet.

---

## 🧪 Test Suite Verification (`tests/warranty.test.ts`)

The test suite validates all 6 mandatory scenarios:

1. **Register warranty**: Verifies commitment registration and increment of `issuedCount`.
2. **Verify valid warranty**: Confirms valid proof with correct secret returns `true`.
3. **Reject expired warranty**: Confirms expired timestamp returns `false`.
4. **Reject invalid proof**: Confirms invalid secret or fake hash returns `false`.
5. **Claim updates redeemed count**: Confirms claiming marks commitment redeemed and increments `redeemedCount`.
6. **Statistics calculation**: Verifies active warranties calculation (`active = issued - redeemed`).

To run tests:
```bash
npm test
```

---

## 🛠️ GitHub Actions CI/CD Pipeline (`.github/workflows/ci.yml`)

The CI workflow executes on every Push & PR:
1. **Checkout code** & setup Node.js v20.
2. **Install dependencies** (`npm ci`).
3. **Compile Compact contract** (`npm run compile`).
4. **Run tests** (`npm test`).
5. **Type check** (`npm run typecheck`).
6. **Build frontend** (`npm run build`).

---

## ✅ Submission Checklist

### Level 1 - New Moon
- [x] Compact toolchain assumptions documented (Compact 0.31.1).
- [x] Non-trivial Compact smart contract (`contract/warranty.compact`).
- [x] Public ledger state vs. private witness logic defined.
- [x] `disclose()` restricted strictly to boolean output.
- [x] Managed artifacts created (`contract/managed/warranty.json`).
- [x] Local deploy / setup instructions documented.
- [x] Preprod deploy status documented as blocked per mentor guidance.
- [x] Clean git history with structured commits.

### Level 2 - Waxing Crescent
- [x] Complete React + Vite frontend UI built.
- [x] Lace Wallet & Proof Server connect/disconnect modal.
- [x] Visible network status pill and wallet connection state.
- [x] Network & contract address configurable via environment variables (`.env.example`).
- [x] UI wired to main circuits (`registerWarranty`, `verifyWarranty`, `claimWarranty`).
- [x] UI loading, success (`✅ Valid`), and error (`❌ Invalid`) states.
- [x] Public state dashboard panel.
- [x] README explains privacy claims and local run instructions.

### Level 3 - First Quarter
- [x] Project mapped to official category: **Confidential Credentials**.
- [x] 6 comprehensive unit tests passing.
- [x] GitHub Actions CI workflow runs contract compilation (`npm run compile`), unit tests (`npm test`), typecheck (`npm run typecheck`), and frontend build (`npm run build`).
- [x] Privacy Model section detailing observer visibility.
- [x] Product proposal & full submission checklist.
- [x] Polished glassmorphic dark design.
#   m i d n i g h t 0 1  
 