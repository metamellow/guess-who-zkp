import React, { useState, useEffect } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { getPlayerBalance } from '../utils/aleoUtils';

function PlayerBalance() {
  console.log("PlayerBalance component rendered");

  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const { wallet, publicKey, connected } = useWallet();

  useEffect(() => {
    console.log("PlayerBalance useEffect triggered");
    console.log("Wallet status:", { connected, publicKey: publicKey?.toString() });

    const fetchBalance = async () => {
      if (wallet && connected) {
        try {
          console.log("Fetching balance...");
          const playerBalance = await getPlayerBalance(wallet);
          console.log("Fetched balance:", playerBalance);
          setBalance(playerBalance);
          setError(null);
        } catch (error) {
          console.error("Error fetching player balance:", error);
          setError("Failed to fetch balance");
        }
      } else {
        console.log("Wallet not connected or not available");
      }
    };

    fetchBalance();
  }, [wallet, connected, publicKey]);

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