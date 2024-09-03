import React, { useState, useEffect } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { getPlayerBalance } from '../utils/aleoUtils';

function PlayerBalance() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        try {
          console.log("Fetching balance...");
          const playerBalance = await getPlayerBalance(publicKey);
          console.log("Fetched balance:", playerBalance);
          setBalance(playerBalance);
          setError(null);
        } catch (error) {
          console.error("Error fetching player balance:", error);
          setError("Failed to fetch balance");
        }
      }
    };

    fetchBalance();
  }, [connected, publicKey]);

  const formatBalance = (balance) => {
    if (balance === null) return 'Loading...';
    const credits = balance / 1_000_000;
    return `${credits.toFixed(6)} Aleo`;
  };

  return (
    <div className="player-balance">
      <h3>Your Balance</h3>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>{formatBalance(balance)}</p>
      )}
      <p>Wallet connected: {connected ? 'Yes' : 'No'}</p>
      <p>Public Key: {publicKey ? publicKey.toString() : 'Not available'}</p>
    </div>
  );
}

export default PlayerBalance;