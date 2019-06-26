import React from 'react';
import './App.css';
import { fetchBitcoinAddressValue } from './api';

const addresses = (window.location.hash.split('#')[1] || '').split(',').filter(Boolean);
const SATOSHI_PER_BTC = 100 * 1000 * 1000;

function sumNumbers(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

function satoshiToBtc(satoshiValue: number): number {
  return satoshiValue / SATOSHI_PER_BTC;
}

function App() {
  const [result, setResult] = React.useState<number[] | null>(null);

  React.useEffect(() => {
    Promise.all(addresses.map(address => fetchBitcoinAddressValue(address)))
      .then((addressValues) => {
        setResult(addressValues);
      }).catch(e => {
        alert('Could not fetch values for those addresses: ' + addresses.join(', '));
        console.error(e);
      })
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <span>YOU HAVE</span>
        <code style={{ fontSize: '2em' }}>
          {result && satoshiToBtc(sumNumbers(result))}Ƀ
        </code>
        <br />
        <div style={{ textAlign: 'left', fontFamily: 'monospace' }}>
          {result && addresses.map((address, i) => <div key={address}>{address} : {satoshiToBtc(result[i])}Ƀ</div>)}
        </div>
      </header>
    </div>
  );
}

export default App;
