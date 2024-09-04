type Networks = Record<
  string,
  { rpc: string; poolsSubgraph: string; gaugesSubgraph: string | null }
>;

const networks: Networks = {
  telos: {
    rpc: `https://mainnet-eu.telos.net/evm`,
    poolsSubgraph:
      "https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos/prod/gn",
    gaugesSubgraph:
      "https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos-gauges/prod/gn",
  },
};

export async function galxeSwaps(user: string): Promise<any> {
  const query = `{
    swaps(where: {
      tokenOut_in: ["0xd102ce6a4db07d247fcc28f366a623df0938ca9e", "0xb4b01216a5bc8f1c8a33cd990a1239030e60c905", "0x8d97cea50351fb4329d591682b148d43a0c3611b", "0x975ed13fa16857e83e7c493c7741d556eaad4a3f"]
      userAddress: "${user}"
      valueUSD_gte: 10 
      timestamp_gte: <campaign start unix time>
      timestamp_lte: <campaign end unix time>
    }) {
      timestamp
    }
  }`;

  const response: any = await fetchGraphQL(
    query,
    networks["telos"].poolsSubgraph
  );

  const swaps = response.data.swaps ?? [];

  if (swaps.length > 0) {
    // Group swaps by day
    const swapsByDay: Record<string, any[]> = {};
    swaps.forEach((swap: any) => {
      const date = new Date(swap.timestamp * 1000).toISOString().split("T")[0];
      if (!swapsByDay[date]) {
        swapsByDay[date] = [];
      }
      swapsByDay[date].push(swap);
    });

    // Limit to 10 swaps per day
    const limitedSwaps = Object.values(swapsByDay).flatMap((daySwaps: any[]) =>
      daySwaps.slice(0, 10)
    );

    return limitedSwaps;
  }
  return swaps;
}

export async function galxeJoins(user: string): Promise<any> {
  const query = `{
    joinExits(where: {
    pool_: {
      address_in: ["0x9a77bd2edbbb68173275cda967b76e9213949ace", "0x2d714951f7165a51e8bd61f92d8a979ab0ed4b59", "0x2b014535525aad053b8811c22a337e57caae82df"]
    }
    user: "${user}"
 		valueUSD_gte: 10 
      timestamp_gte: <campaign start unix time>
      timestamp_lte: <campaign end unix time>
    type: Join
  }) {
    timestamp
  }}`;

  const response: any = await fetchGraphQL(
    query,
    networks["telos"].poolsSubgraph
  );

  const joins = response.data.joinExits ?? [];
  if (joins.length > 0) {
    // Group joins by day
    const joinsByDay: Record<string, any[]> = {};
    joins.forEach((join: any) => {
      const date = new Date(join.timestamp * 1000).toISOString().split("T")[0];
      if (!joinsByDay[date]) {
        joinsByDay[date] = [];
      }
      joinsByDay[date].push(join);
    });

    // Limit to 3 joins per day
    const limitedJoins = Object.values(joinsByDay).flatMap((dayJoins: any[]) =>
      dayJoins.slice(0, 3)
    );

    return limitedJoins;
  }
}

async function fetchGraphQL(query: string, subgraph: string) {
  const response = await fetch(subgraph, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return await response.json();
}
