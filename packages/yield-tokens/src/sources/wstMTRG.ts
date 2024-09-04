import BigNumber from "bignumber.js";

export const wstMTRG = async () => {
  const request = new Request("https://api.meter.io:8000/api/metrics/all", {
    headers: { "User-Agent": "cf" },
  });
  const response = await fetch(request);
  const json: any = await response.json();
  const stakingAPY = json.staking.stakingAPY;
  const liquidityAPY = BigNumber(stakingAPY)
    .div(365)
    .times(0.9)
    .plus(1)
    .pow(365)
    .minus(1)
    .times(10000)
    .toString();
  const floatAPY = Math.round(parseFloat(liquidityAPY));
  return { "0xe2de616fbd8cb9180b26fcfb1b761a232fe56717": floatAPY };
};
