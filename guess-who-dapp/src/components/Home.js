import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import PlayerBalance from './PlayerBalance';

function Home() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="home">
      <h1>Welcome to Guess Who ZKP</h1>
      {connected && publicKey ? (
        <div>
          <Link to="/create">
            <button>Create Game</button>
          </Link>
          <Link to="/join">
            <button>Join Game</button>
          </Link>
          <PlayerBalance />
        </div>
      ) : (
        <p>Please connect your wallet to play.</p>
      )}
    </div>
  );
}

export default Home;