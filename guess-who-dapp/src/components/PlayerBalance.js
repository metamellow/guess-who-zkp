// PlayerBalance.js
import React, { useState, useEffect } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { useAleoWallet } from '../utils/aleoUtils';

function PlayerBalance() {
  const [balance, setBalance] = useState(null);
  const { publicKey } = useWallet();
  const { getPlayerBalance } = useAleoWallet();

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const playerBalance = await getPlayerBalance();
          setBalance(playerBalance);
        } catch (error) {
          console.error("Error fetching player balance:", error);
          setBalance("Error");
        }
      }
    };

    fetchBalance();
  }, [publicKey, getPlayerBalance]);

  if (!publicKey) return null;

  return (
    <div className="player-balance">
      <h3>Your Balance</h3>
      <p>{balance !== null ? `${balance} Aleo` : 'Loading...'}</p>
    </div>
  );
}

export default PlayerBalance;