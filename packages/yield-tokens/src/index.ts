// import { euler } from './sources/euler';
import { defaultFetch } from "./sources/default";
import { meridian } from "./sources/meridian";
import { wstMTRG } from "./sources/wstMTRG";
export interface Env {
  YIELD_TOKENS: KVNamespace;
}

const tokens = [
  {
    name: "STLOS",
    fetchFn: () =>
      defaultFetch({
        tokens: ["0xb4b01216a5bc8f1c8a33cd990a1239030e60c905"],
        url: "https://api.telos.net/v1/apy/evm",
        path: "",
        scale: 100,
      }),
  },
  {
    name: "wstMTRG",
    fetchFn: wstMTRG,
  },
  { name: "meridian", fetchFn: meridian },

  // { name: 'euler',     fetchFn: euler },
];

const names = tokens.map((t) => t.name);

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Check if the request has a path
    const url = new URL(request.url);
    const path = url.pathname.slice(1);

    if (path && names.includes(path)) {
      console.log(path);
      const token = tokens.find((t) => t.name === path);
      if (token) {
        const aprs = await token.fetchFn();
        if (aprs) {
          ctx.waitUntil(storeAprs(env.YIELD_TOKENS, aprs));
          return new Response(JSON.stringify(aprs), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*", // Allow CORS
            },
          });
        }
      }
      // } else if (path == 'all') {
      //   const json = await fetchAndStoreAll(env.YIELD_TOKENS)
      //   return new Response(JSON.stringify(json), {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Cache-Control': `s-maxage=600`, // Cache for 10 minutes
      //       'Access-Control-Allow-Origin': '*', // Allow CORS
      //     },
      //   })
      // }
      return new Response("Not found", {
        status: 404,
      });
    }

    const json = await env.YIELD_TOKENS.get("all", "text");
    console.log(json);
    return new Response(json, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `s-maxage=600`, // Cache for 10 minutes
        "Access-Control-Allow-Origin": "*", // Allow CORS
      },
    });
  },

  // Scheduled events are run every 10 minutes
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(fetchAndStoreAll(env.YIELD_TOKENS));
  },
};

// Fetch APRs for all tokens and store them in KV
const fetchAndStoreAll = async (store: KVNamespace) => {
  const responses = await Promise.all(tokens.map(({ fetchFn }) => fetchFn()));
  const aprs = responses.reduce((acc, val) => ({ ...acc, ...val }), {});
  if (Object.keys(aprs).length > 0) {
    await storeAprs(store, aprs);
  }
  return aprs;
};

// Fetch APRs for a single token and store them in KV
const fetchAndStore = async (store: KVNamespace) => {
  const next = Number(await store.get("next"));
  const token = tokens[next];
  const aprs = await token.fetchFn();
  if (aprs) {
    await storeAprs(store, aprs);
  }
  return await store.put("next", String((next + 1) % tokens.length));
};

// Store APRs in KV only if they have changed, to avoid unnecessary writes
// KV is limited to 1k writes per day
const storeAprs = async (
  store: KVNamespace,
  aprs: { [key: string]: number }
) => {
  let all = (await store.get("all", "json")) as { [key: string]: number };

  if (!all) {
    all = {};
  }

  let changes = false;
  Object.keys(aprs).forEach((key) => {
    if (all[key] !== aprs[key]) changes = true;
    all[key] = aprs[key];
  });

  if (changes) {
    await store.put("all", JSON.stringify(all));
  }
};
