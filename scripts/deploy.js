const hre = require("hardhat");

async function main() {
  console.log("=================================================");
  console.log("BlockTrace: Initialising Smart Contract Deployment");
  console.log("=================================================");

  // Get the ContractFactory
  const BlockTrace = await hre.ethers.getContractFactory("BlockTrace");
  
  // Deploy the contract
  console.log("Deploying BlockTrace...");
  const blockTrace = await BlockTrace.deploy();

  await blockTrace.waitForDeployment();

  const contractAddress = await blockTrace.getAddress();
  
  console.log("-------------------------------------------------");
  console.log("✔ BlockTrace contract deployed successfully!");
  console.log(`🔗 Contract Address: ${contractAddress}`);
  console.log("=================================================");
  console.log("Copy and paste this contract address inside your .env configuration in backend!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
