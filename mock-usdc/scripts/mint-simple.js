require("dotenv").config();

const fs = require("fs");
const { ethers } = require("hardhat");

async function main() {
  const keystorePath = process.env.KEYSTORE_PATH;
  const password = process.env.KEYSTORE_PASSWORD;

  if (!keystorePath || !fs.existsSync(keystorePath)) {
    console.error("Keystore not found at:", keystorePath);
    process.exit(1);
  }

  if (!password) {
    console.error("KEYSTORE_PASSWORD not set");
    process.exit(1);
  }

  console.log("Loading keystore from:", keystorePath);

  // Read keystore JSON
  const keystoreJson = fs.readFileSync(keystorePath, "utf8");

  // Decrypt with Ethers v6
  const wallet = await ethers.Wallet.fromEncryptedJson(keystoreJson, password);

  console.log("Using account:", wallet.address);

  // Connect to provider
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = wallet.connect(provider);

  // Deploy MockUSDC
  const MockUSDC = await ethers.getContractFactory("MockUSDC", signer);
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();

  const address = await mockUSDC.getAddress();
  console.log("MockUSDC deployed to:", address);

  // Mint 10,000 USDC
  const mintAmount = ethers.parseUnits("10000", 6);
  const tx = await mockUSDC.mint(wallet.address, mintAmount);
  await tx.wait();

  console.log("Minted 10,000 USDC to:", wallet.address);

  const balance = await mockUSDC.balanceOf(wallet.address);
  console.log("Balance:", ethers.formatUnits(balance, 6), "USDC");
}

main().catch(console.error);
