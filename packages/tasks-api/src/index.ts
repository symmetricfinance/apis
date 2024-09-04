import { Hono } from "hono";
import { cors } from "hono/cors";
import { Decimal } from "decimal.js";
import {
  latestSyncedBlock,
  poolGaugeShares,
  poolShares,
  poolTokenPrice,
} from "./tasks/tvl";
import { galxeSwaps } from "./tasks/galxe-swaps";
import { fetchStats } from "./tasks/stats";

const app = new Hono();

app.use("/*", cors());

type Networks = Record<
  string,
  { rpc: string; poolsSubgraph: string; gaugesSubgraph: string | null }
>;

type Pools = Record<string, string[]>;

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

const pools: Pools = {
  telos: [
    "0x058d4893efa235d86cceed5a7eef0809b76c8c66000000000000000000000004",
    "0x9a77bd2edbbb68173275cda967b76e9213949ace000000000000000000000008",
    "0x2d714951f7165a51e8bd61f92d8a979ab0ed4b59000200000000000000000006",
    "0x0ca5d4b7aeeca61aff78c8f734596ec88456d5c300010000000000000000000a",
    "0x5e99843486cf052baf0925a0cdeb40920477295900000000000000000000000b",
    // '0xd757973e91a8045808e8cd37cc2b7df128e7ca2c00000000000000000000000d',
    "0x2b014535525aad053b8811c22a337e57caae82df00020000000000000000000f", //WTLOS-USDC
    "0xbb8a33dbbf10882d3d8d9180c56ff13ad6fd917d000200000000000000000011", //TSYMM-TSOUL
    "0x09ef3684052c0566caa6fc61008922030ff455b1000200000000000000000010", //TKIND-TSOUL
    "0x0e4907910a6bd1a5e95500f7149dd57d328f65cb000200000000000000000012", //BTCb-STLOS
    "0x0485ecd8aa4e0624dd0f5da84139409ab7cee03c000200000000000000000013", //ETH-STLOS
    "0x304970d2511aa3b121148afd387cfa623f551410000200000000000000000016", //MST-USDM
    "0x5fc5f565d6e186a7e03b9ee58bdd551ebff0c0bd000200000000000000000014", //Trump-WTLOS,
    "0x6587a54645c39bc47c96e6f12052db347cc1003a000200000000000000000015", //CMDR-WTLOS
    "0xcf29825dfe41e62e218baa10b791a3d087fa7a83000200000000000000000018", //SOULS-TSYMM
    "0xcacc06ea569e239d0e4b718e4da1b456d49e06f6000200000000000000000019", //KINDs-SOULS
    "0x03b038d9ad0a69339c9af310ac0f205e2670f9b200020000000000000000001b", //STLOS-wUSK
    "0x412b37b8074e25683fdd4f5b2ac0218647dcc50e00000000000000000000001a", //wUSK-USDC
    "0x30f0797bbe89172b669467039d49d413eb09244b00020000000000000000001c", // SOULS-WTLOS
    "0xfa5f3ba362577e35875e91eb3b16fbe7108f448600020000000000000000001d", // SOULS-SUSD
    "0xceb2728bf37332291fa44891414a53b1d668578200020000000000000000001e", // ALI-SOULS
  ],
  meter: [
    "0xd9fe77653c2b75cf3442c365a3f1f9c7ed1612c7000200000000000000000003", //MTRG/USDT-USDC-suUSD
    "0xc4187382305ea2c953f0a164f02b4d27c9957db5000200000000000000000005", //MST-MTRG
    "0x6e1be32644975613212db00bb9762fb6755ab921000200000000000000000007", //ETH-wstMTRG
    "0x1ff97abe4c5a4b7ff90949b637e71626bef0dcee000000000000000000000002", //USDT-USDC-suUSD
    "0x2077a828fd58025655335a8756dbcfeb7e5bec46000000000000000000000008", //mtrg-wstMTRG
    "0xbfd3c6457069bf173714f344447be468a83e7bd500020000000000000000000b", //MST-wstMTRG
  ],
  "artela-testnet": [],
};

