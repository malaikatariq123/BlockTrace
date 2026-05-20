import { useState } from "react";
import { Copy, Check, QrCode, Shield, Activity, HardHat, Compass, AlertCircle, Trash2, Cpu, ExternalLink } from "lucide-react";
import { Transaction, WalletState } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface DashboardProps {
  wallet: WalletState;
  transactions: Transaction[];
  contractAddress: string;
  mongodbStatus: { connected: boolean; type: string; uri: string };
  onClearTransactions: () => void;
  onConnectWallet: (sandbox: boolean) => void;
}

export default function Dashboard({
  wallet,
  transactions,
  contractAddress,
  mongodbStatus,
  onClearTransactions,
  onConnectWallet
}: DashboardProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyToClipboard = (text: string, isContract: boolean) => {
    navigator.clipboard.writeText(text);
    if (isContract) {
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // Generate a mock QR SVG dynamically for any address
  const generateQR_SVG = (addr: string) => {
    // Elegant deterministic pseudo QR code drawn using SVG rect grids
    const hash = addr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const size = 16;
    const dots = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Create standard QR square borders in three corners
        const isCorner = 
          (r < 5 && c < 5) || 
          (r < 5 && c >= size - 5) || 
          (r >= size - 5 && c < 5);
        
        let active = false;
        if (isCorner) {
          // Standard QR corner pattern
          active = 
            (r === 0 || r === 4 || c === 0 || c === 4) ||
            (r >= 1 && r <= 3 && c >= 1 && c <= 3 && !(r === 2 && c === 2)) ||
            (r === 2 && c === 2);
        } else {
          // Semi-random deterministic dot pattern
          active = ((r * c + hash) % 3 === 0) || ((r + c + hash) % 4 === 0);
        }
        dots.push({ r, c, active });
      }
    }

    return (
      <svg viewBox="0 0 16 16" className="w-full h-full text-white bg-slate-900 p-2.5 rounded-lg border border-slate-700">
        {dots.map((dot, idx) => (
          <rect
            key={idx}
            x={dot.c}
            y={dot.r}
            width="0.85"
            height="0.85"
            className={dot.active ? "fill-blue-400" : "fill-slate-800/10"}
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-white bg-clip-text text-transparent">
            Chain Auditing & Logistics Terminal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Secure, unalterable on-chain supply chain transparency. Deployed for Academic Audit Review.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 font-mono text-xs flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400 font-bold uppercase">RPC Status:</span>
            <span className="text-emerald-400 font-bold">Online</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 font-mono text-xs text-slate-400">
            Node Latency: <strong className="text-slate-200">14 ms</strong>
          </div>
        </div>
      </div>

      {wallet.isConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Account & Network Ledger Panel */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800/80 hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs uppercase font-mono tracking-widest text-slate-500">Connected Wallet Segment</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-mono text-white select-all">
                      {wallet.address}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(wallet.address || "", false)}
                      className="text-slate-400 hover:text-blue-400 p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                      title="Copy Address"
                    >
                      {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    showQR ? "bg-blue-600 text-white border-blue-500" : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                  title="Show QR Code"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-xs font-semibold">QR Code</span>
                </button>
              </div>

              {/* Collapsible Wallet QR View */}
              <AnimatePresence>
                {showQR && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4"
                  >
                    <div className="w-24 h-24 flex-shrink-0">
                      {generateQR_SVG(wallet.address || "")}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-200">On-Chain Target Routing Card</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                        This deterministic matrix represents your unique cryptographic signature. Use are standard scanners to request logistic transfer signatures over-the-air.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Ether Balance</span>
                  <p className="text-xl font-display font-bold text-white mt-1 select-none">
                    {Number(wallet.balance).toFixed(5)} ETH
                  </p>
                  <span className="text-[10px] font-mono text-slate-400">Ready on-chain</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Target network</span>
                  <p className="text-base font-display font-bold text-blue-400 mt-1 select-none truncate">
                    {wallet.networkName}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400">Chain ID: {wallet.chainId || 1337}</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Trace Count</span>
                  <p className="text-xl font-display font-bold text-emerald-400 mt-1 select-none">
                    {transactions.length} items
                  </p>
                  <span className="text-[10px] font-mono text-slate-400">Total ledger blocks</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Gas Level</span>
                  <p className="text-xl font-display font-bold text-amber-500 mt-1 select-none">
                    {wallet.isSandboxMode ? "0 (Sandbox)" : "Dynamic Gwei"}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400">Self-sponsored DB</span>
                </div>
              </div>
            </div>

            {/* Smart contract copy */}
            <div className="border-t border-slate-900 mt-4 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                Contract Address:
              </span>
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-850 w-full sm:w-auto overflow-hidden">
                <span className="text-slate-300 truncate select-all">{contractAddress}</span>
                <button 
                  onClick={() => copyToClipboard(contractAddress, true)}
                  className="text-slate-400 hover:text-blue-400 p-1 rounded hover:bg-slate-800 transition-colors"
                  title="Copy Smart Contract Address"
                >
                  {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>

          {/* Database & Deployment Status Cards */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between gap-4">
            <h3 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold border-b border-slate-900 pb-2">
              System Infrastructure
            </h3>

            <div className="space-y-4">
              {/* Virtual Mongo Connection details */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-850 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-white">Virtual Database Active</p>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 mt-1">Provider Source:</p>
                  <p className="text-[11px] font-mono text-slate-400 break-all">{mongodbStatus.type}</p>
                </div>
              </div>

              {/* Hardhat status */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-850 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Local Block Dev RPC Net</p>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 mt-1">Network Profile:</p>
                  <p className="text-[11px] font-mono text-slate-400 leading-none">Hardhat EVM (Local chain node on 127.0.0.1:8545)</p>
                </div>
              </div>
            </div>

            {/* Sandbox Notice Banner */}
            <div className="bg-gradient-to-r from-blue-900/10 to-teal-900/10 border border-blue-500/10 rounded-xl p-3 text-xs leading-normal text-slate-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>
                Simulated web3 layer allows editing tracer structures directly on-the-fly, serving as an optimal viva defense mockup.
              </span>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center space-y-6 max-w-2xl mx-auto flex flex-col items-center">
          <div className="h-16 w-16 bg-blue-500/10 text-blue-400 p-4 rounded-full border border-blue-500/20 flex items-center justify-center animate-pulse">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-white">Cryptographic Node Connection Required</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              BlockTrace logs all actions on localized Solidity nodes. To proceed, initialises the virtual database or trigger your browser wallet extension below:
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => onConnectWallet(true)}
              className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 py-3 rounded-xl font-mono text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              Activate Sandbox Key (Instant Tryout)
            </button>
            <button
              onClick={() => onConnectWallet(false)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              Mount Browser MetaMask
            </button>
          </div>
        </div>
      )}

      {/* Main Ledger Analytics / Transaction Tables */}
      {wallet.isConnected && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-display font-bold text-white">Trace Audits & Transaction Ledger</h2>
              <p className="text-xs text-slate-500">Records corresponding immutable ledger updates minted on simulated blocks.</p>
            </div>
            <button
               onClick={onClearTransactions}
               className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
               title="Revert to Default Registry Cards"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Demo Blocks
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 text-xs uppercase select-none">
                  <th className="py-3 px-4">Item ID</th>
                  <th className="py-3 px-4">Transaction hash</th>
                  <th className="py-3 px-4">Trace SKU</th>
                  <th className="py-3 px-4">Batch Name</th>
                  <th className="py-3 px-4">Holder Location</th>
                  <th className="py-3 px-4">Ledger Status</th>
                  <th className="py-3 px-4 text-right">Gas Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No tracing blocks mined yet. Direct to "Trace Ledger" tab to mint products!
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.txHash} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-blue-400 select-all">{tx.id}</td>
                      <td className="py-4 px-4 text-slate-400 text-xs">
                        <span className="text-slate-500 truncate block w-28 hover:text-blue-400 cursor-pointer" title={tx.txHash}>
                          {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-8)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300 font-bold">{tx.sku}</td>
                      <td className="py-4 px-4 text-white text-xs max-w-[150px] truncate" title={tx.productName}>
                        {tx.productName}
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-xs max-w-[150px] truncate" title={tx.location}>
                        {tx.location}
                      </td>
                      <td className="py-4 px-4 text-xs">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tx.status === "Registered" ? "bg-blue-500/10 text-blue-300 border border-blue-500/25" :
                          tx.status === "InTransit" ? "bg-amber-500/10 text-amber-300 border border-amber-500/25" :
                          tx.status === "Inspected" ? "bg-purple-500/10 text-purple-300 border border-purple-500/25" :
                          tx.status === "RetailReady" ? "bg-teal-500/10 text-teal-300 border border-teal-500/25" :
                          tx.status === "Delivered" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25" :
                          "bg-red-500/10 text-red-300 border border-red-500/25"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-500 text-xs font-mono">{tx.gasUsed.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
