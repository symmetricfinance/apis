import { createPublicClient, http, parseAbi } from "viem"
import { gnosis } from "viem/chains"

const sdaiAddress = '0xaf204776c7245bf4147c2612bf6e5972ee483701';

// sDAI view helper
const address = '0xd499b51fcfc66bd31248ef4b28d656d67e591a94';

const abi = parseAbi(['function vaultAPY() view returns (uint256)'])

const client = createPublicClient({
  chain: gnosis,
  transport: http('https://rpc.ankr.com/gnosis'),
})

export const makerGnosis = async () => {
  try {
    const vaultAPY = await client.readContract({
      address,
      abi,
      functionName: 'vaultAPY'
    })
    const apr = Math.round(Number(vaultAPY) * (10 ** -14))
    return { [sdaiAddress]: apr }
  } catch (error) {
    console.log(error)
    return {}
  }
}