const symmPools: SymmPools = {
  telos: "0xbf0fa44e5611c31429188b7dcc59ffe794d1980e000200000000000000000009",
  meter: "0xabbcd1249510a6afb5d1e6d055bf86637e7dad63000200000000000000000009",
  "artela-testnet":
    "0x1ff97abe4c5a4b7ff90949b637e71626bef0dcee000000000000000000000002",
};

function camelCaseToReadable(text: string): string {
  return text
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
}

function capitalizeFirstLetter(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function statsHTML(network: string, stats: any): string {
  // Generate HTML table
  let html = `
   <html>
     <head>
       <title>Stats</title>
       <style>
         body {
           font-family: Arial, sans-serif;
           margin: 0;
           padding: 20px;
           background-color: #f4f4f9;
           color: #333;
         }
         .container {
           max-width: 800px;
           margin: 0 auto;
           background: #fff;
           padding: 20px;
           box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
           border-radius: 8px;
         }
         .item {
           display: flex;
           justify-content: space-between;
           padding: 10px;
           border-bottom: 1px solid #ddd;
         }
         .item:last-child {
           border-bottom: none;
         }
         .key {
           font-weight: bold;
           color: #333;
         }
         .value {
           color: #666;
         }
         h1 {
           text-align: center;
           color: #333;
         }
         .dark-mode {
           background-color: #121212;
           color: #e0e0e0;
         }
         .dark-mode .container {
           background: #1e1e1e;
         }
         .dark-mode .key {
           color: #e0e0e0;
         }
         .dark-mode .value {
           color: #ffffff;
         }
         .dark-mode h1 {
           color: #fff;
         }
         .dark-mode .item {
           border-bottom: 1px solid #444;
         }
         .toggle-button {
           position: fixed;
           top: 20px;
           right: 20px;
           padding: 10px;
           background-color: transparent;
           border-radius: 5px;
           cursor: pointer;
           font-size: 24px;
         }
       </style>
     </head>
<body>
 <button class="toggle-button" onclick="toggleDarkMode()">
   <span id="toggle-icon">🌙</span>
 </button>
 <div class="container">
   <h1>Stats for ${capitalizeFirstLetter(network)}</h1>
 `;

  for (const [key, value] of Object.entries(stats)) {
    html += `
   <div class="item">
     <div class="key">${camelCaseToReadable(key)}</div>
     <div class="value">${value}</div>
   </div>
 `;
  }

  html += `
   </div>
   <script>
     function toggleDarkMode() {
       const body = document.body;
       const icon = document.getElementById('toggle-icon');
       body.classList.toggle('dark-mode');
       if (body.classList.contains('dark-mode')) {
         icon.textContent = '☀️';
         icon.alt = 'Toggle Light Mode';
       } else {
         icon.textContent = '🌙';
         icon.alt = 'Toggle Dark Mode';
       }
     }
   </script>
 </body>
</html>
`;
  return html;
}

app.get("/stats/:network", async (c) => {
  const { network } = c.req.param();
  const toTimestamp = Math.floor(Date.now() / 1000);
  const fromTimestamp = toTimestamp - 2592000; // 1 month ago;
  const stats = await fetchStats(network, fromTimestamp, toTimestamp);
  const html = statsHTML(network, stats);
  return c.html(html);
});

app.get("/stats/:network/total", async (c) => {
  const { network } = c.req.param();
  const toTimestamp = Math.floor(Date.now() / 1000);
  const stats = await fetchStats(network, 0, toTimestamp);
  const html = statsHTML(network, stats);
  return c.html(html);
});

app.get("/stats/:network/:from/:to", async (c) => {
  const { network, from, to } = c.req.param();
  const stats = await fetchStats(network, Number(from), Number(to));
  const html = statsHTML(network, stats);

  return c.html(html);
});

app.get("/galxe/telos/swaps/:wallet", async (c) => {
  const { wallet } = c.req.param();
  const swaps = await galxeSwaps(wallet.toLowerCase());
  return c.json(swaps);
});

app.get("/tvl/:network/:wallet", async (c) => {
  const { network, wallet } = c.req.param();
  const { gaugesSubgraph } = networks[network];
  const w = wallet.toString().toLowerCase();

  if (!networks[network]) {
    return c.text("Invalid network");
  }

  if (!w || w.length !== 42) {
    return c.text("Invalid wallet");
  }

  const prices = await poolTokenPricesQuery(network);

  const poolLiquidty = await poolSharesQuery(network, w);
  let totalPoolLiquidityUSD = new Decimal(0);

  poolLiquidty.forEach((p) => {
    const price =
      prices.find((t) => t.pool === p.pool)?.price || new Decimal(0);
    totalPoolLiquidityUSD = totalPoolLiquidityUSD.add(p.balance).mul(price);
  });

  let totalGaugeLiquidityUSD = new Decimal(0);

  if (gaugesSubgraph) {
    const staked = await gaugeSharesQuery(network, w);
    staked.forEach((p) => {
      const price =
        prices.find((t) => t.pool === p.pool)?.price || new Decimal(0);
      const usdAmount = p.balance.mul(price);
      totalGaugeLiquidityUSD = totalGaugeLiquidityUSD.add(usdAmount);
    });
  }

  const totalLiquidityUSD = totalPoolLiquidityUSD.add(totalGaugeLiquidityUSD);

  return c.text(totalLiquidityUSD.toString());
});

app.get("/user-tvl/:network/:block/:pool", async (c) => {
  const { network, block, pool } = c.req.param();
  const latestBlock = await latestSyncedBlock(network);
  const b = Number(block) > latestBlock ? latestBlock : Number(block);
  const price = await poolTokenPrice(pool.toLowerCase(), b, network);
  const poolBalances = await poolShares(pool.toLowerCase(), b, network);
  const gaugeBalances = await poolGaugeShares(pool.toLowerCase(), b, network);

  let mergedBalances: Record<string, Decimal> = {};

  // Merge poolBalances into mergedBalances
  for (let key in poolBalances) {
    mergedBalances[key] = new Decimal(poolBalances[key]);
  }

  // Merge gaugeTVL into mergedTVL, adding values for duplicate keys
  for (let key in gaugeBalances) {
    if (mergedBalances[key]) {
      mergedBalances[key] = mergedBalances[key].plus(gaugeBalances[key]);
    } else {
      mergedBalances[key] = new Decimal(gaugeBalances[key]);
    }
  }
  const userTVLS: Record<string, string> = {};
  Object.keys(mergedBalances).forEach((key) => {
    userTVLS[key] = mergedBalances[key].mul(price).toString();
  });

  return c.json(userTVLS);
});

app.get("/tvl/:network/:wallet/:amount", async (c) => {
  const { network, wallet, amount } = c.req.param();
  const walletTVL = await fetchTVL(network, wallet);
  const walletTVLDecimal = new Decimal(walletTVL);
  const amountDecimal = new Decimal(amount);
  return c.text(
    walletTVLDecimal.greaterThanOrEqualTo(amountDecimal) ? "true" : "false"
  );
});

app.get("/swaps/:network/:wallet/:amount", async (c) => {
  const { network, wallet, amount } = c.req.param();
  const hasSwappedValue = await swapsValueQuery(network, wallet, amount);
  return c.text(hasSwappedValue ? "true" : "false");
});

async function fetchTVL(network: string, wallet: string) {
  const { gaugesSubgraph } = networks[network];
  const prices = await poolTokenPricesQuery(network);

  const poolLiquidty = await poolSharesQuery(network, wallet);
  let totalPoolLiquidityUSD = new Decimal(0);

  poolLiquidty.forEach((p) => {
    const price =
      prices.find((t) => t.pool === p.pool)?.price || new Decimal(0);
    totalPoolLiquidityUSD = totalPoolLiquidityUSD.add(p.balance).mul(price);
  });

  let totalGaugeLiquidityUSD = new Decimal(0);

  if (gaugesSubgraph) {
    const staked = await gaugeSharesQuery(network, wallet);
    staked.forEach((p) => {
      const price =
        prices.find((t) => t.pool === p.pool)?.price || new Decimal(0);
      const usdAmount = p.balance.mul(price);
      totalGaugeLiquidityUSD = totalGaugeLiquidityUSD.add(usdAmount);
    });
  }

  const totalLiquidityUSD = totalPoolLiquidityUSD.add(totalGaugeLiquidityUSD);

  return totalLiquidityUSD.toString();
}

async function poolTokenPricesQuery(
  network: string
): Promise<{ pool: string; price: Decimal }[]> {
  const poolsWithSYMMPool = pools[network].concat(symmPools[network]);
  const query = `{
    tokens (where: {
      address_in: [${poolsWithSYMMPool
        .map((p) => `"${p.substring(0, 42)}"`)
        .join(", ")}]    
  }) {
    address
    latestUSDPrice
  }
}`;

  const response: any = await fetchGraphQL(
    query,
    networks[network].poolsSubgraph as string
  );

  const tokens = response.data.tokens;
  return tokens.map((t: any) => ({
    pool: t.address,
    price: t.latestUSDPrice ? new Decimal(t.latestUSDPrice) : new Decimal(0),
  }));
}

async function poolSharesQuery(
  network: string,
  wallet: string
): Promise<{ pool: string; balance: Decimal }[]> {
  const poolsWithSYMMPool = pools[network].concat(
    symmPools[network].substring(0, 42)
  );
  const query = `{
  user (id: "${wallet.toLowerCase()}") {
    sharesOwned (where: {
      balance_gt: 0,
      poolId_: {
        address_in: [${poolsWithSYMMPool
          .map((p) => `"${p.substring(0, 42)}"`)
          .join(", ")}]
      }
    }) {
      poolId {
        address
      }
      balance
    }
  }
}`;

  const response: any = await fetchGraphQL(
    query,
    networks[network].poolsSubgraph as string
  );

  const shares = response.data.user?.sharesOwned || [];
  return shares.map((s: any) => ({
    pool: s.poolId.address,
    balance: new Decimal(s.balance),
  }));
}

async function gaugeSharesQuery(
  network: string,
  wallet: string
): Promise<{ pool: string; balance: Decimal }[]> {
  const query = `{
  user (id: "${wallet.toLowerCase()}") {
    votingLocks {
      lockedBalance
    }
    gaugeShares (where: {
      balance_gt: 0
      gauge_: {
        poolAddress_in: [${pools[network]
          .map((p) => `"${p.substring(0, 42)}"`)
          .join(", ")}]
      }
    }) {
      gauge {
        poolAddress
      }
      balance
    }
  }
}`;
  const response: any = await fetchGraphQL(
    query,
    networks[network].gaugesSubgraph as string
  );
  const shares = response.data.user?.gaugeShares || [];
  const s = shares.map((s: any) => ({
    pool: s.gauge.poolAddress,
    balance: new Decimal(s.balance),
  }));
  const symmShares = {
    pool: symmPools[network].substring(0, 42),
    balance: response.data.user?.votingLocks[0]
      ? new Decimal(response.data.user?.votingLocks[0].lockedBalance)
      : new Decimal(0),
  };
  return s.concat(symmShares);
}

async function swapsValueQuery(
  network: string,
  wallet: string,
  amount: string
): Promise<boolean> {
  const query = `{
  user (id: "${wallet.toLowerCase()}") {
    swaps (where: {
      valueUSD_gte: ${amount},
    }) {
      id
    }
  }
}`;

  const response: any = await fetchGraphQL(
    query,
    networks[network].poolsSubgraph as string
  );

  const swaps = response.data.user?.swaps || [];
  return swaps.length > 0;
}

async function fetchGraphQL(query: string, subgraph: string) {
  const response = await fetch(subgraph, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return await response.json();
}

export default app;
