export async function fetchBitcoinAddressValue(address: string): Promise<number> {
  const response = await fetch('https://blockchain.info/q/addressbalance/' + address);
  const text = await response.text();
  return parseInt(text, 10)
}

export async function fetchBtcPriceInUsd(): Promise<number> {
  const response = await fetch('https://blockchain.info/ticker');
  const json = await response.json();
  const amountUsd = json['USD']['15m'];
  return amountUsd;
}