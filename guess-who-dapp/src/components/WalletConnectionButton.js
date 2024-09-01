import React from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';

function WalletConnectionButton() {
const { publicKey } = useWallet();

return (
   <div className="wallet-connection">
      <WalletMultiButton />
      {publicKey && <p>Connected: {publicKey.toString()}</p>}
   </div>
);
}

export default WalletConnectionButton;