export const meridian = async () => {
  const request = new Request(
    "https://omnidex.bmaa3ajd1gjri.eu-west-2.cs.amazonlightsail.com/lending_yields",
    {
      headers: { "User-Agent": "cf" },
    }
  );
  const response = await fetch(request);
  const json: any = await response.json();
  const telosAPY = json.telos;

  return {
    "0x953808ef6be397925f71ec0e8892e246882e4804": Math.floor(
      telosAPY["USDC"].apy_base * 100
    ),
    "0x181f14262e2efd4df781079437eba1aed3343898": Math.floor(
      telosAPY["USDT"].apy_base * 100
    ),
    "0x8edc3bdd08980d5f6672f243cebc58c6c117956a": Math.floor(
      telosAPY["USDM"].apy_base * 100
    ),
  };
};
