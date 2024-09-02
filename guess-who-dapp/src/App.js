import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { DecryptPermission } from '@demox-labs/aleo-wallet-adapter-base';

import Home from './components/Home';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import GameBoard from './components/GameBoard';
import ErrorBoundary from './components/ErrorBoundary';

import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';
import './styles/App.css';

function App() {
  console.log("App function called");

  const wallets = useMemo(
    () => {
      console.log("Creating wallet adapters");
      return [
        new LeoWalletAdapter({
          appName: 'Guess Who ZKP Game',
        })
      ];
    },
    []
  );

  const appContent = useMemo(() => {
    console.log("Creating app content");
    return (
      <ErrorBoundary>
        <WalletProvider 
          wallets={wallets} 
          autoConnect={true}
          decryptPermission={DecryptPermission.UponRequest}
          onError={(error) => {
            console.error('Wallet error:', error);
          }}
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
  }, [wallets]);

  console.log("App rendered");

  return appContent;
}

export default App;