import telos from "./telos";
import meter from "./meter";
import { defineChain } from "viem";

export enum Chains {
  Telos = "telos",
  Meter = "meter",
}

export enum ChainId {
  telos = 40,
  meter = 82,
}

export const config: Record<Chains, { chain: ReturnType<typeof defineChain> }> =
  {
    [Chains.Telos]: telos,
    [Chains.Meter]: meter,
  };
