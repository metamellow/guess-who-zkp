import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { useMemo } from 'react';

import Home from './components/Home';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import GameBoard from './components/GameBoard';
import WalletConnectionButton from './components/WalletConnectionButton';

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
   <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
      <Router>
         <div className="App">
            <WalletConnectionButton />
            <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/create" component={CreateGame} />
            <Route path="/join" component={JoinGame} />
            <Route path="/game/:id" component={GameBoard} />
            </Switch>
         </div>
      </Router>
      </WalletModalProvider>
   </WalletProvider>
);
}

export default App;