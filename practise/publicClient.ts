import {createPublicClient, http} from 'viem'
import {baseSepolia} from 'viem/chains'

const client = createPublicClient ({
    name: 'Public Client',
    chain: baseSepolia,
    transport: http(),
    batch: {
        multicall: {
            batchSize: 1024,
            wait: 16
        }
    }
})


const blockNumber = await client.getBlockNumber()