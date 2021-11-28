import { useMemo } from "react";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

import "./App.css";
import { WalletNfts } from "./components/WalletNfts";

import { SolRayz } from "./components";
import { SolRayzReact } from "./components";

const network = WalletAdapterNetwork.Mainnet;

function App() {
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <div className="App">
        <header className="App-header">
          <div>Test Package:</div>
        </header>
        {/* <WalletNfts /> */}
        <SolRayz />
        {/* <SolRayzReact /> */}
      </div>
    </ConnectionProvider>
  );
}

export default App;
