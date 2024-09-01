import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';

import Home from './components/Home';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import GameBoard from './components/GameBoard';
import ErrorBoundary from './components/ErrorBoundary';

import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';
import './styles/App.css';

function App() {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'Guess Who ZKP Game',
      })
    ],
    []
  );

  return (
    <ErrorBoundary>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={true}
        onError={(error) => {
          console.error('Wallet error:', error);
          // You can add more error handling here if needed
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
}

export default App;