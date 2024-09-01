import React, { useState, useEffect } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletNotSelectedError } from '@demox-labs/aleo-wallet-adapter-base';
import ErrorMessage from './ErrorMessage';

function WalletConnectionButton() {
  const { publicKey, wallet, connected, connecting, connect, disconnect } = useWallet();
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (wallet && !connected && !connecting) {
        try {
          setError(null);
          await connect();
        } catch (err) {
          console.error("Wallet connection error:", err);
          if (err instanceof WalletNotSelectedError) {
            setError("Please select a wallet to connect.");
          } else {
            setError("Please unlock your Leo wallet and try again.");
          }
        }
      }
    };

    checkWalletStatus();
  }, [wallet, connected, connecting, connect]);

  const handleConnect = async () => {
    try {
      setError(null);
      await connect();
    } catch (err) {
      console.error("Wallet connection error:", err);
      if (err instanceof WalletNotSelectedError) {
        setError("Please select a wallet to connect.");
      } else {
        setError("Failed to connect. Please ensure your Leo wallet is unlocked and try again.");
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error("Wallet disconnection error:", err);
      setError("Failed to disconnect. Please try again.");
    }
  };

  return (
    <div className="wallet-connection">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      {connecting ? (
        <p>Connecting...</p>
      ) : connected && publicKey ? (
        <div>
          <p>Connected: {publicKey.toString()}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
}

export default WalletConnectionButton;