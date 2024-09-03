import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { characters } from '../utils/characterData';
import { joinGame } from '../utils/aleoUtils';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

function JoinGame() {
  const [gameId, setGameId] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { publicKey, wallet } = useWallet();
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

    if (!gameId) {
      setError('Please enter a game ID.');
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

      const result = await joinGame(wallet, gameId, character);
      console.log("Joined game:", result);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error joining game:", error);
      setError("Failed to join game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="join-game">
      <h2>Join an Existing Game</h2>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Game ID:
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              required
            />
          </label>
        </div>
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
        <button type="submit">Join Game</button>
      </form>
    </div>
  );
}

export default JoinGame;