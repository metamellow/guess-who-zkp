import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';

const NETWORK = WalletAdapterNetwork.Testnet;
const PROGRAM_NAME = process.env.REACT_APP_PROGRAM_NAME;

export const getPlayerBalance = async (wallet) => {
  console.log("getPlayerBalance function called");
  
  if (!wallet || !wallet.adapter) {
    console.error("Wallet or adapter not available");
    return null;
  }
  
  try {
    console.log("Wallet adapter methods:", Object.keys(wallet.adapter));
    
    if (typeof wallet.adapter.requestRecords === 'function') {
      console.log("Requesting records...");
      const records = await wallet.adapter.requestRecords('credits.aleo');
      console.log("Raw records:", records);
      
      let balance = 0;
      if (Array.isArray(records)) {
        console.log("Number of records:", records.length);
        for (const record of records) {
          console.log("Processing record:", record);
          if (record && record.data) {
            try {
              console.log("Attempting to decrypt record:", record);
              const decryptedRecord = await wallet.adapter.decrypt(record.data);
              console.log("Decrypted record:", decryptedRecord);
              if (decryptedRecord && decryptedRecord.microcredits) {
                balance += Number(decryptedRecord.microcredits);
                console.log("Updated balance:", balance);
              } else {
                console.log("Decrypted record does not contain microcredits");
              }
            } catch (decryptError) {
              console.error("Error decrypting record:", decryptError);
            }
          } else {
            console.log("Invalid record structure:", record);
          }
        }
      } else {
        console.log("Records is not an array:", records);
      }
      console.log("Final calculated balance:", balance);
      return balance;
    } else {
      console.error("requestRecords method not available on wallet adapter");
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
    console.log("Creating game with inputs:", inputs);
    const transaction = await wallet.requestTransaction({
      program: PROGRAM_NAME,
      function: 'create_game',
      inputs,
      fee,
      network: NETWORK
    });

    console.log("Game created, transaction:", transaction);
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
    console.log("Joining game with inputs:", inputs);
    const transaction = await wallet.requestTransaction({
      program: PROGRAM_NAME,
      function: 'join_game',
      inputs,
      fee,
      network: NETWORK
    });

    console.log("Joined game, transaction:", transaction);
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
    console.log("Asking question with inputs:", inputs);
    const transaction = await wallet.requestTransaction({
      program: PROGRAM_NAME,
      function: 'ask_question',
      inputs,
      fee,
      network: NETWORK
    });

    console.log("Question asked, transaction:", transaction);
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
    console.log("Claiming reward with inputs:", inputs);
    const transaction = await wallet.requestTransaction({
      program: PROGRAM_NAME,
      function: 'claim_reward',
      inputs,
      fee,
      network: NETWORK
    });

    console.log("Reward claimed, transaction:", transaction);
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
    console.log("Ending game with inputs:", inputs);
    const transaction = await wallet.requestTransaction({
      program: PROGRAM_NAME,
      function: 'end_game',
      inputs,
      fee,
      network: NETWORK
    });

    console.log("Game ended, transaction:", transaction);
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
    console.log("Getting game state for game ID:", gameId);
    const result = await wallet.requestRecords({
      program: PROGRAM_NAME,
      filter: {
        key: 'games',
        value: gameId
      }
    });

    console.log("Game state result:", result);
    return result[0];
  } catch (error) {
    console.error("Error fetching game state:", error);
    return null;
  }
};