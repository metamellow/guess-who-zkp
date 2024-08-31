import React, { useState, useEffect } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { getPlayerBalance } from '../utils/aleoUtils';

function PlayerBalance() {
const [balance, setBalance] = useState(null);
const { publicKey } = useWallet();

useEffect(() => {
   if (publicKey) {
      fetchBalance();
   }
}, [publicKey]);

const fetchBalance = async () => {
   try {
      const playerBalance = await getPlayerBalance(publicKey);
      setBalance(playerBalance);
   } catch (error) {
      console.error("Error fetching player balance:", error);
   }
};

if (!publicKey) return null;

return (
   <div className="player-balance">
      <h3>Your Balance</h3>
      <p>{balance !== null ? `${balance / 1_000_000} Aleo` : 'Loading...'}</p>
   </div>
);
}

export default PlayerBalance;
