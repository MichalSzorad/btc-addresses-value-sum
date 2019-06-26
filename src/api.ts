export async function fetchBitcoinAddressValue(address: string): Promise<number> {
  const response = await fetch('https://blockchain.info/q/addressbalance/' + address);
  const text = await response.text();
  return parseInt(text, 10)
}