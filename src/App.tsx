import React from 'react';
import './App.css';
import { fetchBitcoinAddressValue, fetchBtcPriceInUsd } from './api';
import { useInterval } from './utils';

const addresses = (window.location.hash.split('#')[1] || '').split(',').filter(Boolean);
const SATOSHI_PER_BTC = 100 * 1000 * 1000;

function sumNumbers(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

function satoshiToBtc(satoshiValue: number): number {
  return satoshiValue / SATOSHI_PER_BTC;
}

function useBitcoinPrice() {
  const [price, setPrice] = React.useState(-1);
  useInterval(() => {
    fetchBtcPriceInUsd().then(price => setPrice(price));
  }, 10 * 1000);

  React.useEffect(() => {
    fetchBtcPriceInUsd().then(price => setPrice(price));
  })

  return [price];
}

function App() {
  const [amounts, setAmounts] = React.useState<({ value: number, time: Date })[]>([]);
  const [result, setResult] = React.useState<number[] | null>(null);
  const [btcPrice] = useBitcoinPrice();
  const owningBtc = satoshiToBtc(sumNumbers(result || []));

  React.useEffect(() => {
    setAmounts([{ value: btcPrice, time: new Date() }, ...amounts])
  }, [btcPrice])

  React.useEffect(() => {
    Promise.all(addresses.map(address => fetchBitcoinAddressValue(address)))
      .then((addressValues) => {
        setResult(addressValues);
      }).catch(e => {
        alert('Could not fetch values for those addresses: ' + addresses.join(', '));
        console.error(e);
      });

  }, []);

  console.log('rerender');
  return (
    <div className="App">
      <header className="App-header">
        <span>YOU HAVE</span>
        <code style={{ fontSize: '2em' }}>
          {result && owningBtc}Ƀ
        </code>
        <br />
        <code>
          {result && owningBtc * btcPrice} USD
        </code>
        <code>
          1Ƀ = {btcPrice} USD
        </code>
        <br />
        <div style={{ textAlign: 'left', fontFamily: 'monospace' }}>
          {result && addresses.map((address, i) => <div key={address}>{address} : {satoshiToBtc(result[i])}Ƀ</div>)}
        </div>
        <br />
        <code>
          {amounts.map((a, i) => <div key={i}>{Math.round(100 * a.value * owningBtc) / 100} @ {a.time.toLocaleTimeString()}</div>)}
        </code>
      </header>
    </div>
  );
}

export default App;
