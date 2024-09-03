import React, { useMemo, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  WalletProvider,
  useWallet
} from '@demox-labs/aleo-wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton
} from '@demox-labs/aleo-wallet-adapter-reactui';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { DecryptPermission } from '@demox-labs/aleo-wallet-adapter-base';
import { initializeWasm } from '@aleohq/sdk';

import Home from './components/Home';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import GameBoard from './components/GameBoard';
import ErrorBoundary from './components/ErrorBoundary';

import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';
import './styles/App.css';

function App() {
  const [wasmInitialized, setWasmInitialized] = useState(false);

  useEffect(() => {
    const initWasm = async () => {
      try {
        await initializeWasm();
        setWasmInitialized(true);
        console.log("WebAssembly initialized successfully");
      } catch (error) {
        console.error("Failed to initialize WebAssembly:", error);
      }
    };

    initWasm();
  }, []);

  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'Guess Who ZKP Game',
      })
    ],
    []
  );

  if (!wasmInitialized) {
    return <div>Initializing WebAssembly...</div>;
  }

  return (
    <ErrorBoundary>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={true}
        decryptPermission={DecryptPermission.UponRequest}
      >
        <WalletModalProvider>
          <Router>
            <div className="App">
              <WalletMultiButton />
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