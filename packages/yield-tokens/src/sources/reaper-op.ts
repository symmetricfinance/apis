import { abi } from './abis/reaperStrategy'
import { createPublicClient, http } from 'viem'
import { optimism } from 'viem/chains'

const client = createPublicClient({
  chain: optimism,
  transport: http('https://mainnet.optimism.io'),
})

export const yieldTokens = {
  rfsoUSDC: '0x875456b73cbc58aa1be98dfe3b0459e0c0bf7b0e',
  rfsoUSDT: '0x1e1bf73db9b278a95c9fe9205759956edea8b6ae',
  rfsoDAI: '0x19ca00d242e96a30a1cad12f08c375caa989628f',
  rfsoWBTC: '0x73e51b0368ef8bd0070b12dd992c54aa53bcb5f4',
  rfsoWSTETH: '0x3573de618ae4a740fb24215d93f4483436fbb2b6',
} as { [key: string]: `0x${string}` }

export const strategiesMap = {
  rfsoUSDC: '0xe726586f11bfb7856d4c52c77cdc5ff333953e15',
  rfsoUSDT: '0x5c8765f08aec9f117b58b83834ca45c948a59ab1',
  rfsoDAI: '0xbbaefef873c512f55f9c4df00d6850cb5b808a76',
  rfsoWBTC: '0xfb0f98739c8437d38f7c1926787707766257e390',
  rfsoWSTETH: '0x5534a31217b883e849b6f96b0ae21ad6b71c0112',
} as { [key: string]: `0x${string}` }

const noRates = Object.fromEntries(
  Object.values(yieldTokens).map((v) => [v, 0])
)

const getAprs = () => {
  const contracts = Object.keys(strategiesMap).map((coin) => ({
    address: strategiesMap[coin],
    abi,
    functionName: 'averageAPRAcrossLastNHarvests',
    args: [3],
  }))

  return client.multicall({ contracts })
}

export const reaperOp = async () => {
  try {
    const results = await getAprs()

    const aprs = Object.keys(strategiesMap).map((coin, i) => [
      yieldTokens[coin],
      Math.round(Number(results[i].result)),
    ])

    return Object.fromEntries(aprs)
  } catch (error) {
    console.log(error)
    return noRates
  }
}
