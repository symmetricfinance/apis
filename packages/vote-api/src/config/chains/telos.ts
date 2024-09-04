import { defineChain } from "viem";

export const telos = defineChain({
  id: 40,
  name: "Telos",
  nativeCurrency: {
    decimals: 18,
    name: "Telos",
    symbol: "TLOS",
  },
  rpcUrls: {
    default: {
      http: [`https://mainnet15.telos.net/evm`],
    },
  },
  blockExplorers: {
    default: { name: "Telos Scan", url: "https://teloscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 246530709,
    },
    feeDistributor: {
      address: "0x75d71288F0181a5c1C9f8c81755846954C37433A",
      blockCreated: 313457093,
    },
  },
});

export default {
  chain: telos,
};
