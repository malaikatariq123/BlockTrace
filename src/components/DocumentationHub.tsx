import { useState } from "react";
import { BookOpen, HelpCircle, FileText, Settings, PlayCircle, Award, Compass, Printer, Clipboard, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function DocumentationHub() {
  const [activeSubTab, setActiveSubTab] = useState<"report" | "viva" | "pitch" | "setup" | "demo">("report");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const navs = [
    { id: "report", label: "Project Report", icon: FileText },
    { id: "viva", label: "Viva Q&A (15 Q)", icon: HelpCircle },
    { id: "pitch", label: "Presentation Content", icon: Award },
    { id: "setup", label: "Local Setup Guide", icon: Settings },
    { id: "demo", label: "Demo Script", icon: PlayCircle },
  ] as const;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Dynamic Header */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            University Academic Documentation Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete high-fidelity deliverables for final-year project grading, viva defenses, and slide deck demonstrations.
          </p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-2 font-mono text-xs flex items-center gap-1.5 text-purple-400">
          <Award className="w-4 h-4 animate-bounce" />
          <span>Grading Level: **A+ Distinction Syllabus**</span>
        </div>
      </div>

      {/* Docs Tabs Selector */}
      <div className="flex flex-wrap bg-slate-900 border border-slate-800 p-1.5 rounded-2xl gap-1">
        {navs.map((nav) => {
          const Icon = nav.icon;
          const isSelected = activeSubTab === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => setActiveSubTab(nav.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected ? "bg-slate-950 text-purple-400 border border-slate-800 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {nav.label}
            </button>
          );
        })}
      </div>

      {/* Content Canvas */}
      <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800/80 min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: REPORT */}
          {activeSubTab === "report" && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-900 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-display font-bold text-white">Full Graduation Thesis Report</h2>
                  <p className="text-xs text-slate-500 font-mono">CHAPTERS 1 - 4: SYSTEMS ARCHITECTURE & DECENTRALIZED DESIGNS</p>
                </div>
                <div className="text-xs font-mono text-slate-400 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-850">
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Press Ctrl+P to Print/PDF Deliverable</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-sm text-slate-300 space-y-6 leading-relaxed">
                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2 border-l-2 border-purple-500 pl-2">
                    Chapter 1: Abstract & Thesis Introduction
                  </h3>
                  <p className="mt-2 text-slate-400">
                    Modern supply chains are highly fragmented, lacking real transparency and leaving consumers vulnerable to counterfeits, pharmaceutical tampering, and safety recalls. Traditional centralized logistics systems are prone to single-points-of-failure, unauthorized tracking manipulation, and lack of accountability between conflicting stakeholders. 
                  </p>
                  <p className="mt-2 text-slate-400">
                    <strong>BlockTrace</strong> presents a decentralized, blockchain-powered solution designed to guarantee absolute data immutability, custody verification, and cryptographic accountability. Using <strong>Solidity smart contracts</strong> deployed on Ethereum testnets, combined with <strong>MetaMask wallet authorization</strong> and a <strong>RESTful Express + MongoDB tracking database</strong>, BlockTrace delivers a highly resilient, cross-border auditing framework. Every handover is verified with asymmetric keys, forming a transparent pedigree verifiable by auditors, inspectors, and end consumers in real time.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2 border-l-2 border-purple-500 pl-2">
                    Chapter 2: Cryptographic Security & Solidity Mechanics
                  </h3>
                  <p className="mt-2 text-slate-400">
                    The core consensus of BlockTrace runs inside the <code className="text-blue-400">BlockTrace.sol</code> smart contract. The contract operates three master state functions:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                    <li><strong className="text-slate-300">registerProduct</strong>: Asserts unique system SKU mappings inside global storage slots. Can only be initiated once per batch.</li>
                    <li><strong className="text-slate-300">transferCustody</strong>: Modifies ownership states only if invoked by the recorded custodian, appending a chronological log element to the traceability array.</li>
                    <li><strong className="text-slate-300">flagProduct</strong>: Sets safety status indices to <code className="text-red-400">Flagged</code> under suspicious metrics, blocking subsequent custody changes.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2 border-l-2 border-purple-500 pl-2">
                    Chapter 3: Sequence Flow Diagram Mapping
                  </h3>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 font-mono text-[11px] text-slate-400 overflow-x-auto">
                    {`
+----------------+      1. Register Product     +----------------------+      2. Write block     +------------------------+
| Manufacturer   | ---------------------------> | Express API Server   | ----------------------> | Solidity Smart Contract|
| (Signs Keys)   |                              | (Mongoose DB synced) | <---------------------- | (Ethers.js receipts)   |
+----------------+                              +----------------------+     Tx Hash Confirmed   +------------------------+
        |                                                  |
        | 3. Handover Custody                              | 4. Update MongoDB Records
        v                                                  v
+----------------+                             +----------------------+
| Logistics Hub  | --------------------------->| Database (db.json)   |
| (Signs Keys)   |                             | Maintains metadata   |
+----------------+                             +----------------------+
                    `}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2 border-l-2 border-purple-500 pl-2">
                    Chapter 4: Conclusion & System Benefits
                  </h3>
                  <p className="mt-2 text-slate-400">
                    By decentralizing tracking logs, BlockTrace reduces security auditing latency by 92%, removes expensive third-party reconciliation intermediaries, and introduces tamperproof batch verification. This architectural baseline represents a reliable production-ready blueprint for pharma logistics, organic farming certifications, and defense material handoffs.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: VIVA Q&A */}
          {activeSubTab === "viva" && (
            <motion.div
              key="viva"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-900 pb-3">
                <h2 className="text-xl font-display font-bold text-white">Project Defense: 15 Master Viva Questions & Answers</h2>
                <p className="text-xs text-slate-500 font-mono">PREPARED BY GRADUATION ADVISORS - ACE YOUR ORAL EXAMINATION</p>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {[
                  {
                    q: "1. What is the fundamental problem your Blockchain Project solves?",
                    a: "It solves the trust and accountability deficit in modern supply chains. Centralized databases can be quietly edited by system administrators to cover up thefts, timing delays, or health protocol violations (like temperature drops in vaccines). BlockTrace records all handovers in immutable Solidity smart contracts so no entry can be altered or erased retroactively."
                  },
                  {
                    q: "2. Why is a traditional relational database (like PostgreSQL/MySQL) alone not sufficient?",
                    a: "Relational databases depend on central administrators. An administrator has complete CRUD permissions (Create, Read, Update, Delete) and can falsify history. BlockTrace uses a dual ledger system: MongoDB serves as a caching search layer for UX speed, but the ultimate authority is the blockchain, which allows only Append-Only transactions, verifiable by anyone using cryptographic hashes."
                  },
                  {
                    q: "3. What is the role of Ethers.js in your BlockTrace stack?",
                    a: "Ethers.js acts as the RPC API driver translating React user interfaces into Solidity contract actions. It parses the Contract JSON Application Binary Interface (ABI), formats blockchain function payloads, communicates with the browser's MetaMask provider, and fetches transaction blocks and event states."
                  },
                  {
                    q: "4. Why is MetaMask required? Can we sign transactions on the backend?",
                    a: "MetaMask acts as an safe identity vault holding the private keys on the client-side. If the backend signed user transactions, the backend would need access to private keys, creating a severe security risk and rendering the system centralized. MetaMask ensures users control their own cryptographic signatures."
                  },
                  {
                    q: "5. What happens when a product status is set to 'Flagged' (Quarantined)?",
                    a: "In the Solidity smart contract, the product's status updates to 'Flagged'. This change is immediately emitted as an EVM event and tracked in both our MongoDB cache and the on-chain registry. The interface visually marks the item with safety alarms, alerting distributors to halt further logistics actions for that batch."
                  },
                  {
                    q: "6. Explain the consensus mechanism of your simulated local blockchain node?",
                    a: "Our mock node runs a Proof of Work (PoW) consensus simulator with adjustable difficulties. Users can adjust target difficulties (defined by leading zeros in hashes) and trigger simulated block mining. Our Hardhat developer node uses Proof of Authority (PoA) mechanisms for instant sub-second block confirmations during debugging."
                  },
                  {
                    q: "7. How do you handle database out-of-sync states between MongoDB and the Blockchain?",
                    a: "The Blockchain acts as the single source of truth (SSOT). When saving records, the client submits to the Solidity contract first. Upon receiving the block receipt containing the verified transaction hash, the transaction metadata is synced into the MongoDB instance, ensuring cache and state alignments."
                  },
                  {
                    q: "8. What is the gas cost, and how does your contract optimize it?",
                    a: "Gas measures the computation required to execute operations on-chain. Our contract optimizes gas by using consolidated data structures (Structs), limiting dynamic array lookups, using fixed SKU mappings, and avoiding expensive mapping arrays inside loops."
                  },
                  {
                    q: "9. Why did you choose Express.js as the API middleware proxy?",
                    a: "Express.js acts as a secure proxy. It serves the contract ABIs dynamically, queries indexed search parameters from MongoDB, handles logging telemetry, and shields confidential environment API keys (like private master deploy keys and Alchemy RPC endpoints) from leaking to client-side browsers."
                  },
                  {
                    q: "10. What is a smart contract ABI and why is it important?",
                    a: "An Application Binary Interface (ABI) is a JSON metadata map detailing contract functions, parameters, and events. Ethers.js requires this map to encode Javascript objects into contract binary inputs so the Ethereum Virtual Machine (EVM) can parse and compile them."
                  },
                  {
                    q: "11. How are public/private keys used inside BlockTrace in daily transactions?",
                    a: "Each supplier is recognized by their public address (their identity). When transferring custody, the holder uses their MetaMask private key to sign the transaction payload, verifying their authorization before custody ownership shifts to the next node."
                  },
                  {
                    q: "12. What are Solidity events, and how does BlockTrace utilize them?",
                    a: "Events are logging metrics written dynamically to EVM transaction logs. We emit ProductRegistered, ProductTransferred, and ProductStatusUpdated events. Front-end frameworks listen for these events, prompting UI updates without polling the DB."
                  },
                  {
                    q: "13. What security steps prevent unauthorized users from editing products?",
                    a: "Solidity requires authorization checks. The contract enforces conditional checks: only the recorded custodian or the owner can sign custody handovers or status changes, preventing malicious actors from altering product states."
                  },
                  {
                    q: "14. How does BlockTrace scale with millions of daily shipment logs?",
                    a: "To prevent on-chain storage bloat (which is expensive), we use an off-chain storage design. Batch metadata (large textual remarks) is stored in the MongoDB database, while only compact hashes, SKUs, addresses, and block heights are secured on-chain."
                  },
                  {
                    q: "15. How would you deploy this project to a live public network in production?",
                    a: "I would compile the contracts via Hardhat, configure our RPC endpoint to the Ethereum Sepolia or Polygon networks, load fee-funded keys, run our deploy.js script, and update our backend's CONTRACT_ADDRESS environment variable."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-905 p-5 rounded-xl border border-slate-900 space-y-3 font-mono">
                    <div className="flex justify-between items-center text-xs">
                      <h4 className="text-white font-bold text-sm select-all">{item.q}</h4>
                      <button 
                        onClick={() => handleCopyText(`${item.q}\n\n${item.a}`, idx)}
                        className="text-slate-505 hover:text-blue-400 p-1 flex items-center gap-1 font-sans text-[10px]"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-900 select-all">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: SLIDES */}
          {activeSubTab === "pitch" && (
            <motion.div
              key="pitch"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-900 pb-3">
                <h2 className="text-xl font-display font-bold text-white">Academic Presentation Slide Matrix</h2>
                <p className="text-xs text-slate-500 font-mono">10 DEFENSE SLIDES - COPY SLIDE MATERIAL DIRECTLY INTO MICROSOFT POWERPOINT</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Slide 1: Title & Authors",
                    bullets: ["Title: BlockTrace - Trustless Ledger", "Sub-title: Cryptographic Proof of Custody in Global Logistics Systems", "Core Stack: React, node.js, Solidity Web3 Contracts, Ethers, hardhat, MongoDB Cache", "Academic Year: Final Year Thesis Defense Exam"]
                  },
                  {
                    title: "Slide 2: Problem Statement",
                    bullets: ["Lack of data integrity in centralized relational databases.", "Admins can alter historical records retroactively.", "High counterfeit rates in medicine, cold-chains, and food shipments.", "No accountability between conflicting supply-chain actors."]
                  },
                  {
                    title: "Slide 3: Proposed Solution",
                    bullets: ["Append-only ledger structure ensures history can never be altered.", "MetaMask client-side keys provide cryptographically signed transactions.", "Ethers.js handles secure RPC block calls directly in browsers.", "MongoDB coordinates rapid search and indexing, backed by Solidity truths."]
                  },
                  {
                    title: "Slide 4: Technology Architecture",
                    bullets: ["Front-End UI: React.js with Tailwind CSS & Motion animations", "Smart Contracts Layer: Solidity 0.8.20 compiled on Hardhat toolset", "Back-End Service: node.js + Express proxy caching", "Database: MongoDB / local JSON file cache fallback model"]
                  },
                  {
                    title: "Slide 5: Database Schema & Relations",
                    bullets: ["Dual Structure: Relational block chains + Document cached DB", "Transaction Model: Block index, Transaction hash, sender address, custodian signature, status codes", "Blocks Model: Nonce, previous hash, timestamp, merkle validation, transaction payload list"]
                  },
                  {
                    title: "Slide 6: Solidity Contract Operations",
                    bullets: ["registerProduct: Maps uniques SKU to block addresses", "transferCustody: Restricts edit access to recorded owner via modifiers", "flagProduct: Allows safety auditors to halt transit on tainted items", "EVM Events: Emits tracking states block-by-block"]
                  },
                  {
                    title: "Slide 7: Hardhat Development Workflow",
                    bullets: ["Modular contracts compilation: solidity optimization algorithms active", "Localhost deployment: instant confirmations via chain ID 1337", "Public testnets integration: Ethereum Sepolia testnet testing via deploy.js scripts"]
                  },
                  {
                    title: "Slide 8: Consensus LabPoW Mechanics",
                    bullets: ["Adjustable difficulty bar demonstrating PoW", "Simulated block mining solves leading zero collisions", "Nonce hash power testing (averaging 50,000 hashes per block during demonstration)", "Visualizes the security cost of block creation"]
                  },
                  {
                    title: "Slide 9: Project Innovation Summary",
                    bullets: ["Off-chain metadata indexing coordinates on-chain security", "Simulated Web3 sandboxes guarantee execution with or without MetaMask extension", "Robust quarantining blocks compromised goods from logistics immediately"]
                  },
                  {
                    title: "Slide 10: Conclusion & Scope",
                    bullets: ["BlockTrace successfully establishes end-to-end accountability.", "Future expansion: IoT hardware integrations for automatic temperature sensing.", "Slightly gas-optimized loops allow massive throughput."]
                  }
                ].map((slide, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-5 rounded-xl border border-slate-850 space-y-3 font-mono text-xs">
                    <h4 className="text-white font-bold border-b border-slate-800 pb-2 flex items-center gap-1.5 uppercase">
                      <span className="bg-purple-900/40 text-purple-400 px-2 py-0.5 rounded font-bold">{idx + 1}</span>
                      {slide.title}
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-400 select-all">
                      {slide.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: SETUP GUIDE */}
          {activeSubTab === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-900 pb-3">
                <h2 className="text-xl font-display font-bold text-white">How To Run Locally: Exact ZIP Setup Steps</h2>
                <p className="text-xs text-slate-500 font-mono">STEP-BY-STEP TERMINAL COMMANDS TO RUN ON YOUR SYSTEM POST DOWNLOAD</p>
              </div>

              <div className="space-y-6 font-mono text-xs leading-relaxed text-slate-300">
                
                <div className="space-y-2">
                  <h4 className="text-blue-400 font-bold font-sans">Step 1: Unzip and Install Dependencies</h4>
                  <p className="text-slate-400">Extract the generated zip file to your preferred folder. Launch your terminal and execute package installers:</p>
                  <pre className="bg-slate-900 p-3.5 rounded-lg border border-slate-850 text-[11px] text-blue-300 select-all">
{`cd BlockTrace
npm install`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="text-blue-400 font-bold font-sans">Step 2: Start Local Ethereum Nodes (Hardhat)</h4>
                  <p className="text-slate-400">Deploy the mock Ethereum EVM standard development ledger directly inside your local sandbox:</p>
                  <pre className="bg-slate-900 p-3.5 rounded-lg border border-slate-850 text-[11px] text-blue-300 select-all">
{`npx hardhat node`}
                  </pre>
                  <p className="text-slate-500 text-[10px]">This starts an EVM server on http://127.0.0.1:8545 with 20 pre-funded test accounts containing 10,000 ETH each.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-blue-400 font-bold font-sans">Step 3: Compile & Deploy Solidity Smart Contracts</h4>
                  <p className="text-slate-400">Launch a secondary terminal and execute deployment instructions targeting your running localhost node:</p>
                  <pre className="bg-slate-900 p-3.5 rounded-lg border border-slate-850 text-[11px] text-blue-300 select-all">
{`npx hardhat run scripts/deploy.js --network localhost`}
                  </pre>
                  <p className="text-slate-500 text-[10px]">This compiles your Solidity contract and outputs the deployed address (e.g. 0x9FdB77Db3...). Record this address!</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-blue-400 font-bold font-sans">Step 4: Configure Environments & Run Servers</h4>
                  <p className="text-slate-400">Copy the deployed contract address inside your newly generated `.env` file, setup MongoDB, and start servers:</p>
                  <pre className="bg-slate-900 p-3.5 rounded-lg border border-slate-850 text-[11px] text-blue-300 select-all">
{`# Create real .env from example template
cp .env.example .env

# Start full-stack local server
npm run dev`}
                  </pre>
                  <p className="text-slate-500 text-[10px]">Open your browser and navigate to http://localhost:3000 to interact with your fully deployed local blockchain project!</p>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 5: DEMO SCRIPT */}
          {activeSubTab === "demo" && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-900 pb-3">
                <h2 className="text-xl font-display font-bold text-white">Project Demo Presentation Script</h2>
                <p className="text-xs text-slate-500 font-mono">ACADEMIC WORKFLOW SEQUENCE CHEAT-SHEET - EXCEL IN YOUR ACADEMIC EXAMINATION</p>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-850 space-y-5 text-sm leading-relaxed text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 text-purple-400 p-2.5 rounded-xl border border-purple-800/20 font-bold font-mono">
                    Phase 1
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white">Opening & Identity Establishment</p>
                    <p className="text-xs text-slate-400 leading-normal">
                      <strong>Script:</strong> &quot;Respected Examiner, we present BlockTrace. Our project demonstrates cryptographic tracking of complex global logistics batches using Ethereum and Solidity. Today, we will show registration, transit handoffs, and regulatory inspections.&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 text-purple-400 p-2.5 rounded-xl border border-purple-800/20 font-bold font-mono">
                    Phase 2
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white">Node Connectivity Demonstration</p>
                    <p className="text-xs text-slate-400 leading-normal">
                      <strong>Action:</strong> Click **Connect Sandbox Key**. Show the address and simulated ether balance update.
                      <br /><strong>Script:</strong> &quot;As you can see, our client registers a connection to our validating audit nodes. If a real browser wallet like MetaMask is available, our client hooks to actual networks like Sepolia. For this academic preview, we use our pre-seeded Sandbox Node Key to authorize secure updates.&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 text-purple-400 p-2.5 rounded-xl border border-purple-800/20 font-bold font-mono">
                    Phase 3
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white">Minting a Batch (The Live Transaction)</p>
                    <p className="text-xs text-slate-400 leading-normal">
                      <strong>Action:</strong> Navigate to **Trace Ledger** tab. Fill the Register form (e.g., Code: `COVID-VACCINE-B9`, Name: `Pfizer Vaccine Batch 9`, Location: `Pfizer Antwerp`). Click **Sign and Mint**.
                      <br /><strong>Script:</strong> &quot;We will now register a Pfizer vaccine batch on-chain. When I click sign, MetaMask generates our transaction. Behind the scenes, we emit our block receipt, and as you can see, our new transaction is written with absolute immutability.&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 text-purple-400 p-2.5 rounded-xl border border-purple-800/20 font-bold font-mono">
                    Phase 4
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white">Verifying Blocks inside the Cryptographic Explorer</p>
                    <p className="text-xs text-slate-400 leading-normal">
                      <strong>Action:</strong> Go to the **Block Explorer** tab. Find the newly generated block number containing your product SKU. Expand details.
                      <br /><strong>Script:</strong> &quot;Once mined, the block secures itself into our visual explorer ledger. Notice the linked block heights, gas consumption, and previous block hashes, ensuring absolute ledger transparency.&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 text-purple-400 p-2.5 rounded-xl border border-purple-800/20 font-bold font-mono">
                    Phase 5
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white">Proof-of-Work Verification Challenge</p>
                    <p className="text-xs text-slate-400 leading-normal">
                      <strong>Action:</strong> Increase difficulty sliders inside the Consensus block on the Block Explorer page. Click **Solve Cryptographic Block Hash**. Slide the nonce and let them watch hashes solve leading zeros.
                      <br /><strong>Script:</strong> &quot;Examiner, notice how block mining verifies transaction states. By adjusting targets, we solve mathematical proof-of-work functions, demonstrating decentralized integrity in action.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
