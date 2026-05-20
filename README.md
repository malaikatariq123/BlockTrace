# BlockTrace: Decentralized Cryptographic Ledger & Supply Chain System

**BlockTrace** is an advanced full-stack blockchain tracing and custody accounting system, designed and built to serve as a comprehensive university graduation capstone/thesis final-year portfolio.

The architecture integrates a dual-state database (featuring real-time caching via MongoDB alongside Solidity Smart Contract state mappings on Ethereum), MetaMask wallet authorization mechanisms, a RESTful Node.js + Express API middleware core, and an interactive React presentation layer.

---

## 🚀 Key Deliverables

1.  **Solidity Smart Contract (`BlockTrace.sol`)**: Full custody handover, SKU uniqueness enforcement, and quality assurance quarantine flags using state modifier checks.
2.  **Hardhat EVM Sandbox**: Pre-configured nodes, contract compilation chains, and local network testing rigs.
3.  **Express Middleware Server**: Proxy routes serving dynamic ABIs, coordinating off-chain databases, and securing configuration secrets.
4.  **React.js Interactive Dashboard**:
    *   **Dashboard View**: Large financial meters, telemetry checkers, and wallet vector QR code mapping.
    *   **Block Explorer**: Scrolling chronological graphic connectors, Merkle roots checkers, and block header parameters checkers.
    *   **Trace Ledger**: Tabbed forms to Register Batch batches, Custody Waypoint loggers, and Regulatory quarantine alarms.
    *   **Consensus Lab Panel**: Dynamic sliders modifying mining speeds, target difficulty leading-zero solvers, and simulated system logs.
    *   **Academic Hub**: Preloaded thesis report, 15 complete examiner Viva Defense Q&As, 10-slide ppt outline, and setup scripts.

---

## 🛠 Tech Stack Matrix

*   **Contract Ledger**: Solidity `^0.8.20`
*   **Web3 CLI & Rigs**: Hardhat, Ethers.js
*   **Front-End Client**: React 19, Vite, Tailwind CSS, Motion Animations, Lucide Assets
*   **Back-End Proxy**: Node.js, Express
*   **Primary Database Cache**: MongoDB (using an automated local-file `data/db.json` sandbox fallback if MongoDB-URI coordinates are unspecified)

---

## 📁 Repository Structure

```text
BlockTrace/
├── contracts/
│   └── BlockTrace.sol             # Solidity supply chain smart contract
├── scripts/
│   └── deploy.js                 # Hardhat smart contract deployment script
├── src/
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation header & Metamask connector
│   │   ├── Dashboard.tsx         # Analytical widgets & QR card
│   │   ├── BlockchainExplorer.tsx # Visual block ledger & PoW lab
│   │   ├── SupplyChainForm.tsx   # Tracing register & inspect forms
│   │   ├── AdminPanel.tsx        # Parameter modifiers & telemetry log
│   │   └── DocumentationHub.tsx  # Viva Q&A & presentation deck
│   ├── App.tsx                   # Master App orchestrator
│   ├── main.tsx                  # Client entrypoint
│   └── types.ts                  # Shared typescript types
├── data/
│   └── db.json                   # Local virtual database JSON engine
├── server.ts                     # Full-stack Node API server & Vite static server
├── hardhat.config.cjs            # Hardhat network environment config
├── package.json                  # Script compilation matrix & dependencies
├── .env.example                  # Environmental variables configurations template
└── README.md                     # Comprehensive setup steps (This manual)
```

---

## ⚙ Run BlockTrace Locally

Ensure you have [Node.js Node-20+](https://nodejs.org/) installed on your personal computer before launching the system.

### 1️⃣ Step 1: Initialize System Code
Extract the exported ZIP package, open your terminal inside the directory, and invoke the npm package installer:
```bash
npm install
```

### 2️⃣ Step 2: Spin Up Your Personal Blockchain Node
In your terminal, boot the localized Hardhat Ethereum Virtual Machine development node:
```bash
npx hardhat node
```
This spins up a local EVM Node on `http://127.0.0.1:8545` and creates 20 pre-funded test addresses preloaded with 10,000 ETH each.

### 3️⃣ Step 3: Deploy Solidity Smart Contracts
Launch a second terminal, and run our automated compiler deployment script targeting your running localhost node:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
Record the compiled contract hash address printed inside the terminal logs (e.g., `0x9FdB77Db3BbeBdB773...`).

### 4️⃣ Step 4: Configure the Environment Variables
Duplicate the template environmental configuration file:
```bash
cp .env.example .env
```
Open `.env` in your text editor and write your newly deployed contract address:
```env
CONTRACT_ADDRESS="PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE"
```

*Optionally*, add your MongoDB Atlas credentials into the `MONGODB_URI` field to transition our backend from the localized JSON file engine into production databases.

### 5️⃣ Step 5: Start Servers
Execute the start commands to boot the system:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to interact with your fully functional blockchain project!

---

## 🔬 Presentation Checklist: Ace Your Viva Defenses

To assist you during academic reviews, navigate to the **Academic Hub** tab directly in our live dashboard. Inside, you can review, copy, and download:
1.  **Completed Chapters 1 - 4 Thesis Report Structure** mapping systems engineering diagrams.
2.  **15 Custom Examiner Oral Board Q&As** specifying database fallback, modifiers authorization check, and security scales.
3.  **10-Slide Deck Slide Matrix** outlining bulleted points ready to compile inside Microsoft PowerPoint.
4.  **Grading Script Walkthroughs** outlining step-by-step clicks to execute during your active teacher presentation.
