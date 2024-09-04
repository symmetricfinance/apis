export const tetu = async () => {
  const response = await fetch('https://api.tetu.io/api/v1/reader/compoundAPRs?network=MATIC')
  const json = await response.json() as { vault: string, apr: number }[]
  const aprs = json.map((t) => [t.vault, Math.round(t.apr * 100)])

  return Object.fromEntries(aprs)
}
