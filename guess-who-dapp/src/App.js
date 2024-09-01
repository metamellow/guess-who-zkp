// App.js
import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WalletProvider, useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { DecryptPermission, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

import Home from './components/Home';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import GameBoard from './components/GameBoard';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorMessage from './components/ErrorMessage';

import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';
import './styles/App.css';

const WalletConnectionStatus = () => {
  const { wallet, connecting, connected, error } = useWallet();

  if (error) {
    let errorMessage = "Failed to connect to wallet. Please try again.";
    if (error.message.includes("Some of the parameters you provided are invalid")) {
      errorMessage = "Leo wallet is locked. Please unlock your wallet and try again.";
    }
    return <ErrorMessage message={errorMessage} />;
  }

  if (!wallet) {
    return <ErrorMessage message="No wallet found. Please install Leo wallet and refresh the page." />;
  }

  if (connecting) {
    return <div>Connecting to wallet...</div>;
  }

  if (!connected) {
    return <ErrorMessage message="Wallet is not connected. Please connect your wallet to continue." />;
  }

  return null;
};

function App() {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'Guess Who ZKP Game',
      }),
    ],
    []
  );

  return (
    <ErrorBoundary>
      <WalletProvider
        wallets={wallets}
        autoConnect={true}
        decryptPermission={DecryptPermission.UponRequest}
        network={WalletAdapterNetwork.Testnet}
      >
        <WalletModalProvider>
          <Router>
            <div className="App">
              <WalletMultiButton />
              <WalletConnectionStatus />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateGame />} />
                <Route path="/join" element={<JoinGame />} />
                <Route path="/game/:id" element={<GameBoard />} />
              </Routes>
            </div>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ErrorBoundary>
  );
}

export default App;