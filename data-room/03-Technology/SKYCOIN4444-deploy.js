/**
 * SKYCOIN Token Deployment Script
 * Deploys the SKYCOIN token contract to Ethereum mainnet
 * 
 * Usage:
 * npx hardhat run scripts/deploy.js --network mainnet
 * 
 * Environment Variables Required:
 * - PRIVATE_KEY: Your wallet private key
 * - ETHERSCAN_API_KEY: For contract verification
 */

const hre = require("hardhat");

async function main() {
  console.log("=".repeat(60));
  console.log("SKYCOIN Token Deployment Script");
  console.log("=".repeat(60));
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`\nDeploying contract from account: ${deployer.address}`);
  console.log(`Account balance: ${hre.ethers.utils.formatEther(await deployer.getBalance())} ETH`);
  
  // Deploy contract
  console.log("\n" + "=".repeat(60));
  console.log("Deploying SKYCOINToken contract...");
  console.log("=".repeat(60));
  
  const SKYCOINToken = await hre.ethers.getContractFactory("SKYCOINToken");
  const token = await SKYCOINToken.deploy();
  await token.deployed();
  
  console.log(`\n✅ Token contract deployed to: ${token.address}`);
  
  // Wait for confirmations
  console.log("\nWaiting for 5 block confirmations...");
  await token.deployTransaction.wait(5);
  
  // Get contract details
  console.log("\n" + "=".repeat(60));
  console.log("Token Details");
  console.log("=".repeat(60));
  
  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();
  const decimals = await token.decimals();
  
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Total Supply: ${hre.ethers.utils.formatEther(totalSupply)} ${symbol}`);
  console.log(`Decimals: ${decimals}`);
  
  // Allocate founder tokens
  console.log("\n" + "=".repeat(60));
  console.log("Allocating Founder Tokens");
  console.log("=".repeat(60));
  
  const founderAddress = deployer.address; // Use deployer as founder
  console.log(`Founder address: ${founderAddress}`);
  
  const allocateTx = await token.allocateFounderTokens(founderAddress);
  console.log(`Allocation transaction: ${allocateTx.hash}`);
  
  await allocateTx.wait();
  console.log("✅ Founder tokens allocated");
  
  // Verify founder balance
  const founderBalance = await token.balanceOf(founderAddress);
  console.log(`Founder balance: ${hre.ethers.utils.formatEther(founderBalance)} ${symbol}`);
  
  // Verify contract on Etherscan
  console.log("\n" + "=".repeat(60));
  console.log("Verifying Contract on Etherscan");
  console.log("=".repeat(60));
  
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\nWaiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
      console.log("Verifying contract...");
      await hre.run("verify:verify", {
        address: token.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("⚠️  Verification failed (may already be verified)");
      console.log(error.message);
    }
  } else {
    console.log("⚠️  ETHERSCAN_API_KEY not set, skipping verification");
  }
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("Deployment Summary");
  console.log("=".repeat(60));
  
  console.log(`\nContract Address: ${token.address}`);
  console.log(`Etherscan URL: https://etherscan.io/token/${token.address}`);
  console.log(`Founder Address: ${founderAddress}`);
  console.log(`Founder Balance: ${hre.ethers.utils.formatEther(founderBalance)} ${symbol}`);
  console.log(`\nNext Steps:`);
  console.log(`1. Save the contract address: ${token.address}`);
  console.log(`2. Transfer founder tokens to multi-sig wallet`);
  console.log(`3. Allocate investor tokens with vesting schedules`);
  console.log(`4. Allocate charity tokens to SkyHope`);
  console.log(`5. List on exchanges (Binance, Coinbase, Kraken)`);
  
  console.log("\n" + "=".repeat(60));
  console.log("✅ Deployment Complete!");
  console.log("=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
