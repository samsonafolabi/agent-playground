import { createWalletClient, custom} from "viem";
import { baseSepolia
 } from "viem/chains";


 const client = createWalletClient({
    chain: baseSepolia,
    transport: custom((window as any).ethereum)
 })