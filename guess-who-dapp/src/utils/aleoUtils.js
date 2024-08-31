import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';

const NETWORK = WalletAdapterNetwork.Testnet;
const PROGRAM_NAME = process.env.REACT_APP_PROGRAM_NAME;
const NETWORK_URL = process.env.REACT_APP_NETWORK_URL;

let wallet = null;

export const initializeWallet = async () => {
wallet = new LeoWalletAdapter({ appName: 'Guess Who ZKP' });
await wallet.connect();
};

export const createGame = async (character) => {
if (!wallet) await initializeWallet();

const inputs = [
   wallet.publicKey,
   JSON.stringify(character)
];

const fee = process.env.REACT_APP_GAME_COST; // From .env file

const transaction = await wallet.requestTransaction({
   program: PROGRAM_NAME,
   function: 'create_game',
   inputs,
   fee
});

return transaction;
};

export const joinGame = async (gameId, character) => {
if (!wallet) await initializeWallet();

const inputs = [
   gameId,
   wallet.publicKey,
   JSON.stringify(character)
];

const fee = process.env.REACT_APP_GAME_COST; // From .env file

const transaction = await wallet.requestTransaction({
   program: PROGRAM_NAME,
   function: 'join_game',
   inputs,
   fee
});

return transaction;
};

export const askQuestion = async (gameId, questionType, questionValue) => {
if (!wallet) await initializeWallet();

const inputs = [
   gameId,
   wallet.publicKey,
   questionType,
   questionValue
];

const fee = 0.0001; // 0.0001 Aleo

const transaction = await wallet.requestTransaction({
   program: PROGRAM_NAME,
   function: 'ask_question',
   inputs,
   fee
});

return transaction;
};

export const claimReward = async (gameId) => {
if (!wallet) await initializeWallet();

const inputs = [
   gameId,
   wallet.publicKey
];

const fee = 0.0001; // 0.0001 Aleo

const transaction = await wallet.requestTransaction({
   program: PROGRAM_NAME,
   function: 'claim_reward',
   inputs,
   fee
});

return transaction;
};

export const endGame = async (gameId) => {
if (!wallet) await initializeWallet();

const inputs = [gameId];

const fee = 0.0001; // 0.0001 Aleo

const transaction = await wallet.requestTransaction({
   program: PROGRAM_NAME,
   function: 'end_game',
   inputs,
   fee
});

return transaction;
};

export const getGameState = async (gameId) => {
if (!wallet) await initializeWallet();

const result = await wallet.requestRecords({
   program: PROGRAM_NAME,
   filter: {
      key: 'games',
      value: gameId
   }
});

return result[0];
};

export const getPlayerBalance = async (address) => {
if (!wallet) await initializeWallet();

const result = await wallet.requestRecords({
   program: PROGRAM_NAME,
   filter: {
      key: 'player_balances',
      value: address
   }
});

return result[0];
};