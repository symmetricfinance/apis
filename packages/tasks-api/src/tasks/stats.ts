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

async function fetchGraphQL(query: string, subgraph: string) {
  const response = await fetch(subgraph, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return await response.json();
}

function roundToMidnightUTC(timestamp: number): number {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  date.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
  return Math.floor(date.getTime() / 1000); // Convert back to seconds
}

async function fetchSnapshot(network: string, timestamp: number) {
  const ts = roundToMidnightUTC(timestamp);

  const query = `{
    balancerSnapshots(
      orderBy: timestamp
      orderDirection: desc
      where: { timestamp: ${ts} }
    ) {
      totalSwapVolume
      totalSwapCount
      totalSwapFee
      totalProtocolFee
      totalLiquidity
    }
  }`;

  const response: any = await fetchGraphQL(
    query,
    networks[network].poolsSubgraph as string
  );

  return response.data.balancerSnapshots[0];
}

async function fetchJoinExits(
  network: string,
  from: number,
  to: number,
  skip = 0
) {
  const fromTimestamp = roundToMidnightUTC(from);
  const toTimestamp = roundToMidnightUTC(to);

  const query = `{
    joinExits(
      first: 1000
      skip: ${skip}
      where: { 
        timestamp_gte: ${fromTimestamp},
        timestamp_lte: ${toTimestamp}
      }
    ) {
      id
    }
  }`;

  const response: any = await fetchGraphQL(
    query,
    networks[network].poolsSubgraph as string
  );

  return response.data.joinExits || [];
}

async function fetchNumberofJoinExits(
  network: string,
  from: number,
  to: number
) {
  let numberOfEntries = 0;

  let joinExits = await fetchJoinExits(network, from, to);
  let entries = joinExits.length || 0;
  numberOfEntries += entries;
  let skip = 0;
  while (entries === 1000) {
    skip += 1000;
    console.log(`Fetching joinExits from ${from} to ${to} with skip ${skip}`);
    const joinsExits = await fetchJoinExits(network, from, to, skip);
    entries = joinsExits.length || 0;
    numberOfEntries += entries;
  }

  return numberOfEntries;
}

async function fetchUsers(network: string, from: number, to: number, skip = 0) {
  const fromTimestamp = roundToMidnightUTC(from);
  const toTimestamp = roundToMidnightUTC(to);

  const query = `{
    users(
      first: 1000
      skip: ${skip}
      where: {
        swaps_: {
          timestamp_gte: ${fromTimestamp},
          timestamp_lte: ${toTimestamp}
        }
      }
    ) {
      id
    }
  }`;

  const response: any = await fetchGraphQL(
    query,
    networks[network].poolsSubgraph as string
  );

  return response.data.users || [];
}

async function fetchNumberofUsers(network: string, from: number, to: number) {
  let numberOfEntries = 0;

  let users = await fetchUsers(network, from, to);
  let entries = users.length || 0;
  numberOfEntries += entries;
  let skip = 0;
  while (entries === 1000) {
    skip += 1000;
    users = await fetchUsers(network, from, to, skip);
    entries = users.length || 0;
    numberOfEntries += entries;
  }

  return numberOfEntries;
}

async function fetchVELocks(
  network: string,
  from: number,
  to: number,
  skip = 0
) {
  const fromTimestamp = roundToMidnightUTC(from);
  const toTimestamp = roundToMidnightUTC(to);

  const query = `{
    votingEscrowLocks(
      first: 1000
      skip: ${skip}
      where: {
        updatedAt_gte: ${fromTimestamp},
        updatedAt_lte: ${toTimestamp}
      }
    ) {
      id
    }
  }`;

  const response: any = await fetchGraphQL(
    query,
    networks[network].gaugesSubgraph as string
  );

  return response.data.votingEscrowLocks || [];
}

async function fetchNumberofVELocks(network: string, from: number, to: number) {
  let numberOfEntries = 0;

  let locks = await fetchVELocks(network, from, to);
  let entries = locks.length || 0;
  numberOfEntries += entries;

  let skip = 0;
  while (entries === 1000) {
    skip += 1000;
    locks = await fetchVELocks(network, from, to, skip);
    entries = locks.length || 0;
    numberOfEntries += entries;
  }

  return numberOfEntries;
}

export async function fetchStats(network: string, from: number, to: number) {
  const toSnapshot = await fetchSnapshot(network, to);
  const joinExits = await fetchNumberofJoinExits(network, from, to);
  const users = await fetchNumberofUsers(network, from, to);
  const veLocks = await fetchNumberofVELocks(network, from, to);

  if (from === 0) {
    return {
      totalLiquidity: formatAsDollar(toSnapshot.totalLiquidity),
      totalVolume: formatAsDollar(toSnapshot.totalSwapVolume),
      totalSwapFees: formatAsDollar(toSnapshot.totalSwapFee),
      totalProtocolFees: formatAsDollar(toSnapshot.totalProtocolFee),
      totalSwapCount: toSnapshot.totalSwapCount,
      totalTxs: joinExits + Number(toSnapshot.totalSwapCount),
      totalUsers: users,
      totalVeLocks: veLocks,
    };
  }

  const fromSnapshot = await fetchSnapshot(network, from);

  const periodDuration = to - from;
  const previousFrom = from - periodDuration;
  const previousTo = from;

  // Fetch the snapshots for the previous period
  const previousFromSnapshot = await fetchSnapshot(network, previousFrom);
  const previousToSnapshot = await fetchSnapshot(network, previousTo);

  const snapshot = {
    totalSwapVolume: generateValueWithPercentageHTML(
      toSnapshot.totalSwapVolume,
      fromSnapshot.totalSwapVolume,
      previousToSnapshot.totalSwapVolume,
      previousFromSnapshot.totalSwapVolume,
      true,
      true
    ),
    totalSwapCount: generateValueWithPercentageHTML(
      toSnapshot.totalSwapCount,
      fromSnapshot.totalSwapCount,
      previousToSnapshot.totalSwapCount,
      previousFromSnapshot.totalSwapCount,
      false,
      true
    ),
    totalSwapFee: generateValueWithPercentageHTML(
      toSnapshot.totalSwapFee,
      fromSnapshot.totalSwapFee,
      previousToSnapshot.totalSwapFee,
      previousFromSnapshot.totalSwapFee,
      true,
      true
    ),
    totalProtocolFee: generateValueWithPercentageHTML(
      toSnapshot.totalProtocolFee,
      fromSnapshot.totalProtocolFee,
      previousToSnapshot.totalProtocolFee,
      previousFromSnapshot.totalProtocolFee,
      true,
      true
    ),
    totalLiquidity: generateValueWithPercentageHTML(
      toSnapshot.totalLiquidity,
      fromSnapshot.totalLiquidity,
      0,
      0,
      true,
      true,
      true
    ),
  };

  return {
    totalLiquidity: snapshot.totalLiquidity,
    volume: snapshot.totalSwapVolume,
    swapFees: snapshot.totalSwapFee,
    protocolFees: snapshot.totalProtocolFee,
    swapCount: snapshot.totalSwapCount,
    totalTxs:
      joinExits + (toSnapshot.totalSwapCount - fromSnapshot.totalSwapCount),
    users: users,
    veLocks: veLocks,
  };
}

function formatAsDollar(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function calculatePercentageDifference(
  newValue: number,
  oldValue: number
): string {
  if (oldValue === 0) {
    return "N/A"; // Avoid division by zero
  }

  const difference = ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  return `${difference.toFixed(2)}%`;
}

function generateValueWithPercentageHTML(
  newValue: number,
  oldValue: number,
  previousNewValue: number,
  previousOldValue: number,
  isDollar: boolean = false,
  showPercentage: boolean = false,
  showPlus: boolean = false
): string {
  let formattedValue = isDollar
    ? formatAsDollar(newValue - oldValue)
    : (newValue - oldValue).toString();

  if (newValue - oldValue > 0 && showPlus) {
    formattedValue = `+${formattedValue}`;
  }
  let percentageDifferenceHTML = "";

  if (showPercentage) {
    let percentageDifference = "0";
    if (previousNewValue === 0 && previousOldValue === 0) {
      percentageDifference = calculatePercentageDifference(newValue, oldValue);
    } else {
      percentageDifference = calculatePercentageDifference(
        newValue - oldValue,
        previousNewValue - previousOldValue
      );
    }
    const differenceValue = parseFloat(percentageDifference);
    const color = differenceValue > 0 ? "green" : "red";
    percentageDifferenceHTML = `<span style="color: ${color};"> (${percentageDifference})</span>`;
  }

  return `
    <div>
      <span>${formattedValue}</span>
      ${percentageDifferenceHTML}
    </div>
  `;
}
