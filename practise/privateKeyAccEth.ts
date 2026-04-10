import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { ethers } from "ethers";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

async function getAccount() {
  const keystore = fs.readFileSync(process.env.KEYSTORE_PATH!, "utf8");

  const wallet = await ethers.Wallet.fromEncryptedJson(
    keystore,
    process.env.KEYSTORE_PASSWORD!,
  );

  return privateKeyToAccount(wallet.privateKey as `0x${string}`);
}

const account = await getAccount();

const client = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.RPC_URL),
});

const publicClient = createPublicClient({
  name: "Public Client",
  chain: baseSepolia,
  transport: http(),
  batch: {
    multicall: {
      batchSize: 1024,
      wait: 16,
    },
  },
});

// async function main() {
//   const account = await getAccount();

//   const client = createWalletClient({
//     account,
//     chain: baseSepolia,
//     transport: http(process.env.RPC_URL),
//   });

//   console.log("✅ Wallet ready:", account.address);
// }

// main();

// 1. Send transaction
console.log("Sending transaction...");
const hash = await client.sendTransaction({
  to: "0xc906Bc39237753606668964eD068b1906b69476d",
  value: parseEther("0.001"),
});
console.log("TX Hash:", hash);

// 2. Wait for confirmation
console.log("Waiting for confirmation...");
const receipt = await publicClient.waitForTransactionReceipt({ hash });

// 3. See result
if (receipt.status === "success") {
  console.log("✅ Transaction confirmed in block", receipt.blockNumber);
  console.log(`https://sepolia.basescan.org/tx/${hash}`);
} else {
  console.log("❌ Transaction failed!");
}
