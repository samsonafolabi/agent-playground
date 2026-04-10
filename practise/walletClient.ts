import { createWalletClient, custom, parseEther} from "viem";
import { baseSepolia
 } from "viem/chains";

 const client = createWalletClient({
    chain: baseSepolia,
    transport: custom((window as any).ethereum)
 })

 const [account] = await client.getAddresses()

 const hash = await client.sendTransaction({
    account,
    to : '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
    value: parseEther('0.001')
 })