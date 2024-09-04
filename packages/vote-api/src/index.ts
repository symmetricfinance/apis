import { z } from "zod";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { config } from "./config/chains";
import { createPublicClient, http, getContract, parseAbi } from "viem";
import { mainnet } from "viem/chains";

const app = new Hono();

app.use("/*", cors());

const bodySchema = z.object({
  addresses: z.array(z.string()),
  snapshot: z.number(),
});

function notValid(result: any, c: any) {
  if (!result.success) {
    return c.text("Invalid!", 400);
  }
}

const delegatedVotes: { [key: string]: { [key: string]: string } } = {
  telos: {
    "0x598cb1316Ca33Adb7C75EC889778EF13D9A3B807":
      "0xBd8911e8477a7279f085F473f46A6b9AB54385E7",
  },
  meter: {},
};

app.post("/:network", zValidator("json", bodySchema, notValid), async (c) => {
  const network = c.req.param("network");
  if (!network || (network !== "telos" && network !== "meter")) {
    return c.text("Invalid network!", 400);
  }
  const data = c.req.valid("json");
  const { addresses, snapshot } = data;

  const publicClient = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: config[network].chain,
    transport: http(),
  });

  const ethPublicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const block = await ethPublicClient.getBlock({
    blockNumber: BigInt(snapshot),
  });

  const votingEscrowAddresses: Record<string, `0x${string}`> = {
    telos: "0x0D0b7efc6e20b96841f37b28219a595a81c4615A",
    meter: "0xdAe34CFC2a0eF52aC8417eeFc2A1C5CEaC50bfe7",
  };

  const votingEscrow = getContract({
    address: votingEscrowAddresses[network],
    abi: parseAbi([
      "function balanceOf(address addr, uint256 _t) view returns (uint256)",
    ]),
    client: {
      public: publicClient,
    },
  });

  const scores = [];
  for (const address of addresses) {
    const delegatedAddress = delegatedVotes[network][address] || address;
    console.log(block.timestamp);
    const balance = await votingEscrow.read.balanceOf([
      delegatedAddress as `0x${string}`,
      block.timestamp,
    ]);

    scores.push({
      score: balance.toString(),
      address: address,
    });
  }

  return c.json({ score: scores });
});

export default app;
