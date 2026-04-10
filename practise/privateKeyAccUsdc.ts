import { createWalletClient, encodeFunctionData, http, parseUnits } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { ethers } from "ethers";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const USDC_CONTRACT_ADDRESS = "0xD1250711a0198255A0a431b351a6a66c4397823D";

const USDC_ABI = [
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;

async function getAccount() {
  const keystore = fs.readFileSync(process.env.KEYSTORE_PATH!, "utf8");
  const wallet = await ethers.Wallet.fromEncryptedJson(
    keystore,
    process.env.KEYSTORE_PASSWORD!,
  );
  return privateKeyToAccount(wallet.privateKey as `0x${string}`);
}

// DEFINE THE FUNCTION FIRST
async function sendUSDC(recipient: string, amountUSDC: string) {
  const account = await getAccount();

  const client = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(process.env.RPC_URL),
  });

  // Convert USDC amount (6 decimals)
  const amount = parseUnits(amountUSDC, 6);

  // Encode the transfer function call
  const data = encodeFunctionData({
    abi: USDC_ABI,
    functionName: "transfer",
    args: [recipient as `0x${string}`, amount],
  });

  // Send to USDC contract (using the correct variable name)
  const hash = await client.sendTransaction({
    account,
    to: USDC_CONTRACT_ADDRESS, // ← Fixed: use the correct variable name
    data,
  });

  console.log(`Sent ${amountUSDC} USDC to ${recipient}`);
  console.log(`Transaction: https://sepolia.basescan.org/tx/${hash}`);
  return hash;
}

// THEN CALL THE FUNCTION
await sendUSDC("0xc906Bc39237753606668964eD068b1906b69476d", "5.5");
