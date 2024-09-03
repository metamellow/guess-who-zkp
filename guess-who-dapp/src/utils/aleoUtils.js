import { 
  Account, 
  AleoNetworkClient, 
  ProgramManager, 
  NetworkRecordProvider,
  PrivateKey,
  Transaction
} from '@aleohq/sdk';

const NETWORK_CLIENT = new AleoNetworkClient(process.env.REACT_APP_NETWORK_URL);
const PROGRAM_MANAGER = new ProgramManager(process.env.REACT_APP_NETWORK_URL);
const RPC_URL = process.env.REACT_APP_RPC_ENDPOINT_URL;
const PROGRAM_NAME = process.env.REACT_APP_PROGRAM_NAME;

export const getPlayerBalance = async (address) => {
  console.log("getPlayerBalance function called");
  
  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getMappingValue',
        params: {
          program_id: 'credits.aleo',
          mapping_name: 'account',
          key: address
        }
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    const balance = parseInt(data.result.replace('u64.private', ''), 10);
    console.log("Fetched balance:", balance);
    return balance;
  } catch (error) {
    console.error("Error fetching player balance:", error);
    return null;
  }
};

export const createGame = async (wallet, character) => {
  console.log("createGame function called");
  
  try {
    const account = new Account({privateKey: wallet.publicKey});
    PROGRAM_MANAGER.setAccount(account);
    
    const inputs = [
      account.address().to_string(),
      JSON.stringify(character)
    ];

    const fee = parseInt(process.env.REACT_APP_GAME_COST * 1000000); // Convert to microcredits

    const transaction = await PROGRAM_MANAGER.execute(
      PROGRAM_NAME,
      'create_game',
      inputs,
      fee,
      true // Make this a private execution
    );

    console.log("Game created, transaction:", transaction);
    return transaction;
  } catch (error) {
    console.error("Error creating game:", error);
    return null;
  }
};

export const joinGame = async (wallet, gameId, character) => {
  console.log("joinGame function called");
  
  try {
    const account = new Account({privateKey: wallet.publicKey});
    PROGRAM_MANAGER.setAccount(account);
    
    const inputs = [
      gameId,
      account.address().to_string(),
      JSON.stringify(character)
    ];

    const fee = parseInt(process.env.REACT_APP_GAME_COST * 1000000); // Convert to microcredits

    const transaction = await PROGRAM_MANAGER.execute(
      PROGRAM_NAME,
      'join_game',
      inputs,
      fee,
      true // Make this a private execution
    );

    console.log("Joined game, transaction:", transaction);
    return transaction;
  } catch (error) {
    console.error("Error joining game:", error);
    return null;
  }
};

export const askQuestion = async (wallet, gameId, questionType, questionValue) => {
  console.log("askQuestion function called");
  
  try {
    const account = new Account({privateKey: wallet.publicKey});
    PROGRAM_MANAGER.setAccount(account);
    
    const inputs = [
      gameId,
      account.address().to_string(),
      questionType.toString(),
      questionValue.toString()
    ];

    const fee = 50000; // Set an appropriate fee

    const transaction = await PROGRAM_MANAGER.execute(
      PROGRAM_NAME,
      'ask_question',
      inputs,
      fee,
      true // Make this a private execution
    );

    console.log("Question asked, transaction:", transaction);
    return transaction;
  } catch (error) {
    console.error("Error asking question:", error);
    return null;
  }
};

export const claimReward = async (wallet, gameId) => {
  console.log("claimReward function called");
  
  try {
    const account = new Account({privateKey: wallet.publicKey});
    PROGRAM_MANAGER.setAccount(account);
    
    const inputs = [
      gameId,
      account.address().to_string()
    ];

    const fee = 50000; // Set an appropriate fee

    const transaction = await PROGRAM_MANAGER.execute(
      PROGRAM_NAME,
      'claim_reward',
      inputs,
      fee,
      true // Make this a private execution
    );

    console.log("Reward claimed, transaction:", transaction);
    return transaction;
  } catch (error) {
    console.error("Error claiming reward:", error);
    return null;
  }
};

export const endGame = async (wallet, gameId) => {
  console.log("endGame function called");
  
  try {
    const account = new Account({privateKey: wallet.publicKey});
    PROGRAM_MANAGER.setAccount(account);
    
    const inputs = [gameId];

    const fee = 50000; // Set an appropriate fee

    const transaction = await PROGRAM_MANAGER.execute(
      PROGRAM_NAME,
      'end_game',
      inputs,
      fee,
      true // Make this a private execution
    );

    console.log("Game ended, transaction:", transaction);
    return transaction;
  } catch (error) {
    console.error("Error ending game:", error);
    return null;
  }
};

export const getGameState = async (gameId) => {
  console.log("getGameState function called");
  
  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getMappingValue',
        params: {
          program_id: PROGRAM_NAME,
          mapping_name: 'games',
          key: gameId
        }
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    console.log("Game state:", data.result);
    return data.result;
  } catch (error) {
    console.error("Error fetching game state:", error);
    return null;
  }
};