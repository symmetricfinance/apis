const tokens = [
  '0x1aafc31091d93c3ff003cff5d2d8f7ba2e728425',
  '0x6933ec1ca55c06a894107860c92acdfd2dd8512f'
]

export const overnight = async () => {
  const response = await fetch('https://app.overnight.fi/api/balancer/week/apr')
  const rate = await response.text() as string
  const scaledValue = Math.round(Number(rate) * 10000)

  return tokens.reduce((acc, token) => {
    acc[token] = scaledValue
    return acc
  }, {} as { [key: string]: number })
}
