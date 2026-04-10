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

  console.log("Using account:", wallet.address);
  console.log("Minting to contract:", CONTRACT_ADDRESS);

  // Attach to existing contract
  const MockUSDC = await ethers.getContractFactory("MockUSDC", signer);
  const mockUSDC = MockUSDC.attach(CONTRACT_ADDRESS);

  const mintAmount = ethers.parseUnits("10000", 6);
  const tx = await mockUSDC.mint(wallet.address, mintAmount);
  await tx.wait();

  console.log("Minted 10,000 USDC");
  console.log(
    "Balance:",
    ethers.formatUnits(await mockUSDC.balanceOf(wallet.address), 6),
    "USDC",
  );
}

main().catch(console.error);
