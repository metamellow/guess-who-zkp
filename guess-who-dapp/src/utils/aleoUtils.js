import { ProgramManager, initializeWasm, Account } from '@aleohq/sdk';

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL;
const RPC_URL = process.env.REACT_APP_RPC_ENDPOINT_URL;
const PROGRAM_NAME = process.env.REACT_APP_PROGRAM_NAME;
const FEE = 0.02; // 0.02 Aleo credits

let wasmInitialized = false;

const initializeAleoWasm = async () => {
  if (!wasmInitialized) {
    await initializeWasm();
    wasmInitialized = true;
    console.log("WebAssembly initialized");
  }
};

const getNetworkUrl = (path = '') => {
  const url = `${RPC_URL}/testnet${path}`;
  console.log("Constructed URL:", url);
  return url;
};

const createProgramManager = () => {
  const url = getNetworkUrl();
  console.log("Creating ProgramManager with URL:", url);
  return new ProgramManager(url);
};

export const getPlayerBalance = async (address) => {
  console.log("getPlayerBalance function called");
  await initializeAleoWasm();

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

export const createGame = async (publicKey, character, requestTransaction) => {
  console.log("createGame function called");
  await initializeAleoWasm();

  try {
    const programManager = createProgramManager();

    const inputs = [
      publicKey,
      JSON.stringify(character)
    ];

    console.log("Executing create_game with inputs:", inputs);
    
    const transaction = await programManager.execute(
      PROGRAM_NAME,
      'create_game',
      inputs,
      FEE,
      undefined,
      true
    );

    console.log("Transaction built:", transaction);
    const txId = await requestTransaction(transaction);

    console.log("Game created, transaction ID:", txId);
    return txId;
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};

export const joinGame = async (publicKey, gameId, character, requestTransaction) => {
  console.log("joinGame function called");
  await initializeAleoWasm();

  try {
    const programManager = createProgramManager();

    const inputs = [
      gameId,
      publicKey,
      JSON.stringify(character)
    ];

    const transaction = await programManager.execute(PROGRAM_NAME, 'join_game', inputs, FEE, undefined, true);
    console.log("Transaction built:", transaction);
    const txId = await requestTransaction(transaction);

    console.log("Joined game, transaction ID:", txId);
    return txId;
  } catch (error) {
    console.error("Error joining game:", error);
    throw error;
  }
};

export const askQuestion = async (publicKey, gameId, questionType, questionValue, requestTransaction) => {
  console.log("askQuestion function called");
  await initializeAleoWasm();

  try {
    const programManager = createProgramManager();

    const inputs = [
      gameId,
      publicKey,
      questionType.toString(),
      questionValue.toString()
    ];

    const transaction = await programManager.execute(PROGRAM_NAME, 'ask_question', inputs, FEE, undefined, true);
    console.log("Transaction built:", transaction);
    const txId = await requestTransaction(transaction);

    console.log("Question asked, transaction ID:", txId);
    return txId;
  } catch (error) {
    console.error("Error asking question:", error);
    throw error;
  }
};

export const claimReward = async (publicKey, gameId, requestTransaction) => {
  console.log("claimReward function called");
  await initializeAleoWasm();

  try {
    const programManager = createProgramManager();

    const inputs = [
      gameId,
      publicKey
    ];

    const transaction = await programManager.execute(PROGRAM_NAME, 'claim_reward', inputs, FEE, undefined, true);
    console.log("Transaction built:", transaction);
    const txId = await requestTransaction(transaction);

    console.log("Reward claimed, transaction ID:", txId);
    return txId;
  } catch (error) {
    console.error("Error claiming reward:", error);
    throw error;
  }
};

export const endGame = async (publicKey, gameId, requestTransaction) => {
  console.log("endGame function called");
  await initializeAleoWasm();

  try {
    const programManager = createProgramManager();

    const inputs = [gameId];

    const transaction = await programManager.execute(PROGRAM_NAME, 'end_game', inputs, FEE, undefined, true);
    console.log("Transaction built:", transaction);
    const txId = await requestTransaction(transaction);

    console.log("Game ended, transaction ID:", txId);
    return txId;
  } catch (error) {
    console.error("Error ending game:", error);
    throw error;
  }
};

export const getGameState = async (gameId) => {
  console.log("getGameState function called");
  await initializeAleoWasm();

  try {
    const url = getNetworkUrl(`/program/${PROGRAM_NAME}/mapping/games/${gameId}`);
    console.log("Fetching game state from URL:", url);
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.status !== 200) {
      throw new Error(data.message || 'Failed to fetch game state');
    }

    console.log("Game state:", data);
    return data;
  } catch (error) {
    console.error("Error fetching game state:", error);
    return null;
  }
};