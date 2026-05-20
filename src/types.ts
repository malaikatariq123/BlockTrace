export interface Transaction {
  id: string;
  txHash: string;
  blockNumber: number;
  sender: string;
  receiver: string;
  productName: string;
  sku: string;
  location: string;
  remarks: string;
  status: "Registered" | "InTransit" | "Inspected" | "RetailReady" | "Delivered" | "Flagged";
  timestamp: string;
  gasUsed: number;
}

export interface Block {
  blockNumber: number;
  timestamp: string;
  prevHash: string;
  blockHash: string;
  transactions: Transaction[];
  nonce: number;
  difficulty: number;
}

export interface WalletState {
  address: string | null;
  balance: string; // ETH balance
  networkName: string;
  chainId: number | null;
  isConnected: boolean;
  isSandboxMode: boolean; // True if using virtual key simulation, false for real MetaMask
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  system: "Database" | "Ethereum" | "Express" | "Metadata";
  message: string;
}

export type ActiveTab = "dashboard" | "explorer" | "track" | "admin" | "docs";
