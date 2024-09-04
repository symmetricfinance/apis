const url = 'https://api.beefy.finance/apy/breakdown?_='

const tokens = {
  wmooExactlySupplyUSDC: {
    address: '0xe5e9168b45a90c1e5730da6184cc5901c6e4353f',
    vaultId: 'exactly-supply-usdc',
  },
  wmooExactlySupplyETH: {
    address: '0x44b1cea4f597f493e2fd0833a9c04dfb1e479ef0',
    vaultId: 'exactly-supply-eth',
  },
  // To get the vaultId, get the vault address from the token contract(token.vault()),
  // and search for the vault address in the link: https://api.beefy.finance/vaults
}

export const beefy = async () => {
  const response = await fetch(url)
  const json = await response.json() as { [key: string]: { vaultApr: number } }

  const aprEntries = Object.entries(tokens).map(([_, { address, vaultId }]) => [
    address,
    json[vaultId]?.vaultApr ? Math.round(Number(json[vaultId]?.vaultApr) * 10000) : 0
  ])

  return Object.fromEntries(aprEntries)
}
