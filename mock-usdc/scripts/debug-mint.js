require("dotenv").config();

const fs = require("fs");
const { ethers } = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0xD1250711a0198255A0a431b351a6a66c4397823D";

  const keystoreJson = fs.readFileSync(process.env.KEYSTORE_PATH, "utf8");
  const wallet = await ethers.Wallet.fromEncryptedJson(
    keystoreJson,
    process.env.KEYSTORE_PASSWORD,
  );

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = wallet.connect(provider);

  console.log("Wallet address:", wallet.address);

  // Attach to contract
  const MockUSDC = await ethers.getContractFactory("MockUSDC", signer);
  const mockUSDC = MockUSDC.attach(CONTRACT_ADDRESS);

  // Check contract details
  console.log("Contract address:", await mockUSDC.getAddress());
  console.log("Contract owner:", await mockUSDC.owner());
  console.log(
    "Total supply before:",
    ethers.formatUnits(await mockUSDC.totalSupply(), 6),
  );

  // Check balance before
  const balanceBefore = await mockUSDC.balanceOf(wallet.address);
  console.log("Balance before mint:", ethers.formatUnits(balanceBefore, 6));

  // Mint
  const mintAmount = ethers.parseUnits("10000", 6);
  console.log("Minting:", ethers.formatUnits(mintAmount, 6), "USDC");

  const tx = await mockUSDC.mint(wallet.address, mintAmount);
  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("Transaction status:", receipt.status); // 1 = success, 0 = failure

  // Check balance after
  const balanceAfter = await mockUSDC.balanceOf(wallet.address);
  console.log("Balance after mint:", ethers.formatUnits(balanceAfter, 6));

  // Check total supply
  console.log(
    "Total supply after:",
    ethers.formatUnits(await mockUSDC.totalSupply(), 6),
  );
}

main().catch(console.error);
