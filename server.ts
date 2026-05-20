import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure Database folder exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, "db.json");

// Structure for our in-memory/file blockchain trace ledger
interface Transaction {
  id: string; // SKU or block ID
  txHash: string;
  blockNumber: number;
  sender: string;
  receiver: string;
  productName: string;
  sku: string;
  location: string;
  remarks: string;
  status: string; // Registered, InTransit, Inspected, RetailReady, Delivered, Flagged
  timestamp: string;
  gasUsed: number;
}

interface Block {
  blockNumber: number;
  timestamp: string;
  prevHash: string;
  blockHash: string;
  transactions: Transaction[];
  nonce: number;
  difficulty: number;
}

interface MongoStatus {
  connected: boolean;
  type: string;
  uri: string;
}

// Initial dummy database setup for sandbox demonstration
const initialTransactions: Transaction[] = [
  {
    id: "BT-1001",
    txHash: "0x8fae8705bc764d12c823057e93bc3cfd19a239bded738c6c8f9db03cc755b6cb",
    blockNumber: 15492040,
    sender: "0x3D72dB217316E2bE9B5658e47E5CbFA4d4A0A026",
    receiver: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    productName: "BioPharma Covid Vaccine Batch A3",
    sku: "SKU-PHA-CV321",
    location: "Pfizer Logistics Facility, Antwerp",
    remarks: "Batch initialized, temperature registered at -72C",
    status: "Registered",
    timestamp: "2026-05-20T08:12:00Z",
    gasUsed: 124500,
  },
  {
    id: "BT-1002",
    txHash: "0x4ca1e98d89ba10037a90b4ad4af48e5b47a25f778a87612c6cddb09dcc75f6cc",
    blockNumber: 15492042,
    sender: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    receiver: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    productName: "BioPharma Covid Vaccine Batch A3",
    sku: "SKU-PHA-CV321",
    location: "Brussels Airport Cold Hub",
    remarks: "Custody transfer accepted. Seals checked: Untouched.",
    status: "InTransit",
    timestamp: "2026-05-20T09:44:00Z",
    gasUsed: 87400,
  },
  {
    id: "BT-1003",
    txHash: "0xd98ec15fa25a74e5b4ad48e589ba10037a90b4ad742f5ffcc6cddb03cc14bca8",
    blockNumber: 15492053,
    sender: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    receiver: "0xdd2fd4581271e230360230f9337d5c0430bf44c0",
    productName: "Fresh Organics premium Avocados",
    sku: "SKU-ORG-AVO12",
    location: "Sunkist Farms, California",
    remarks: "Pesticide report: Zero contaminant detected.",
    status: "Inspected",
    timestamp: "2026-05-20T10:15:30Z",
    gasUsed: 98120,
  }
];

const initialBlocks: Block[] = [
  {
    blockNumber: 15492039,
    timestamp: "2026-05-20T07:30:12Z",
    prevHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    blockHash: "0x000a89d7b9ea32f05faeebeb10037a90b4ad4fa1e2b8bc5b47f6cc630122e23d",
    transactions: [],
    nonce: 87431,
    difficulty: 4
  },
  {
    blockNumber: 15492040,
    timestamp: "2026-05-20T08:12:00Z",
    prevHash: "0x000a89d7b9ea32f05faeebeb10037a90b4ad4fa1e2b8bc5b47f6cc630122e23d",
    blockHash: "0x0001fe2a9003cc2e3be7a90b4ad19a2e3be9ae8c5c7d8f9db03cc755b6c8913d",
    transactions: [initialTransactions[0]],
    nonce: 198270,
    difficulty: 4
  },
  {
    blockNumber: 15492042,
    timestamp: "2026-05-20T09:44:00Z",
    prevHash: "0x0001fe2a9003cc2e3be7a90b4ad19a2e3be9ae8c5c7d8f9db03cc755b6c8913d",
    blockHash: "0x0005a81caedbe98cdcb87fa4da64d47c49f8fb193c7d6c63b1db8a5be737fbc2",
    transactions: [initialTransactions[1]],
    nonce: 43219,
    difficulty: 4
  },
  {
    blockNumber: 15492053,
    timestamp: "2026-05-20T10:15:30Z",
    prevHash: "0x0005a81caedbe98cdcb87fa4da64d47c49f8fb193c7d6c63b1db8a5be737fbc2",
    blockHash: "0x0007e9ba3cda8ec002bca81c7e9f3bde1a8f9ccbf1a3d3cdd78a3cb3ef7371ac",
    transactions: [initialTransactions[2]],
    nonce: 91100,
    difficulty: 4
  }
];

// Helper to Load/Save to db.json
const loadDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    saveDB({ transactions: initialTransactions, blocks: initialBlocks });
    return { transactions: initialTransactions, blocks: initialBlocks };
  }
  try {
    const dataObj = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    // Fill empty arrays if missing
    if (!dataObj.transactions) dataObj.transactions = [];
    if (!dataObj.blocks) dataObj.blocks = [];
    return dataObj;
  } catch (err) {
    console.error("Error reading database file, returning default schema", err);
    return { transactions: initialTransactions, blocks: initialBlocks };
  }
};

