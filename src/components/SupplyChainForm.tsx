import { useState, FormEvent } from "react";
import { Cpu, ShieldAlert, Award, Plane, ClipboardList, CheckCircle2, UserCheck, AlertTriangle, ArrowRight, XCircle } from "lucide-react";
import { Transaction, WalletState } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface SupplyChainProps {
  wallet: WalletState;
  transactions: Transaction[];
  onAddTransaction: (txData: {
    sku: string;
    productName: string;
    sender: string;
    receiver?: string;
    location: string;
    remarks: string;
    status: string;
  }) => Promise<any>;
}

export default function SupplyChainForm({
  wallet,
  transactions,
  onAddTransaction
}: SupplyChainProps) {
  const [formType, setFormType] = useState<"register" | "custody" | "audit">("register");
  
  // Register fields
  const [sku, setSku] = useState("");
  const [productName, setProductName] = useState("");
  const [origin, setOrigin] = useState("");
  const [remarks, setRemarks] = useState("");

  // Transfer fields
  const [transferSku, setTransferSku] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferLocation, setTransferLocation] = useState("");
  const [transferRemarks, setTransferRemarks] = useState("");

  // Audit fields
  const [auditSku, setAuditSku] = useState("");
  const [auditStatus, setAuditStatus] = useState("Inspected");
  const [auditLocation, setAuditLocation] = useState("");
  const [auditRemarks, setAuditRemarks] = useState("");
  
  // Response modal states
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) {
      setErrorMsg("Please connect your cryptograph node/wallet to sign transactions.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      let txPayload: any = {};

      if (formType === "register") {
        if (!sku || !productName || !origin) {
          throw new Error("Please complete all product registration fields.");
        }
        // Verify duplicate SKU
        const isDuplicate = transactions.some(t => t.sku.toLowerCase() === sku.toLowerCase());
        if (isDuplicate) {
          throw new Error(`SKU Code '${sku}' is already registered on-chain in this ledger.`);
        }

        txPayload = {
          sku: sku.trim(),
          productName: productName.trim(),
          sender: wallet.address,
          location: origin.trim(),
          remarks: remarks.trim() || "Batch registered under smart contract constraints.",
          status: "Registered"
        };
      } else if (formType === "custody") {
        if (!transferSku || !transferTo || !transferLocation) {
          throw new Error("Please provide tracking SKU, transit location, and the next custodian address.");
        }
        // Verify key format
        if (!transferTo.startsWith("0x") || transferTo.length !== 42) {
          throw new Error("Recipient Custodian Key must be a valid 42-character Ethereum address (starts with 0x).");
        }

        const matchTx = transactions.find(t => t.sku.toLowerCase() === transferSku.toLowerCase());
        const prodName = matchTx ? matchTx.productName : "Unknown Product Batch";

        txPayload = {
          sku: transferSku.trim(),
          productName: prodName,
          sender: wallet.address,
          receiver: transferTo.trim(),
          location: transferLocation.trim(),
          remarks: transferRemarks.trim() || "Custody transferred under secure transit signatures.",
          status: "InTransit"
        };
      } else {
        if (!auditSku || !auditLocation) {
          throw new Error("Please provide tracing SKU and the current inspection station.");
        }

        const matchTx = transactions.find(t => t.sku.toLowerCase() === auditSku.toLowerCase());
        const prodName = matchTx ? matchTx.productName : "Unknown Audited Batch";

        txPayload = {
          sku: auditSku.trim(),
          productName: prodName,
          sender: wallet.address,
          location: auditLocation.trim(),
          remarks: auditRemarks.trim() || `Inspection completed: ${auditStatus}`,
          status: auditStatus
        };
      }

      const res = await onAddTransaction(txPayload);
      setReceipt(res);
      
      // Clear forms
      setSku("");
      setProductName("");
      setOrigin("");
      setRemarks("");
      setTransferSku("");
      setTransferTo("");
      setTransferLocation("");
      setTransferRemarks("");
      setAuditSku("");
      setAuditLocation("");
      setAuditRemarks("");

    } catch (err: any) {
      setErrorMsg(err.message || "Cryptographic transaction signing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Upper Panel */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-green-400" />
            Supply Chain Smart Signatures
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Authorize new product registrations, path waypoints, and regulatory clearances directly through smart contract signing keys.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Tabs Selector */}
          <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-full">
            <button
              onClick={() => { setFormType("register"); setErrorMsg(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                formType === "register" ? "bg-slate-950 text-blue-400 border border-slate-800 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Award className="w-4 h-4" />
              1. Register Batch
            </button>
            <button
              onClick={() => { setFormType("custody"); setErrorMsg(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                formType === "custody" ? "bg-slate-950 text-amber-500 border border-slate-800 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Plane className="w-4 h-4" />
              2. Custody Waypoint
            </button>
            <button
              onClick={() => { setFormType("audit"); setErrorMsg(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                formType === "audit" ? "bg-slate-950 text-purple-400 border border-slate-800 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              3. Regulatory Audit
            </button>
          </div>

          {/* Actual Active form */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
            <h3 className="text-sm uppercase font-mono tracking-widest text-slate-400 font-bold border-b border-slate-900 pb-3 mb-6">
              {formType === "register" && "Step A: Immutable Batch Initiation"}
              {formType === "custody" && "Step B: Custody Waypoint Signatures"}
              {formType === "audit" && "Step C: State Quality Inspections"}
            </h3>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs mb-6 flex items-start gap-2 animate-fadeIn">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              
              {formType === "register" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400">Unique System SKU Identifier</label>
                      <input
                        type="text"
                        placeholder="SKU-MED-COV320 (Must be unique)"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none font-mono"
                        value={sku}
                        onChange={(e) => setSku(e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400">Batch Product Title</label>
                      <input
                        type="text"
                        placeholder="Premium Pfizer Vaccines Batch D9"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400">Initial Facility/Origin Location</label>
                    <input
                      type="text"
                      placeholder="BioPharm Laboratories Facility 4, Antwerp, Belgium"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400">Registry Remarks</label>
                    <textarea
                      placeholder="Cryptographic metadata constraints established, cold temperature locked -75C."
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none resize-none"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                </>
              )}

              {formType === "custody" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400">Traceable Target SKU</label>
                      <select
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none font-mono"
                        value={transferSku}
                        onChange={(e) => setTransferSku(e.target.value)}
                      >
                        <option value="">-- Choose Tracked SKU --</option>
                        {transactions.map(t => (
                          <option key={t.sku} value={t.sku}>{t.sku} ({t.productName})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400">Transit Waypoint/Location</label>
                      <input
                        type="text"
                        placeholder="Brussels Cargo Hub terminal A"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none"
                        value={transferLocation}
                        onChange={(e) => setTransferLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400">Next Custodian Key (Ethereum Address)</label>
                    <input
                      type="text"
                      placeholder="0xdd2fd4581271e230360230f9337d5c0430bf44c0"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none font-mono text-xs"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400">Transit Remarks</label>
                    <textarea
                      placeholder="Handoff checklist success. Temp logs signed under smart contracts."
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none resize-none"
                      value={transferRemarks}
                      onChange={(e) => setTransferRemarks(e.target.value)}
                    />
                  </div>
                </>
              )}

              {formType === "audit" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400">Auditable Batch SKU</label>
                      <select
                        className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none font-mono"
                        value={auditSku}
                        onChange={(e) => setAuditSku(e.target.value)}
                      >
                        <option value="">-- Choose Tracked SKU --</option>
                        {transactions.map(t => (
                          <option key={t.sku} value={t.sku}>{t.sku} ({t.productName})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400">Audit Status update</label>
                      <select
                        className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none font-mono"
                        value={auditStatus}
                        onChange={(e) => setAuditStatus(e.target.value)}
                      >
                        <option value="Inspected">Inspected (Passed Stage A)</option>
                        <option value="RetailReady">Retail Ready (Cleared for Distribution)</option>
                        <option value="Delivered">Delivered (Handoff to End User)</option>
                        <option value="Flagged">Flagged (Immediate Quarantine Call)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400">Verification Post/Inspection Facility</label>
                    <input
                      type="text"
                      placeholder="FDA Inspection Station Hub 2, New York"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none"
                      value={auditLocation}
                      onChange={(e) => setAuditLocation(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400">Quality Assurances Remarks</label>
                    <textarea
                      placeholder="Chemical structure meets specifications. Cleared for distribution."
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 transition-colors py-2.5 px-4 rounded-xl text-white outline-none resize-none"
                      value={auditRemarks}
                      onChange={(e) => setAuditRemarks(e.target.value)}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !wallet.isConnected 
                    ? "bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed" 
                    : formType === "register" 
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/15" 
                      : formType === "custody" 
                        ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/15" 
                        : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/15"
                }`}
              >
                {loading ? (
                  <>Mining on-chain block, please stand by...</>
                ) : (
                  <>
                    Sign and Mint Ledger Record
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

        {/* Right Columns: Guidelines & receipts */}
        <div className="space-y-6">
          
          {/* Helpful Guidelines Card */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold border-b border-slate-900 pb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Academic Traceability Rules
            </h3>
            <ul className="space-y-3 text-xs leading-relaxed text-slate-400 list-disc list-inside">
              <li>
                <strong className="text-slate-300">Registered</strong> establishes initial cryptographic record batch state.
              </li>
              <li>
                <strong className="text-slate-300">InTransit</strong> marks transfer of custody between distinct node keys.
              </li>
              <li>
                <strong className="text-slate-300">Quarantine Flag</strong> halts movement and locks transfer endpoints permanently.
              </li>
            </ul>
          </div>

          {/* Cryptographic Trace receipt */}
          <AnimatePresence>
            {receipt && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-slate-950 p-6 rounded-2xl border border-blue-500/30 space-y-4 relative"
              >
                <div className="flex justify-between items-start border-b border-slate-900 pb-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mint Receipt
                    </span>
                    <h4 className="text-sm font-display font-bold text-white mt-1">Transaction confirmed!</h4>
                  </div>
                  <button 
                    onClick={() => setReceipt(null)}
                    className="text-slate-500 hover:text-slate-300 font-mono text-xs p-1"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-3 font-mono text-[11px] text-slate-400 leading-normal">
                  <div>
                    <span className="text-slate-500 block">TRANSACTION HASH:</span>
                    <span className="text-slate-300 block truncate">{receipt.transaction.txHash}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block">BLOCK HEIGHT:</span>
                      <strong className="text-white text-xs">#{receipt.block.blockNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">GAS CONSUMED:</span>
                      <strong className="text-slate-300 text-xs">{receipt.transaction.gasUsed}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block">PARENT HASH:</span>
                    <span className="text-slate-500 truncate block text-[10px]">{receipt.block.prevHash}</span>
                  </div>

                  <div className="bg-slate-900 p-2 rounded border border-slate-850 text-[10px] text-emerald-400">
                    ✔ Block successfully appended into simulated MongoDB schema & local chain.
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
