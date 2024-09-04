import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const subgraphs = {
  telos:
    "https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos/prod/gn",
  meter: "https://graph-meter.voltswap.finance/subgraphs/name/symmetric-meter",
  "gnosis-chain":
    "https://api.thegraph.com/subgraphs/name/centfinance/symmetric-v2-gnosis",
  celo: "https://api.thegraph.com/subgraphs/name/centfinance/symmetric-v2-celo",
};

app.get("/prices/:ids", async (c) => {
  const ids = c.req.param("ids").split(",");
  console.log(ids);
  if (ids.length === 0) return c.json({ data: [] });
  const query = `
    {
      tokens(
        where: {id_in: [${ids
          .map((id) => `"${id}"`)
          .join(",")}], latestUSDPrice_not: null}
      ) {
        id
        latestUSDPrice
      }
    }
  `;
  const response = await fetchGraphQL(query, "meter");
  const data: any = await response.json();
  console.log(data);
  const prices = data.data.tokens.map((token: any) => {
    return {
      id: token.id,
      price: token.latestUSDPrice,
    };
  });
  return c.json(prices);
});

app.get(":network/prices/:ids", async (c) => {
  const network = c.req.param("network");
  if (!subgraphs[network]) return c.json({ error: "Network not supported" });

  const ids = c.req.param("ids").split(",");
  console.log(ids);
  if (ids.length === 0) return c.json({ data: [] });
  const query = `
    {
      tokens(
        where: {id_in: [${ids
          .map((id) => `"${id}"`)
          .join(",")}], latestUSDPrice_not: null}
      ) {
        id
        latestUSDPrice
      }
    }
  `;
  const response = await fetchGraphQL(query, network);
  const data: any = await response.json();
  console.log(data);
  const prices = data.data.tokens.map((token: any) => {
    return {
      id: token.id,
      price: token.latestUSDPrice,
    };
  });
  return c.json(prices);
});

async function fetchGraphQL(query: string, network: string) {
  const response = await fetch(subgraphs[network], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return response;
}

export default app;