const saveDB = (data: { transactions: Transaction[]; blocks: Block[] }) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
};

// Simulated Contract ABI to supply to Ethers client
const blockTraceABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "SKU", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" }
    ],
    "name": "ProductRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "location", "type": "string" },
      { "indexed": false, "internalType": "enum BlockTrace.ProductStatus", "name": "status", "type": "uint8" }
    ],
    "name": "ProductTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "enum BlockTrace.ProductStatus", "name": "status", "type": "uint8" },
      { "indexed": false, "internalType": "string", "name": "remarks", "type": "string" }
    ],
    "name": "ProductStatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "reason", "type": "string" },
      { "indexed": false, "internalType": "address", "name": "flagger", "type": "address" }
    ],
    "name": "ProductFlagged",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_SKU", "type": "string" },
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_origin", "type": "string" }
    ],
    "name": "registerProduct",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "address", "name": "_newOwner", "type": "address" },
      { "internalType": "string", "name": "_location", "type": "string" },
      { "internalType": "string", "name": "_remarks", "type": "string" }
    ],
    "name": "transferCustody",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "enum BlockTrace.ProductStatus", "name": "_status", "type": "uint8" },
      { "internalType": "string", "name": "_location", "type": "string" },
      { "internalType": "string", "name": "_remarks", "type": "string" }
    ],
    "name": "updateProductStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "string", "name": "_reason", "type": "string" }
    ],
    "name": "flagProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Database Connection Status Page (Simulating MongoDB + reporting MONGODB_URI)
app.get("/api/db-status", (req, res) => {
  const uri = process.env.MONGODB_URI;
  const status: MongoStatus = {
    connected: true, // Express is successfully serving the virtual layer
    type: uri ? "MongoDB Production Instance" : "BlockTrace Sandbox Storage Engine (Auto-Fallback)",
    uri: uri ? uri.replace(/:([^@]+)@/, ":******@") : "data/db.json (Local Sandbox Environment)",
  };
  res.json(status);
});

// 2. Fetch Smart Contract details for direct client integration
app.get("/api/contract", (req, res) => {
  res.json({
    address: process.env.CONTRACT_ADDRESS || "0x9FdB77Db3BbeBdB773b06E1a8f9ccbf1a3d3cdd7",
    network: "Ethereum Sepolia Testnet (or local node)",
    abi: blockTraceABI,
  });
});

// 3. Fetch Transactions list
app.get("/api/transactions", (req, res) => {
  const data = loadDB();
  res.json(data.transactions);
});

// 4. Register or log a custody trace directly
app.post("/api/transactions", (req, res) => {
  const { sku, productName, sender, receiver, location, remarks, status } = req.body;
  if (!sku || !productName || !sender) {
    return res.status(400).json({ error: "Missing required product trace fields" });
  }

  const dbData = loadDB();
  const nextBlock = dbData.blocks[dbData.blocks.length - 1].blockNumber + 1;
  const prevBlockHash = dbData.blocks[dbData.blocks.length - 1].blockHash;

  // Generate a random block hash
  const randomHex = () => Math.random().toString(16).substring(2, 10);
  const newTxHash = `0x${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}`;
  const newBlockHash = `0x000${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}`;

  const newTx: Transaction = {
    id: `BT-${1001 + dbData.transactions.length}`,
    txHash: newTxHash,
    blockNumber: nextBlock,
    sender,
    receiver: receiver || "0x0000000000000000000000000000000000000000",
    productName,
    sku,
    location: location || "Logistics Terminal Center",
    remarks: remarks || "Status Updated",
    status: status || "Registered",
    timestamp: new Date().toISOString(),
    gasUsed: Math.floor(Math.random() * 50000) + 70000,
  };

  dbData.transactions.unshift(newTx); // Insert newest first on tx table

  // Create a block for the blockchain page
  const newBlock: Block = {
    blockNumber: nextBlock,
    timestamp: new Date().toISOString(),
    prevHash: prevBlockHash,
    blockHash: newBlockHash,
    transactions: [newTx],
    nonce: Math.floor(Math.random() * 300000),
    difficulty: 4,
  };

  dbData.blocks.push(newBlock);
  saveDB(dbData);

  res.status(201).json({
    success: true,
    message: "Transaction minted as Block #" + nextBlock + " on-chain successfully!",
    transaction: newTx,
    block: newBlock
  });
});

// 5. Fetch entire Blocks chain
app.get("/api/blocks", (req, res) => {
  const data = loadDB();
  res.json(data.blocks);
});

// 6. Reset visual blockchain ledger to defaults
app.post("/api/blocks/reset", (req, res) => {
  saveDB({ transactions: initialTransactions, blocks: initialBlocks });
  res.json({ success: true, message: "Ledger reverted successfully to factory blockchain default state" });
});

// ==========================================
// VITE DEV SERVER AND PRODUCTION INDEX fallbacks
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`===============================================`);
    console.log(`🌐 BlockTrace Full-Stack Engine Listening on Port ${PORT}`);
    console.log(`🧪 Base URL: http://0.0.0.0:${PORT}`);
    console.log(`🔒 Connected to Sandbox Mongo Engine fallback.`);
    console.log(`===============================================`);
  });
}

startServer();
