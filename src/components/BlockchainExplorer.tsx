import { useState, useEffect } from "react";
import { Layers, Search, Code, CheckCircle, Database, HelpCircle, Flame, Server, ArrowRight, RefreshCw, ChevronRight } from "lucide-react";
import { Block, Transaction } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface BlockchainExplorerProps {
  blocks: Block[];
  onRefreshBlocks: () => void;
  onResetBlocks: () => void;
}

export default function BlockchainExplorer({
  blocks,
  onRefreshBlocks,
  onResetBlocks
}: BlockchainExplorerProps) {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Consensus simulator stats
  const [difficulty, setDifficulty] = useState(4);
  const [miningSpeed, setMiningSpeed] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [currentNonce, setCurrentNonce] = useState(0);
  const [simulatedHash, setSimulatedHash] = useState("");

  // Auto select first block on loads
  useEffect(() => {
    if (blocks.length > 0 && !selectedBlock) {
      setSelectedBlock(blocks[blocks.length - 1]);
    }
  }, [blocks]);

  // Handle a mock mining PoW demonstration inside the React client
  const runPoW_Simulation = () => {
    setIsMining(true);
    let nonce = 0;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      nonce += Math.floor(Math.random() * 250) + 10;
      setCurrentNonce(nonce);
      
      // Calculate a pseudo hash that satisfies the difficulty
      const prefix = "0".repeat(difficulty);
      const tempHash = "0x" + "0".repeat(difficulty) + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      setSimulatedHash(tempHash);

      const elapsed = (Date.now() - startTime) / 1000;
      setMiningSpeed(Math.floor(nonce / elapsed));

      if (nonce > 4500 || Math.random() < 0.08) {
        clearInterval(interval);
        setIsMining(false);
        onRefreshBlocks(); // Try fetching new items if there's any background update
      }
    }, 40);
  };

  // Filter blocks based on search SKU or Hash
  const filteredBlocks = blocks.filter(block => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    const matchesNumber = block.blockNumber.toString().includes(term);
    const matchesHash = block.blockHash.toLowerCase().includes(term);
    const matchesTx = block.transactions.some(tx => 
      tx.sku.toLowerCase().includes(term) || 
      tx.productName.toLowerCase().includes(term) ||
      tx.id.toLowerCase().includes(term)
    );
    
    return matchesNumber || matchesHash || matchesTx;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Upper Module Brief */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-400" />
              Cryptographic Block Explorer
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Verify historical transaction logs, parent block hashes, proof-of-work parameters, and decentralized Merkle root paths.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onRefreshBlocks}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              Re-scan Ledger
            </button>
            <button
              onClick={onResetBlocks}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Reset Chains
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Flow of Blocks */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search chain by block height, hash, SKU, or batch product..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Connected Block nodes track */}
          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2">
            {filteredBlocks.length === 0 ? (
              <div className="bg-slate-950 border border-slate-900 p-12 text-center rounded-2xl text-slate-500 font-mono text-sm">
                No blocks match the specific filters. Try entering another block height or SKU code.
              </div>
            ) : (
              // Display from newest to oldest for easy debugging
              [...filteredBlocks].reverse().map((block, idx, arr) => {
                const isSelected = selectedBlock?.blockNumber === block.blockNumber;
                return (
                  <div key={block.blockNumber} className="flex flex-col">
                    
                    {/* Visual Card */}
                    <motion.div
                      whileHover={{ scale: 1.006 }}
                      onClick={() => setSelectedBlock(block)}
                      className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        isSelected 
                          ? "bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/5" 
                          : "bg-slate-950 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/10"
                      }`}
                    >
                      <div className="flex gap-4 items-start">
                        {/* Block icon container */}
                        <div className={`p-3 rounded-xl border font-mono font-bold text-center w-16 h-16 flex-shrink-0 flex flex-col justify-center items-center ${
                          isSelected ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-slate-900 border-slate-850 text-slate-400"
                        }`}>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-normal leading-none mb-1">Block</span>
                          <span className="text-lg leading-none">#{block.blockNumber}</span>
                        </div>

                        <div className="space-y-1 overflow-hidden">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500 leading-none">BLOCK HASH:</span>
                            <span className="text-xs font-mono font-bold text-slate-300 truncate max-w-xs block select-all">
                              {block.blockHash}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-400">
                            Mined on: <span className="font-mono text-slate-300">{new Date(block.timestamp).toLocaleString()}</span>
                          </p>
                          <div className="flex gap-3 text-[11px] font-mono mt-2">
                            <span className="text-slate-500">
                              TXs count: <strong className="text-blue-400">{block.transactions.length}</strong>
                            </span>
                            <span className="text-slate-600">|</span>
                            <span className="text-slate-500">
                              Difficulty: <strong className="text-amber-500">{block.difficulty}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-mono text-slate-500">PARENT BLOCK</p>
                          <p className="text-xs font-mono text-slate-400 truncate w-32">
                            {block.prevHash ? `${block.prevHash.slice(0, 10)}...` : "GENESIS_NODE"}
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? "text-blue-400 translate-x-1" : "text-slate-600"}`} />
                      </div>
                    </motion.div>

                    {/* Visual Chronological Chain Arrow */}
                    {idx < arr.length - 1 && (
                      <div className="flex justify-center my-2 select-none">
                        <div className="h-6 w-0.5 bg-gradient-to-b from-blue-500/20 to-slate-950/10 relative">
                          <ArrowRight className="w-3.5 h-3.5 absolute -left-1.5 -bottom-2 text-slate-700 rotate-90 transform" />
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Block Details Header Panel & Consensus Simulator */}
        <div className="space-y-6">
          
          {/* PoW Consensus Simulator Panel */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2 border-b border-slate-900 pb-2">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              Consensus Laboratory (PoW Simulator)
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Demonstrate the cryptographic validation of blockchain block generation. Adjust the Proof of Work target difficulty below:
            </p>

            {/* Difficulty Bar Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Target Difficulty:</span>
                <span className="text-amber-400 font-bold">{difficulty} Leading Zeros</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="6" 
                value={difficulty} 
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                disabled={isMining}
                className="w-full accent-amber-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Simulated Miner Card */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Current Nonce:</span>
                <span className="text-slate-300 font-bold">{currentNonce.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Hashing Power:</span>
                <span className="text-blue-400 font-bold">{isMining ? `${miningSpeed} hashes/sec` : "Standby"}</span>
              </div>
              <div className="border-t border-slate-950 mt-2 pt-2">
                <span className="text-slate-500 block text-[10px] uppercase">Cryptographic Output Hash:</span>
                <span className="text-[11px] font-bold text-slate-300 block truncate font-mono mt-1">
                  {isMining ? simulatedHash : "0x0000abcde... (Mined Output)"}
                </span>
              </div>
            </div>

            <button
              onClick={runPoW_Simulation}
              disabled={isMining}
              className={`w-full py-2.5 rounded-xl font-semibold transform transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer ${
                isMining 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 cursor-wait" 
                  : "bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/15"
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              {isMining ? "Hashing Block Nonces..." : "Solve Cryptographic Block Hash"}
            </button>
          </div>

          {/* Block Details Display Card */}
          <AnimatePresence mode="wait">
            {selectedBlock && (
              <motion.div
                key={selectedBlock.blockNumber}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-5"
              >
                <div className="border-b border-slate-900 pb-3">
                  <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                    Active block Inspection
                  </span>
                  <h3 className="text-xl font-display font-bold text-white mt-1.5">
                    Metadata for Block #{selectedBlock.blockNumber}
                  </h3>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  {/* Row hashes */}
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block">Block Hash</span>
                    <span className="text-slate-300 block font-bold break-all select-all leading-snug">
                      {selectedBlock.blockHash}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block">Parent Block Hash</span>
                    <span className="text-slate-400 block break-all select-all leading-snug">
                      {selectedBlock.prevHash || "GENESIS_NODE_ROOT00000000000"}
                    </span>
                  </div>

                  {/* Nonce and difficulty */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-900 p-3.5 rounded-xl border border-slate-850">
                    <div>
                      <span className="text-slate-500 text-[10px] block leading-none">Nonce Val</span>
                      <strong className="text-white text-sm font-bold block mt-1">{selectedBlock.nonce}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block leading-none">Merkle Root Status</span>
                      <strong className="text-emerald-400 text-xs font-bold block mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Matches
                      </strong>
                    </div>
                  </div>

                  {/* Transactions list inner card */}
                  <div className="space-y-2">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block">
                      Inside Transactions ({selectedBlock.transactions.length})
                    </span>
                    
                    {selectedBlock.transactions.length === 0 ? (
                      <p className="text-slate-500 italic text-xs bg-slate-900 p-3 rounded-lg border border-slate-850">
                        Zero user records contained (Coinbase mined only).
                      </p>
                    ) : (
                      selectedBlock.transactions.map((tx) => (
                        <div key={tx.txHash} className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 space-y-2">
                          <div className="flex justify-between items-start">
                            <strong className="text-blue-400 text-xs font-bold">{tx.id}</strong>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                              tx.status === "Registered" ? "bg-blue-500/10 text-blue-300" :
                              tx.status === "Flagged" ? "bg-red-500/10 text-red-300" : "bg-emerald-500/10 text-emerald-300"
                            }`}>
                              {tx.status}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-400">
                            <p>
                              Product SKU: <strong className="text-slate-300">{tx.sku}</strong>
                            </p>
                            <p>
                              Batch Name: <strong className="text-slate-300">{tx.productName}</strong>
                            </p>
                            <p className="truncate">
                              Custody Location: <span className="text-slate-400">{tx.location}</span>
                            </p>
                            <p className="italic text-slate-500 truncate">
                              Remarks: "{tx.remarks}"
                            </p>
                            <p className="text-slate-500 truncate">
                              From: {tx.sender}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
