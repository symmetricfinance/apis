import { defineChain } from "viem";

export const meter = defineChain({
  id: 82,
  name: "Meter",
  nativeCurrency: {
    decimals: 18,
    name: "Meter stable",
    symbol: "MTR",
  },
  rpcUrls: {
    default: {
      http: [
        "https://meter.blockpi.network/v1/rpc/216bb10a3653b0a8131afee4f6cf1982945022b4",
      ],
    },
  },
  blockExplorers: {
    default: { name: "Meter Explorer", url: "https://explorer.meter.io/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 41238476,
    },
  },
});

export default {
  chain: meter,
};
