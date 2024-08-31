import React, { useState, useEffect } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { getPlayerBalance } from '../utils/aleoUtils';

function PlayerBalance() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    let isMounted = true;
    const fetchBalance = async () => {
      if (connected && publicKey) {
        try {
          const playerBalance = await getPlayerBalance(publicKey);
          if (isMounted) {
            setBalance(playerBalance);
            setError(null);
          }
        } catch (error) {
          console.error("Error fetching player balance:", error);
          if (isMounted) {
            setError("Failed to fetch balance. Please ensure your wallet is connected and try again.");
          }
        }
      } else {
        setBalance(null);
        setError(null);
      }
    };

    fetchBalance();

    return () => {
      isMounted = false;
    };
  }, [publicKey, connected]);

  if (!connected) return <div>Please connect your wallet to view balance.</div>;

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="player-balance">
      <h3>Your Balance</h3>
      <p>{balance !== null ? `${balance / 1_000_000} Aleo` : 'Loading...'}</p>
    </div>
  );
}

export default PlayerBalance;