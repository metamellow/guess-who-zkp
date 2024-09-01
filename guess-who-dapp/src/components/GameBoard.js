// GameBoard.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { characters, getCharacterById, attributeToIndex, indexToAttribute } from '../utils/characterData';
import { useAleoWallet } from '../utils/aleoUtils';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

// Define questionTypes
const questionTypes = [
  {id: 1, name: "Hair Color"},
  {id: 2, name: "Eye Color"},
  {id: 3, name: "Glasses"},
  {id: 4, name: "Facial Hair"},
  {id: 5, name: "Hat"},
  {id: 6, name: "Gender"}
];

function GameBoard() {
  const { id: gameId } = useParams();
  const [gameState, setGameState] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [selectedQuestionValue, setSelectedQuestionValue] = useState('');
  const [eliminatedCharacters, setEliminatedCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { publicKey } = useWallet();
  const { getGameState, askQuestion, claimReward, endGame } = useAleoWallet();

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval);
  }, [gameId, getGameState]);

  const fetchGameState = async () => {
    try {
      setLoading(true);
      const state = await getGameState(gameId);
      setGameState(state);
    } catch (error) {
      console.error("Error fetching game state:", error);
      setError("Failed to fetch game state. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!selectedQuestionType || !selectedQuestionValue) return;
    try {
      setLoading(true);
      const result = await askQuestion(gameId, selectedQuestionType, selectedQuestionValue);
      console.log("Question asked:", result);
      await fetchGameState();
      eliminateCharacters(selectedQuestionType, selectedQuestionValue, result.answer);
    } catch (error) {
      console.error("Error asking question:", error);
      setError("Failed to ask question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async () => {
    try {
      setLoading(true);
      const result = await claimReward(gameId);
      console.log("Reward claimed:", result);
      alert("Reward claimed successfully!");
      await fetchGameState();
    } catch (error) {
      console.error("Error claiming reward:", error);
      setError("Failed to claim reward. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndGame = async () => {
    try {
      setLoading(true);
      const result = await endGame(gameId);
      console.log("Game ended:", result);
      alert("Game ended successfully!");
      await fetchGameState();
    } catch (error) {
      console.error("Error ending game:", error);
      setError("Failed to end game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const eliminateCharacters = (questionType, questionValue, answer) => {
    setEliminatedCharacters(prev => [
      ...prev,
      ...characters.filter(char => {
        const charValue = char.attributes[questionType.toLowerCase().replace(' ', '_')];
        return answer ? charValue !== questionValue : charValue === questionValue;
      }).map(char => char.id)
    ]);
  };

  const renderCharacters = () => {
    return characters.map((character) => (
      <div 
        key={character.id} 
        onClick={() => setSelectedCharacter(character)}
        style={{ 
          cursor: 'pointer', 
          opacity: eliminatedCharacters.includes(character.id) ? 0.3 : 1,
          backgroundColor: selectedCharacter?.id === character.id ? '#4a4a4a' : '#2a2a2a',
          padding: '10px',
          margin: '5px',
          display: 'inline-block',
          textAlign: 'center'
        }}
      >
        <img src={`/character-images/${character.id}.png`} alt={character.name} style={{ width: '100px', height: '100px' }} />
        <div>{character.name}</div>
      </div>
    ));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!gameState) return <div>No game state available.</div>;

  return (
    <div className="game-board">
      <h2>Game Board</h2>
      <div>Game ID: {gameId}</div>
      <div>Current Turn: {gameState.current_turn === publicKey ? 'Your Turn' : 'Opponent\'s Turn'}</div>
      <div>Questions Asked: {gameState.questions_asked}/10</div>
      
      <div className="game-content">
        <div className="characters-grid">
          <h3>Characters</h3>
          <div className="grid">
            {renderCharacters()}
          </div>
        </div>
        
        <div className="game-actions">
          <h3>Actions</h3>
          <select 
            value={selectedQuestionType} 
            onChange={(e) => setSelectedQuestionType(e.target.value)}
          >
            <option value="">Select question type</option>
            {questionTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          <input 
            type="text" 
            value={selectedQuestionValue} 
            onChange={(e) => setSelectedQuestionValue(e.target.value)}
            placeholder="Enter question value"
          />
          <button 
            onClick={handleAskQuestion} 
            disabled={!selectedQuestionType || !selectedQuestionValue || gameState.current_turn !== publicKey || !gameState.game_active}
          >
            Ask Question
          </button>
          <button 
            onClick={handleClaimReward} 
            disabled={gameState.game_active || gameState.winner !== publicKey || gameState.reward_claimed}
          >
            Claim Reward
          </button>
          <button 
            onClick={handleEndGame} 
            disabled={!gameState.game_active || gameState.questions_asked < 10}
          >
            End Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameBoard;