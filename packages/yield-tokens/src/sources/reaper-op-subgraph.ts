const yieldTokens = {
  rfUSDT: '0x51868bb8b71fb423b87129908fa039b880c8612d',
  rfWETH: '0x1bad45e92dce078cf68c2141cd34f54a02c92806',
  rfOP: '0xcecd29559a84e4d4f6467b36bbd4b9c3e6b89771',
  rfwstETH: '0xb19f4d65882f6c103c332f0bc012354548e9ce0e', // needs additional lido APR
  rfWBTC: '0xf6533b6fcb3f42d2fc91da7c379858ae6ebc7448',
  rfDAI: '0xc0f5da4fb484ce6d8a6832819299f7cd0d15726e',
  rfUSDC: '0x508734b52ba7e04ba068a2d4f67720ac1f63df47',
}

const query = `
  query getVaults($ids: [ID!]) {
    vaults(where:{id_in: $ids}){
      id
      apr
    }
  }
`

const requestQuery = {
  operationName: 'getVaults',
  query,
  variables: {
    ids: Object.values(yieldTokens),
  },
};

const url = 'https://api.thegraph.com/subgraphs/name/byte-masons/multi-strategy-vaults-optimism'

interface SubgraphResponse {
  data: {
    vaults: {
      id: string
      apr: string
    }[]
  }
}

export const reaperOpSubgraph = async () => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(requestQuery)
  })

  const {
    data: { vaults },
  } = await response.json() as SubgraphResponse

  const lidoAPRResponse = await fetch('https://eth-api.lido.fi/v1/protocol/steth/apr/sma')
  const { data: { smaApr } } = await lidoAPRResponse.json() as { data: { smaApr: string } }

  const aprEntries = vaults.map(({ id, apr }) => [
    id,
    (id === yieldTokens.rfwstETH) ? Number(apr) + Math.round(Number(smaApr) * 100) : Number(apr)
  ])

  return Object.fromEntries(aprEntries)
}
