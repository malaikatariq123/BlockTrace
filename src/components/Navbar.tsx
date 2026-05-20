import { Activity, Cpu, Layers, ShieldCheck, Wallet, LogOut, Code, BookOpen, Terminal, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { WalletState, ActiveTab } from "../types";
import { motion } from "motion/react";

interface NavbarProps {
  wallet: WalletState;
  connectWallet: (sandbox: boolean) => void;
  disconnectWallet: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  networkName: string;
  setNetworkName: (name: string) => void;
  gasPrice: number;
}

export default function Navbar({
  wallet,
  connectWallet,
  disconnectWallet,
  activeTab,
  setActiveTab,
  networkName,
  setNetworkName,
  gasPrice
}: NavbarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "explorer", label: "Block Explorer", icon: Layers },
    { id: "track", label: "Trace ledger", icon: Cpu },
    { id: "admin", label: "Admin Panel", icon: Terminal },
    { id: "docs", label: "Academic Hub", icon: BookOpen },
  ] as const;

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 opacity-75 blur-md animate-pulse"></div>
            <div className="relative bg-slate-900 text-blue-400 p-2 rounded-lg border border-slate-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-white">BlockTrace</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">
                v1.0-Release
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Decentralised Audit Ledger</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? "text-blue-400 shadow-lg bg-slate-950/50 border border-slate-800"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-blue-500/5 rounded-lg border border-blue-500/10 pointer-events-none"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Web3 Details & Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Simulated Node Settings */}
          <div className="hidden lg:flex flex-col items-end pr-3 border-r border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Gas Limit: <strong className="font-mono text-slate-200">22,000 Gwei</strong></span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono italic">Block Time: ~12s (Ethereum)</p>
          </div>

          {/* Wallet Trigger */}
          {wallet.isConnected ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 pr-3 rounded-xl">
              <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <p className="text-[10px] text-slate-500 font-mono leading-none">ACTIVE ACCOUNT</p>
                <p className="font-mono text-xs text-blue-400 font-bold mt-0.5">
                  {wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : "No Address"}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${wallet.isSandboxMode ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`}></span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">
                    {wallet.isSandboxMode ? "Sandbox Key" : "MetaMask Auth"}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-emerald-400 font-bold leading-none mt-1">
                  {Number(wallet.balance).toFixed(4)} ETH
                </p>
              </div>
              <button 
                onClick={disconnectWallet}
                title="Disconnect Wallet Chain"
                className="bg-red-500/10 text-red-400 p-2 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => connectWallet(true)}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs px-3 py-2 rounded-lg font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                Connect Sandbox Key
              </button>
              <button
                onClick={() => connectWallet(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5" />
                Connect MetaMask
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
