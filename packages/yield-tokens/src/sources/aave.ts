// can be fetched from subgraph
// aave-js: supplyAPR = graph.liquidityRate = core.getReserveCurrentLiquidityRate(_reserve)
// or directly from RPC:
// wrappedAaveToken.LENDING_POOL.getReserveCurrentLiquidityRate(mainTokenAddress)

const tokens = {
  v2: {
    [1]: [{
      // waUSDT
      wrappedToken: '0xf8fd466f12e236f4c96f7cce6c79eadb819abf58',
      aToken: '0x3ed3b47dd13ec9a98b44e6204a523e766b225811',
      underlying: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    },
      {
        // waUSDC
        wrappedToken: '0xd093fa4fb80d09bb30817fdcd442d4d02ed3e5de',
        aToken: '0xbcca60bb61934080951369a648fb03df4f96263c',
        underlying: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
      // waDAI
      {
        wrappedToken: '0x02d60b84491589974263d922d9cc7a3152618ef6',
        aToken: '0x028171bca77440897b824ca71d1c56cac55b68a3',
        underlying: '0x6b175474e89094c44da98b954eedeac495271d0f',
      }],
    [137]: [{
      // USDT
      wrappedToken: '0x19c60a251e525fa88cd6f3768416a8024e98fc19',
      aToken: '0x60d55f02a771d515e077c9c2403a1ef324885cec',
      underlying: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    }, {
      // USDC
      wrappedToken: '0x221836a597948dce8f3568e044ff123108acc42a',
      aToken: '0x1a13f4ca1d028320a707d99520abfefca3998b7f',
      underlying: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    }, {
      // DAI
      wrappedToken: '0xee029120c72b0607344f35b17cdd90025e647b00',
      aToken: '0x27f8d03b3a2196956ed754badc28d73be8830a6e',
      underlying: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    }],
    [43114]: [],
    [42161]: [],
  },
  v3: {
    [1]: [{
      // stataEthUSDT
      wrappedToken: '0x65799b9fd4206cdaa4a1db79254fcbc2fd2ffee6',
      aToken: '0x23878914efe38d27c4d67ab83ed1b93a74d4086a',
      underlying: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    },
      {
        // waUSDT
        wrappedToken: '0xa7e0e66f38b8ad8343cff67118c1f33e827d1455',
        aToken: '0x23878914efe38d27c4d67ab83ed1b93a74d4086a',
        underlying: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      },
      // stataEthUSDC
      {
        wrappedToken: '0x02c2d189b45ce213a40097b62d311cf0dd16ec92',
        aToken: '0x98c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c',
        underlying: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      }, {
        // waUSDC
        wrappedToken: '0x57d20c946a7a3812a7225b881cdcd8431d23431c',
        aToken: '0x98c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c',
        underlying: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      }, {
        //stataEthDAI
        wrappedToken: '0xeb708639e8e518b86a916db3685f90216b1c1c67',
        aToken: '0x018008bfb33d285247a21d44e50697654f754e63',
        underlying: '0x6b175474e89094c44da98b954eedeac495271d0f',
      }, {
        // waDAI
        wrappedToken: '0x098256c06ab24f5655c5506a6488781bd711c14b',
        aToken: '0x018008bfb33d285247a21d44e50697654f754e63',
        underlying: '0x6b175474e89094c44da98b954eedeac495271d0f',
      }, {
        //stataEthWETH
        wrappedToken: '0x03928473f25bb2da6bc880b07ecbadc636822264',
        aToken: '0x4d5f47fa6a74757f35c14fd3a6ef8e3c9bc514e8',
        underlying: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      }, {
        // waWETH
        wrappedToken: '0x59463bb67ddd04fe58ed291ba36c26d99a39fbc6',
        aToken: '0x4d5f47fa6a74757f35c14fd3a6ef8e3c9bc514e8',
        underlying: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      },
    ],
    [137]: [{
      // waWMATIC
      wrappedToken: '0x0d6135b2cfbae3b1c58368a93b855fa54fa5aae1',
      aToken: '0x6d80113e533a2c0fe82eabd35f1875dcea89ea97',
      underlying: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    }, {
      // stataPolWMATIC
      wrappedToken: '0x6f3913333f2d4b7b01d17bedbce1e4c758b94465',
      aToken: '0x6d80113e533a2c0fe82eabd35f1875dcea89ea97',
      underlying: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    }, {
      // waUSDT
      wrappedToken: '0x715d73a88f2f0115d87cfe5e0f25d756b2f9679f',
      aToken: '0x6ab707aca953edaefbc4fd23ba73294241490620',
      underlying: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    }, {
      //stataPolUSDT
      wrappedToken: '0x31f5ac91804a4c0b54c0243789df5208993235a1',
      aToken: '0x6ab707aca953edaefbc4fd23ba73294241490620',
      underlying: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    }, {
      // waUSDC
      wrappedToken: '0xac69e38ed4298490906a3f8d84aefe883f3e86b5',
      aToken: '0x625e7708f30ca75bfd92586e17077590c60eb4cd',
      underlying: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    }, {
      //stataPolUSDC
      wrappedToken: '0xc04296aa4534f5a3bab2d948705bc89317b2f1ed',
      aToken: '0x625e7708f30ca75bfd92586e17077590c60eb4cd',
      underlying: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    }, {
      // waDAI
      wrappedToken: '0xdb6df721a6e7fdb97363079b01f107860ac156f9',
      aToken: '0x82e64f49ed5ec1bc6e43dad4fc8af9bb3a2312ee',
      underlying: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    }, {
      // stataPolDAI
      wrappedToken: '0xfcf5d4b313e06bb3628eb4fe73320e94039dc4b7',
      aToken: '0x82e64f49ed5ec1bc6e43dad4fc8af9bb3a2312ee',
      underlying: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    }, {
      // waWETH
      wrappedToken: '0xa5bbf0f46b9dc8a43147862ba35c8134eb45f1f5',
      aToken: '0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8',
      underlying: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    }, {
      // stataPolWETH
      wrappedToken: '0xd08b78b11df105d2861568959fca28e30c91cf68',
      aToken: '0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8',
      underlying: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    },
    ],
    [42161]: [{
      // waUSDT
      wrappedToken: '0x3c7680dfe7f732ca0279c39ff30fe2eafdae49db',
      aToken: '0x6ab707aca953edaefbc4fd23ba73294241490620',
      underlying: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    }, {
      // stataArbUSDT
      wrappedToken: '0x8b5541b773dd781852940490b0c3dc1a8cdb6a87',
      aToken: '0x6ab707aca953edaefbc4fd23ba73294241490620',
      underlying: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    }, {
      // waUSDC
      wrappedToken: '0xe719aef17468c7e10c0c205be62c990754dff7e5',
      aToken: '0x625e7708f30ca75bfd92586e17077590c60eb4cd',
      underlying: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    }, {
      // stataArbUSDC
      wrappedToken: '0x3a301e7917689b8e8a19498b8a28fc912583490c',
      aToken: '0x625e7708f30ca75bfd92586e17077590c60eb4cd',
      underlying: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    }, {
      // stataArbUSDCn
      wrappedToken: '0xbde67e089886ec0e615d6f054bc6f746189a3d56',
      aToken: '0x625e7708f30ca75bfd92586e17077590c60eb4cd',
      underlying: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    }, {
      // waDAI
      wrappedToken: '0x345a864ac644c82c2d649491c905c71f240700b2',
      aToken: '0x82e64f49ed5ec1bc6e43dad4fc8af9bb3a2312ee',
      underlying: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    }, {
      // stataArbDAI
      wrappedToken: '0x426e8778bf7f54b0e4fc703dcca6f26a4e5b71de',
      aToken: '0x82e64f49ed5ec1bc6e43dad4fc8af9bb3a2312ee',
      underlying: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    }, {
      // waWETH
      wrappedToken: '0x18c100415988bef4354effad1188d1c22041b046',
      aToken: '0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8',
      underlying: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    }, {
      // stataArbWETH
      wrappedToken: '0x18468b6eba332285c6d9bb03fe7fb52e108c4596',
      aToken: '0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8',
      underlying: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    }],
    [43114]: [{
      // stataAvaUSDT
      wrappedToken: '0x759a2e28d4c3ad394d3125d5ab75a6a5d6782fd9',
      aToken: '0x6ab707aca953edaefbc4fd23ba73294241490620',
      underlying: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
    }, {
      // stataAvaUSDC
      wrappedToken: '0xe7839ea8ea8543c7f5d9c9d7269c661904729fe7',
      aToken: '0x625e7708f30ca75bfd92586e17077590c60eb4cd',
      underlying: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    }, {
      // StataAvaDAI
      wrappedToken: '0x234c4b76f749dfffd9c18ea7cc0972206b42d019',
      aToken: '0x82e64f49ed5ec1bc6e43dad4fc8af9bb3a2312ee',
      underlying: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
    }, {
      // stataAvaWETH
      wrappedToken: '0x41bafe0091d55378ed921af3784622923651fdd8',
      aToken: '0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8',
      underlying: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
    }, {
      // stataAvaWAVAX
      wrappedToken: '0xa291ae608d8854cdbf9838e28e9badcf10181669',
      aToken: '0x6d80113e533a2c0fe82eabd35f1875dcea89ea97',
      underlying: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    }, {
      // WBTC
      wrappedToken: '0xb516f74eb030cebd5f616b1a33f88e1213b93c2c',
      aToken: '0x078f358208685046a11c85e8ad32895ded33a249',
      underlying: '0x50b7545627a5162f82a992c33b87adc75187b218',
    }]
  }
}

// Subgraph
// liquidityRate, depositors APR (in rays - 27 digits)
const endpoints = [
  { version: 'v2', network: 1, subgraph: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2' },
  { version: 'v2', network: 137, subgraph: 'https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic' },
  { version: 'v3', network: 1, subgraph: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3' },
  { version: 'v3', network: 137, subgraph: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-polygon' },
  { version: 'v3', network: 42161, subgraph: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-arbitrum' },
  { version: 'v3', network: 43114, subgraph: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-avalanche' },
]

const query = `
  query getReserves($aTokens: [String!], $underlyingAssets: [Bytes!]) {
    reserves(
      where: {
        aToken_in: $aTokens
        underlyingAsset_in: $underlyingAssets
        isActive: true
      }
    ) {
      underlyingAsset
      liquidityRate
    }
  }
`

interface ReserveResponse {
  data: {
    reserves: [
      {
        underlyingAsset: string
        liquidityRate: string
      }
    ]
  }
}

/**
 * Fetching and parsing aave APRs from a subgraph
 *
 * @returns APRs for aave tokens
 */
export const aave = async (network: 1 | 137 | 42161 | 43114, version: keyof (typeof tokens) = 'v2') => {

  if (!network || (network != 1 && network != 137 && network != 42161 && network != 43114)) {
    return {}
  }

  if ((network == 42161 && version != 'v3') || (network == 43114 && version != 'v3')) {
    return {}
  }
  const tokensFiltered = tokens[version][network]
  const aTokens = tokensFiltered.map(({ aToken }) => aToken)
  const underlyingAssets = tokensFiltered.map(({ underlying }) => underlying);
  try {
    const requestQuery = {
      operationName: 'getReserves',
      query,
      variables: {
        aTokens,
        underlyingAssets,
      },
    }

    const endpoint = endpoints.find((e) => e.version == version && e.network == network)?.subgraph

    if (!endpoint) {
      throw 'no endpoint found'
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(requestQuery)
    })

    const {
      data: { reserves },
    } = await response.json() as ReserveResponse

    const liquidityRateByUnderlyingToken: { [tokenAddress: string]: number } = Object.fromEntries(
      reserves.filter((r) => {
        return underlyingAssets.includes(r.underlyingAsset.toLowerCase())
      }).map((r) => {
        return [r.underlyingAsset.toLowerCase(), Math.round(Number(r.liquidityRate.slice(0, -20)) / 1e3)]
      })
    )
    const aprEntries = tokensFiltered.map(({ wrappedToken, underlying }) => {
      const liquidityRate = liquidityRateByUnderlyingToken[underlying]

      return [wrappedToken, liquidityRate ?? 0]
    })
    return Object.fromEntries(aprEntries)
  } catch (error) {
    console.warn(error)

    return {}
  }
}

// TODO: RPC multicall
// always upto date
// const lendingPoolAddress = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9';
