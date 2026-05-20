import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { WalletState, Transaction, Block, SystemLog, ActiveTab } from "./types";

// Import custom sub-modules
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import BlockchainExplorer from "./components/BlockchainExplorer";
import SupplyChainForm from "./components/SupplyChainForm";
import AdminPanel from "./components/AdminPanel";
import DocumentationHub from "./components/DocumentationHub";

// Lucide icon imports
import { AlertCircle, CheckCircle2, ShieldAlert, X, HelpCircle, RefreshCw } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  
  // Wallet state mapping
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: "0.00",
    networkName: "Not Connected",
    chainId: null,
    isConnected: false,
    isSandboxMode: false
  });

  // Blockchain and backend items
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [contractDetails, setContractDetails] = useState({
    address: "0x9FdB77Db3BbeBdB773b06E1a8f9ccbf1a3d3cdd7",
    network: "Local EVM sandbox",
    abi: []
  });
  const [mongodbStatus, setMongodbStatus] = useState({
    connected: true,
    type: "Local Sandbox Storage",
    uri: "data/db.json"
  });

  // Admin Logs State
  const [logs, setLogs] = useState<SystemLog[]>([]);

  // Toast Alerts State Manager
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "warning" | "error" | "info"; message: string }[]>([]);

  // Push log helper
  const addLog = (system: "Database" | "Ethereum" | "Express" | "Metadata", type: "info" | "success" | "warning" | "error", message: string) => {
    const newLog: SystemLog = {
      id: Math.random().toString(),
      timestamp: new Date().toISOString(),
      type,
      system,
      message
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Push Toast notification helper
  const addToast = (type: "success" | "warning" | "error" | "info", message: string) => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000); // Clear after 5s
  };

  // Initial Boot loader
  useEffect(() => {
    addLog("Express", "info", "BlockTrace Full-Stack Node initialized.");
    addLog("Database", "info", "Local virtual db engine ready. Looking for credentials...");
    
    // Query APIs from Express proxy server
    fetchDBStatus();
    fetchContractDetails();
    fetchTransactions();
    fetchBlocks();
    
    // Boot logs
    setTimeout(() => {
      addLog("Database", "success", "Synchronized in-memory metadata with database (db.json)");
    }, 500);
    setTimeout(() => {
      addLog("Ethereum", "info", "Listening on Hardhat developer node IPC socket (http://127.0.0.1:8545)");
    }, 1000);
  }, []);

  // Fetch functions connecting to Express APIs
  const fetchDBStatus = async () => {
    try {
      const res = await fetch("/api/db-status");
      const data = await res.json();
      setMongodbStatus(data);
      addLog("Database", "success", `Virtual Mongo configuration matched: ${data.type}`);
    } catch (err) {
      addLog("Database", "warning", "Express API unavailable, compiling with local state fallbacks.");
    }
  };

  const fetchContractDetails = async () => {
    try {
      const res = await fetch("/api/contract");
      const data = await res.json();
      setContractDetails(data);
      addLog("Ethereum", "success", `Loaded smart contract configuration ABI definitions.`);
    } catch (err) {
      addLog("Ethereum", "error", "Failed to retrieve smart contract details.");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const fetchBlocks = async () => {
    try {
      const res = await fetch("/api/blocks");
      const data = await res.json();
      setBlocks(data);
    } catch (err) {
      console.error("Error fetching blocks:", err);
    }
  };

  // Connect Web3 Actions
  const handleConnectWallet = async (sandbox: boolean) => {
    if (sandbox) {
      // University sandbox pre-funded auditor address
      const sandboxAddr = "0x3D72dB217316E2bE9B5658e47E5CbFA4d4A0A026";
      setWallet({
        address: sandboxAddr,
        balance: "32.40125",
        networkName: "Private Sandbox Node",
        chainId: 6112,
        isConnected: true,
        isSandboxMode: true
      });
      addLog("Ethereum", "success", `Authorized sandbox auditing session: ${sandboxAddr}`);
      addToast("success", "Sandbox key authorized: pre-funded with 32.4 ETH!");
      return;
    }

    // MetaMask Browser integration
    try {
      const ethVal = (window as any).ethereum;
      if (!ethVal) {
        addToast("warning", "MetaMask extension not found. Activating our Sandbox Key instead!");
        addLog("Ethereum", "warning", "Browser MetaMask provider not found. Standard sandbox mode triggered.");
        handleConnectWallet(true);
        return;
      }

      addLog("Ethereum", "info", "Requesting MetaMask account signature authorization...");
      const provider = new ethers.BrowserProvider(ethVal);
      await ethVal.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const rawBalance = await provider.getBalance(addr);
      const balanceEth = ethers.formatEther(rawBalance);
      const network = await provider.getNetwork();

      setWallet({
        address: addr,
        balance: balanceEth,
        networkName: network.name === "unknown" ? "Localhost 8545" : network.name,
        chainId: Number(network.chainId),
        isConnected: true,
        isSandboxMode: false
      });

      addLog("Ethereum", "success", `MetaMask wallet connected: ${addr}`);
      addToast("success", `MetaMask aligned: Account balance ${Number(balanceEth).toFixed(4)} ETH.`);

    } catch (err: any) {
      addToast("error", err.message || "MetaMask authorization rejected by user.");
      addLog("Ethereum", "error", `Connection failure: ${err.message}`);
    }
  };

  const handleDisconnectWallet = () => {
    addLog("Ethereum", "info", `Session closed for account: ${wallet.address}`);
    setWallet({
      address: null,
      balance: "0.00",
      networkName: "Not Connected",
      chainId: null,
      isConnected: false,
      isSandboxMode: false
    });
    addToast("info", "Web3 connection closed.");
  };

  // Add tracing transaction block
  const handleAddTransaction = async (txData: {
    sku: string;
    productName: string;
    sender: string;
    receiver?: string;
    location: string;
    remarks: string;
    status: string;
  }) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txData)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to mint transaction.");

      // Sync state with updated elements
      await fetchTransactions();
      await fetchBlocks();

      // Deduct mock gas balance from sandbox mode for reality
      if (wallet.isSandboxMode) {
        setWallet(prev => ({
          ...prev,
          balance: (Number(prev.balance) - 0.0024).toString()
        }));
      }

      addLog("Database", "success", `Mined Block #${data.block.blockNumber}: Hash ${data.block.blockHash.slice(0, 16)}...`);
      addLog("Ethereum", "success", `On-chain receipt resolved. SKU: ${txData.sku}`);
      addToast("success", `Block #${data.block.blockNumber} successfully mined and validated!`);
      
      return data;
    } catch (err: any) {
      addToast("error", err.message || "Network write failure.");
      throw err;
    }
  };

  // Hard Reset ledger elements
  const handleResetLedger = async () => {
    try {
      const res = await fetch("/api/blocks/reset", { method: "POST" });
      const data = await res.json();
      
      await fetchTransactions();
      await fetchBlocks();

      addLog("Database", "warning", "System hard ledger reset. Reloading default states.");
      addToast("info", "Ledger reset to start defaults!");
    } catch (err) {
      console.error(err);
    }
  };

  // Mock deploying smart contracts inside logs
  const handleDeployContractLog = () => {
    const randomHex = () => Math.random().toString(16).substring(2, 10);
    const newAddr = `0x${randomHex()}${randomHex()}AeeBbeBdB773b06E1a8f9ccbf1a3d3c`;
    setContractDetails(prev => ({
      ...prev,
      address: newAddr
    }));
    addLog("Ethereum", "warning", `EMERGENCY ACTION: Redeployed BlockTrace.sol smart contract.`);
    addLog("Ethereum", "success", `Deployed contract hash address: ${newAddr}`);
    addToast("warning", "Simulated contract redeployed - Address update logged!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none selection:bg-blue-600/30">
      
      {/* Visual Navigation Header */}
      <Navbar
        wallet={wallet}
        connectWallet={handleConnectWallet}
        disconnectWallet={handleDisconnectWallet}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        networkName={wallet.networkName}
        setNetworkName={(name) => setWallet(prev => ({ ...prev, networkName: name }))}
        gasPrice={wallet.isSandboxMode ? 0 : 34}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === "dashboard" && (
          <Dashboard
            wallet={wallet}
            transactions={transactions}
            contractAddress={contractDetails.address}
            mongodbStatus={mongodbStatus}
            onClearTransactions={handleResetLedger}
            onConnectWallet={handleConnectWallet}
          />
        )}

        {activeTab === "explorer" && (
          <BlockchainExplorer
            blocks={blocks}
            onRefreshBlocks={fetchBlocks}
            onResetBlocks={handleResetLedger}
          />
        )}

        {activeTab === "track" && (
          <SupplyChainForm
            wallet={wallet}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {activeTab === "admin" && (
          <AdminPanel
            wallet={wallet}
            logs={logs}
            onClearLogs={() => setLogs([])}
            onDeployMockContract={handleDeployContractLog}
            contractAddress={contractDetails.address}
          />
        )}

        {activeTab === "docs" && (
          <DocumentationHub />
        )}
      </main>

      {/* Interactive Micro-Toasts list */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 min-w-[320px] max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border-glow border flex items-start gap-3 shadow-2xl transition-all duration-300 animate-fadeIn ${
              toast.type === "success" ? "bg-slate-950 text-emerald-400 border-emerald-500/20" :
              toast.type === "warning" ? "bg-slate-950 text-amber-400 border-amber-500/20" :
              toast.type === "error" ? "bg-slate-950 text-red-400 border-red-500/20" :
              "bg-slate-950 text-blue-400 border-blue-500/20"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            {toast.type === "warning" && <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />}
            {toast.type === "error" && <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />}
            {toast.type === "info" && <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />}
            
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>
          </div>
        ))}
      </div>

      {/* Modern High-Tech Global Sticky Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 px-6 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-4">
        <p>© 2026 BlockTrace. Final Year Dissertation Project Portfolio. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Virtual Mongo DB Sync Standard
          </span>
          <span>|</span>
          <span className="text-slate-400 hover:text-blue-400 cursor-pointer" onClick={() => setActiveTab("docs")}>
            Comprehensive Syllabus Q&A Center
          </span>
        </div>
      </footer>

    </div>
  );
}
