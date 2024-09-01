// aleoUtils.js
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';

export const useAleoWallet = () => {
  const { publicKey, requestTransaction, requestRecords } = useWallet();

  const createGame = async (character) => {
    if (!publicKey) throw new Error("Wallet not connected");
    
    const inputs = [
      publicKey.toString(),
      JSON.stringify(character)
    ];

    const fee = Number(process.env.REACT_APP_GAME_COST);

    const transaction = await requestTransaction({
      program: process.env.REACT_APP_PROGRAM_NAME,
      function: 'create_game',
      inputs,
      fee
    });

    return transaction;
  };

  const joinGame = async (gameId, character) => {
    if (!publicKey) throw new Error("Wallet not connected");
    
    const inputs = [
      gameId,
      publicKey.toString(),
      JSON.stringify(character)
    ];

    const fee = Number(process.env.REACT_APP_GAME_COST);

    const transaction = await requestTransaction({
      program: process.env.REACT_APP_PROGRAM_NAME,
      function: 'join_game',
      inputs,
      fee
    });

    return transaction;
  };

  const askQuestion = async (gameId, questionType, questionValue) => {
    if (!publicKey) throw new Error("Wallet not connected");
    
    const inputs = [
      gameId,
      publicKey.toString(),
      questionType,
      questionValue
    ];

    const fee = 0.1; // 0.1 Aleo credits

    const transaction = await requestTransaction({
      program: process.env.REACT_APP_PROGRAM_NAME,
      function: 'ask_question',
      inputs,
      fee
    });

    return transaction;
  };

  const claimReward = async (gameId) => {
    if (!publicKey) throw new Error("Wallet not connected");
    
    const inputs = [
      gameId,
      publicKey.toString()
    ];

    const fee = 0.1; // 0.1 Aleo credits

    const transaction = await requestTransaction({
      program: process.env.REACT_APP_PROGRAM_NAME,
      function: 'claim_reward',
      inputs,
      fee
    });

    return transaction;
  };

  const endGame = async (gameId) => {
    if (!publicKey) throw new Error("Wallet not connected");
    
    const inputs = [gameId];

    const fee = 0.1; // 0.1 Aleo credits

    const transaction = await requestTransaction({
      program: process.env.REACT_APP_PROGRAM_NAME,
      function: 'end_game',
      inputs,
      fee
    });

    return transaction;
  };

  const getGameState = async (gameId) => {
    if (!publicKey) throw new Error("Wallet not connected");
    
    const result = await requestRecords({
      program: process.env.REACT_APP_PROGRAM_NAME,
      filter: {
        key: 'games',
        value: gameId
      }
    });

    return result[0];
  };

  const getPlayerBalance = async () => {
    if (!publicKey) throw new Error("Wallet not connected");
    
    const result = await requestRecords({
      program: process.env.REACT_APP_PROGRAM_NAME,
      filter: {
        key: 'player_balances',
        value: publicKey.toString()
      }
    });

    return result[0];
  };

  return {
    createGame,
    joinGame,
    askQuestion,
    claimReward,
    endGame,
    getGameState,
    getPlayerBalance,
  };
};