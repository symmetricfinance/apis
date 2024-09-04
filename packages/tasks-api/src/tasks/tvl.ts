import { Decimal } from "decimal.js";

type Networks = Record<
  string,
  { rpc: string; poolsSubgraph: string; gaugesSubgraph: string | null }
>;

type SymmPools = Record<string, string>;

const networks: Networks = {
  telos: {
    rpc: `https://mainnet-eu.telos.net/evm`,
    poolsSubgraph:
      "https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos/prod/gn",
    gaugesSubgraph:
      "https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos-gauges/prod/gn",
  },
  meter: {
    rpc: "https://meter.blockpi.network/v1/rpc/216bb10a3653b0a8131afee4f6cf1982945022b4",
    poolsSubgraph:
      "https://graph-meter.voltswap.finance/subgraphs/name/symmetric-meter",
    gaugesSubgraph:
      "https://graph-meter.voltswap.finance/subgraphs/name/symmetric-meter-gauges",
  },
  "artela-testnet": {
    rpc: "https://api.zan.top/node/v1/artela/testnet/43577389172042b2bb9be7d15c89a59d",
    poolsSubgraph:
      "https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-artela-testnet/prod/gn",
    gaugesSubgraph: null,
  },
};

const symmPools: SymmPools = {
  telos: "0xbf0fa44e5611c31429188b7dcc59ffe794d1980e000200000000000000000009",
  meter: "0xabbcd1249510a6afb5d1e6d055bf86637e7dad63000200000000000000000009",
  "artela-testnet":
    "0x1ff97abe4c5a4b7ff90949b637e71626bef0dcee000000000000000000000002",
};

const symmEscrows: SymmPools = {
  telos: "0x0d0b7efc6e20b96841f37b28219a595a81c4615a",
  meter: "0xdae34cfc2a0ef52ac8417eefc2a1c5ceac50bfe7",
  "artela-testnet": "",
};

export async function latestSyncedBlock(network: string): Promise<number> {
  const query = `{
    _meta {
      block {
        number
      }
    }
  }`;

  const response: any = await fetchGraphQL(
    query,
    networks[network].gaugesSubgraph as string
  );

  return Number(response.data._meta.block.number);
}

export async function poolTokenPrice(
  pool: string,
  block: number,
  network: string
): Promise<Decimal> {
  const query = `{
    token (id: "${pool}", block: {number: ${block}}) {
      latestUSDPrice
    }
}`;

  const response: any = await fetchGraphQL(
    query,
    networks[network].poolsSubgraph as string
  );

  return response.data.token
    ? new Decimal(response.data.token.latestUSDPrice)
    : new Decimal(0);
}

export async function poolShares(
  pool: string,
  block: number,
  network: string
): Promise<Record<string, Decimal>> {
  const query = `{
    poolShares(
      block: {number: ${block}}
      where: {balance_gt: 0, poolId_: {address: "${pool}"}}
    ) {
      userAddress {
        id
      }
      balance
    }
}`;

  const response: any = await fetchGraphQL(
    query,
    networks[network].poolsSubgraph as string
  );
  const poolTVLs: Record<string, Decimal> = {};
  const shares = response.data.poolShares || [];
  shares.forEach((s: any) => {
    poolTVLs[s.userAddress.id] = new Decimal(s.balance);
  });
  if (pool === symmPools[network].substring(0, 42)) {
    poolTVLs[symmEscrows[network]] = new Decimal(0);
  }
  return poolTVLs;
}

export async function poolGaugeShares(
  pool: string,
  block: number,
  network: string
): Promise<Record<string, Decimal>> {
  const isSYMMpool = pool === symmPools[network].substring(0, 42);
  const query = !isSYMMpool
    ? `{
    gaugeShares(
      block: {number: ${block}}
      where: {gauge_: {poolAddress: "${pool}"}, balance_gt: "0"}
    ) {
      user {
        id
      }
      balance
    }
}`
    : `{
        votingEscrowLocks(
          block: {number: ${block}}
          where: {
            lockedBalance_gt: 0
          }
        ) {
          user {
            id
          }
          lockedBalance
        }
      }`;

  const response: any = await fetchGraphQL(
    query,
    networks[network].gaugesSubgraph as string
  );

  const gaugeTVLs: Record<string, Decimal> = {};
  const shares = isSYMMpool
    ? response.data.votingEscrowLocks || []
    : response.data.gaugeShares || [];
  shares.forEach((s: any) => {
    const balance = isSYMMpool ? s.lockedBalance : s.balance;
    gaugeTVLs[s.user.id] = new Decimal(balance);
  });
  return gaugeTVLs;
}



async function fetchGraphQL(query: string, subgraph: string) {
  const response = await fetch(subgraph, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return await response.json();
}
