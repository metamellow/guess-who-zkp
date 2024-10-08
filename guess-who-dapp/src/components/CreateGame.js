import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { characters } from '../utils/characterData';
import { createGame } from '../utils/aleoUtils';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

function CreateGame() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { publicKey, requestTransaction } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publicKey) {
      setError('Please connect your wallet first.');
      return;
    }
    
    if (!selectedCharacter) {
      setError('Please select a character.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const character = {
        id: selectedCharacter.id,
        hair_color: selectedCharacter.attributes.hair_color,
        eye_color: selectedCharacter.attributes.eye_color,
        glasses: selectedCharacter.attributes.glasses,
        facial_hair: selectedCharacter.attributes.facial_hair,
        hat: selectedCharacter.attributes.hat,
        gender: selectedCharacter.attributes.gender,
      };

      console.log("Calling createGame with publicKey:", publicKey);
      const txId = await createGame(publicKey, character, requestTransaction);
      console.log("Game created, transaction ID:", txId);
      
      if (txId) {
        navigate(`/game/${txId}`);
      } else {
        throw new Error("Failed to create game. No transaction ID returned.");
      }
    } catch (error) {
      console.error("Error creating game:", error);
      setError("Failed to create game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="create-game">
      <h2>Create a New Game</h2>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Select Character:
            <select 
              value={selectedCharacter ? selectedCharacter.id : ''}
              onChange={(e) => setSelectedCharacter(characters.find(c => c.id === Number(e.target.value)))}
              required
            >
              <option value="">Select a character</option>
              {characters.map(char => (
                <option key={char.id} value={char.id}>{char.name}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit">Create Game</button>
      </form>
    </div>
  );
}

export default CreateGame;