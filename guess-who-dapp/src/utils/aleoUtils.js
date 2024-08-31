import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';

const NETWORK = WalletAdapterNetwork.Testnet;
const PROGRAM_NAME = process.env.REACT_APP_PROGRAM_NAME;

export const getPlayerBalance = async (publicKey) => {
  if (!window.leo) {
    throw new Error("Leo wallet is not installed");
  }

  try {
    const result = await window.leo.requestRecords({
      programId: PROGRAM_NAME,
      functionName: 'get_player_balance',
      inputs: [publicKey]
    });

    if (result && result.length > 0) {
      return result[0].balance;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error in getPlayerBalance:", error);
    throw error;
  }
};

export const createGame = async (character) => {
  if (!window.leo) {
    throw new Error("Leo wallet is not installed");
  }

  try {
    const result = await window.leo.requestTransaction({
      programId: PROGRAM_NAME,
      functionName: 'create_game',
      inputs: [JSON.stringify(character)],
      fee: 1000000, // 0.001 Aleo
    });

    return result;
  } catch (error) {
    console.error("Error in createGame:", error);
    throw error;
  }
};

export const joinGame = async (gameId, character) => {
  if (!window.leo) {
    throw new Error("Leo wallet is not installed");
  }

  try {
    const result = await window.leo.requestTransaction({
      programId: PROGRAM_NAME,
      functionName: 'join_game',
      inputs: [gameId, JSON.stringify(character)],
      fee: 1000000, // 0.001 Aleo
    });

    return result;
  } catch (error) {
    console.error("Error in joinGame:", error);
    throw error;
  }
};

export const askQuestion = async (gameId, questionType, questionValue) => {
  if (!window.leo) {
    throw new Error("Leo wallet is not installed");
  }

  try {
    const result = await window.leo.requestTransaction({
      programId: PROGRAM_NAME,
      functionName: 'ask_question',
      inputs: [gameId, questionType, questionValue],
      fee: 1000000, // 0.001 Aleo
    });

    return result;
  } catch (error) {
    console.error("Error in askQuestion:", error);
    throw error;
  }
};

export const claimReward = async (gameId) => {
  if (!window.leo) {
    throw new Error("Leo wallet is not installed");
  }

  try {
    const result = await window.leo.requestTransaction({
      programId: PROGRAM_NAME,
      functionName: 'claim_reward',
      inputs: [gameId],
      fee: 1000000, // 0.001 Aleo
    });

    return result;
  } catch (error) {
    console.error("Error in claimReward:", error);
    throw error;
  }
};

export const endGame = async (gameId) => {
  if (!window.leo) {
    throw new Error("Leo wallet is not installed");
  }

  try {
    const result = await window.leo.requestTransaction({
      programId: PROGRAM_NAME,
      functionName: 'end_game',
      inputs: [gameId],
      fee: 1000000, // 0.001 Aleo
    });

    return result;
  } catch (error) {
    console.error("Error in endGame:", error);
    throw error;
  }
};

export const getGameState = async (gameId) => {
  if (!window.leo) {
    throw new Error("Leo wallet is not installed");
  }

  try {
    const result = await window.leo.requestRecords({
      programId: PROGRAM_NAME,
      functionName: 'get_game_state',
      inputs: [gameId]
    });

    if (result && result.length > 0) {
      return result[0];
    } else {
      throw new Error("Game not found");
    }
  } catch (error) {
    console.error("Error in getGameState:", error);
    throw error;
  }
};