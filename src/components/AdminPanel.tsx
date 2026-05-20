import { useState } from "react";
import { Terminal, Shield, RefreshCw, Zap, Sliders, Database, Server, AlertTriangle } from "lucide-react";
import { SystemLog, WalletState } from "../types";
import { motion } from "motion/react";

interface AdminProps {
  wallet: WalletState;
  logs: SystemLog[];
  onClearLogs: () => void;
  onDeployMockContract: () => void;
  contractAddress: string;
}

export default function AdminPanel({
  wallet,
  logs,
  onClearLogs,
  onDeployMockContract,
  contractAddress
}: AdminProps) {
  const [activeNodes, setActiveNodes] = useState(4);
  const [networkSpeed, setNetworkSpeed] = useState(12); // Average block time
  const [gasPrice, setGasPrice] = useState(25); // Gwei
  const [consensusAlgo, setConsensusAlgo] = useState("ProofOfWork");
  const [isDeploying, setIsDeploying] = useState(false);

  const handleContractDeployment = () => {
    setIsDeploying(true);
    setTimeout(() => {
      onDeployMockContract();
      setIsDeploying(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Upper module panel */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            Consensus Node & Smart Admin Panel
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Reconfigure gas standards, trigger testing network hard-fork events, and monitor live cryptographic telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Admin Parameter Sliders */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-6">
          <h3 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold border-b border-slate-900 pb-2">
            Chain Parameters Matrix
          </h3>

          <div className="space-y-5 text-sm">
            {/* Number of Active Miner Nodes */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 font-semibold">Active Validating Nodes:</span>
                <span className="text-blue-400 font-bold">{activeNodes} RPC Nodes</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="12" 
                value={activeNodes} 
                onChange={(e) => setActiveNodes(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg accent-blue-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 font-mono">Simulates network Byzantine consensus integrity thresholds.</p>
            </div>

            {/* Block creation delay */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 font-semibold">Target Block Time:</span>
                <span className="text-amber-500 font-bold">{networkSpeed} Seconds</span>
              </div>
              <input 
                type="range" 
                min="3" 
                max="30" 
                value={networkSpeed} 
                onChange={(e) => setNetworkSpeed(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 font-mono">Calibrates mining difficulty algorithms in real-time.</p>
            </div>

            {/* GAS PRICE */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 font-semibold">Gas Floor Price:</span>
                <span className="text-teal-400 font-bold">{gasPrice} Gwei</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="150" 
                value={gasPrice} 
                onChange={(e) => setGasPrice(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg accent-teal-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 font-mono">Minimum gas prices for queuing pending audits.</p>
            </div>

            {/* CONSENSUS DROPDOWN */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 font-semibold block">Consensus Framework Protocol</label>
              <select 
                className="w-full bg-slate-900 border border-slate-800 text-xs py-2 px-3 rounded-lg font-mono text-slate-300 outline-none"
                value={consensusAlgo}
                onChange={(e) => setConsensusAlgo(e.target.value)}
              >
                <option value="ProofOfWork">PoW - Proof of Work (Eth Ethash Hybrid)</option>
                <option value="ProofOfAuthority">PoA - Proof of Authority (Consensus Seeds)</option>
                <option value="ProofOfStake">PoS - Proof of Stake (Beacon Slot validator)</option>
              </select>
            </div>

            {/* Contract redeployment actions */}
            <div className="border-t border-slate-900 pt-5 space-y-3">
              <span className="text-xs font-mono text-slate-400 block font-semibold">Emergency Safe Guards</span>
              <button
                type="button"
                onClick={handleContractDeployment}
                disabled={isDeploying}
                className={`w-full py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  isDeploying 
                    ? "bg-slate-900 text-slate-500 border border-slate-850 cursor-wait" 
                    : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                }`}
              >
                {isDeploying ? "Deploying Solidity..." : "Simulate New Solidity Deploy"}
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Terminal and system telemetry */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          
          {/* Node telemetry stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/50">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-850">
              <p className="text-[9px] font-mono text-slate-500 uppercase">Block Hash Rate</p>
              <strong className="text-xs font-mono text-emerald-400">92.4 MH/s</strong>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-850">
              <p className="text-[9px] font-mono text-slate-500 uppercase">Database Status</p>
              <strong className="text-xs font-mono text-blue-400">Sync Correct</strong>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-850">
              <p className="text-[9px] font-mono text-slate-500 uppercase">Consensus Power</p>
              <strong className="text-xs font-mono text-amber-500">99.8% Perfect</strong>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-850">
              <p className="text-[9px] font-mono text-slate-500 uppercase">Total Peers</p>
              <strong className="text-xs font-mono text-purple-400">{activeNodes} Connected</strong>
            </div>
          </div>

          {/* Interactive terminal mockup */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 flex-1 flex flex-col overflow-hidden min-h-[360px]">
            {/* Terminal Tab Header bar */}
            <div className="bg-slate-900/70 border-b border-slate-850 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">BlockTrace Kernel Logs</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClearLogs}
                  className="bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-400 border border-slate-800 px-2 py-1 rounded font-mono cursor-pointer"
                >
                  Clear Terminal
                </button>
              </div>
            </div>

            {/* Logs lines body */}
            <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 bg-slate-950 min-h-[300px]">
              {logs.length === 0 ? (
                <p className="text-slate-500 italic">Terminal records cleared. Fire actions or register blocks to view dynamic outputs.</p>
              ) : (
                logs.map((log) => {
                  const stamp = log.timestamp.split("T")[1].slice(0, 8);
                  return (
                    <div key={log.id} className="flex gap-2">
                      <span className="text-slate-600 font-bold select-none">[{stamp}]</span>
                      <span className={`font-bold select-none ${
                        log.system === "Database" ? "text-blue-400" :
                        log.system === "Ethereum" ? "text-amber-500" : "text-purple-400"
                      }`}>
                        [{log.system}]
                      </span>
                      <span className={
                        log.type === "success" ? "text-emerald-400" :
                        log.type === "warning" ? "text-amber-400" :
                        log.type === "error" ? "text-red-400" : "text-slate-300"
                      }>
                        {log.message}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
