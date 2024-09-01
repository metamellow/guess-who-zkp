import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';

const NETWORK = WalletAdapterNetwork.Testnet;
const PROGRAM_NAME = process.env.REACT_APP_PROGRAM_NAME;

export const getPlayerBalance = async (wallet) => {
  if (!wallet || !wallet.adapter) {
    console.error("Wallet or adapter not available");
    return null;
  }
  
  try {
    if (typeof wallet.adapter.requestRecords === 'function') {
      const records = await wallet.adapter.requestRecords('credits.aleo');
      
      let balance = 0;
      if (Array.isArray(records)) {
        balance = records.reduce((total, record) => {
          if (record && record.data && record.data.microcredits) {
            return total + Number(record.data.microcredits);
          }
          return total;
        }, 0);
      }
      return balance;
    } else {
      console.error("requestRecords method not available");
      return null;
    }
  } catch (error) {
    console.error("Error fetching player balance:", error);
    return null;
  }
};

export const createGame = async (wallet, character) => {
  if (!wallet) {
    console.error("Wallet not available");
    return null;
  }
  
  const inputs = [
    wallet.publicKey,
    JSON.stringify(character)
  ];

  const fee = process.env.REACT_APP_GAME_COST; // From .env file

  try {
    const transaction = await wallet.requestTransaction({
      program: PROGRAM_NAME,
      function: 'create_game',
      inputs,
      fee
    });

    return transaction;
  } catch (error) {
    console.error("Error creating game:", error);
    return null;
  }
};

export const joinGame = async (wallet, gameId, character) => {
  if (!wallet) {
    console.error("Wallet not available");
    return null;
  }
  
  const inputs = [
    gameId,
    wallet.publicKey,
    JSON.stringify(character)
  ];

  const fee = process.env.REACT_APP_GAME_COST; // From .env file

  try {
    const transaction = await wallet.requestTransaction({
      program: PROGRAM_NAME,
      function: 'join_game',
      inputs,
      fee
    });

    return transaction;
  } catch (error) {
    console.error("Error joining game:", error);
    return null;
  }
};

export const askQuestion = async (wallet, gameId, questionType, questionValue) => {
  if (!wallet) {
    console.error("Wallet not available");
    return null;
  }
  
  const inputs = [
    gameId,
    wallet.publicKey,
    questionType,
    questionValue
  ];

  const fee = 0.0001; // 0.0001 Aleo

  try {
    const transaction = await wallet.requestTransaction({
      program: PROGRAM_NAME,
      function: 'ask_question',
      inputs,
      fee
    });

    return transaction;
  } catch (error) {
    console.error("Error asking question:", error);
    return null;
  }
};

export const claimReward = async (wallet, gameId) => {
  if (!wallet) {
    console.error("Wallet not available");
    return null;
  }
  
  const inputs = [
    gameId,
    wallet.publicKey
  ];

  const fee = 0.0001; // 0.0001 Aleo

  try {
    const transaction = await wallet.requestTransaction({
      program: PROGRAM_NAME,
      function: 'claim_reward',
      inputs,
      fee
    });

    return transaction;
  } catch (error) {
    console.error("Error claiming reward:", error);
    return null;
  }
};

export const endGame = async (wallet, gameId) => {
  if (!wallet) {
    console.error("Wallet not available");
    return null;
  }
  
  const inputs = [gameId];

  const fee = 0.0001; // 0.0001 Aleo

  try {
    const transaction = await wallet.requestTransaction({
      program: PROGRAM_NAME,
      function: 'end_game',
      inputs,
      fee
    });

    return transaction;
  } catch (error) {
    console.error("Error ending game:", error);
    return null;
  }
};

export const getGameState = async (wallet, gameId) => {
  if (!wallet) {
    console.error("Wallet not available");
    return null;
  }
  
  try {
    const result = await wallet.requestRecords({
      program: PROGRAM_NAME,
      filter: {
        key: 'games',
        value: gameId
      }
    });

    return result[0];
  } catch (error) {
    console.error("Error fetching game state:", error);
    return null;
  }
};