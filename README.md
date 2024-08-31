# Guess Who ZKP: A Zero-Knowledge Proof Game

Hi frens! Please consider supporting me by following my socials:

[<kbd> Youtube </kbd>][KBD]

[KBD]: Types/KBD.md

[<kbd> Twitter </kbd>][KBD]

[KBD]: Types/KBD.md


## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)

   3.1. [Setting Up the Leo Project](#setting-up-the-leo-project)
   
   3.2. [Compiling and Deploying the Leo Contract](#compiling-and-deploying-the-leo-contract)
   
   3.3. [Setting Up the React Project](#setting-up-the-react-project)
4. [Leo Contract](#leo-contract)
5. [React Application](#react-application)
   
   5.1. [Project Structure](#project-structure)
   
   5.2. [Main Components](#main-components)
   
   5.3. [Utility Functions](#utility-functions)
   
   5.4. [Styling](#styling)
6. [Running the Application](#running-the-application)

## 1. Introduction

Guess Who ZKP is a blockchain-based implementation of the classic "Guess Who?" game, leveraging Zero-Knowledge Proofs (ZKP) on the Aleo platform. This project combines a Leo smart contract with a React frontend to create an engaging and privacy-preserving gaming experience.

## 2. Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js and npm](https://nodejs.org/)
- [Leo CLI](https://developer.aleo.org/leo/installation)
- [Git](https://git-scm.com/)

## 3. Project Setup

### 3.1 Setting Up the Leo Project

1. Create a new directory for your project:
   ```bash
    mkdir guess_who_zkp
    cd guess_who_zkp
   ```

2. Initialize a new Leo project:
   ```bash
    leo new guess_who_zkp
   ```

### 3.2 Compiling and Deploying the Leo Contract

1. Compile the contract:
   ```bash
    leo build
   ```

2. Deploy the contract to the Aleo testnet (ensure you have testnet credits):
   ```bash
    leo deploy guess_who_zkp
   ```

   Note: Keep the program ID returned after deployment for use in the React app.

### 3.3 Setting Up the React Project

1. In the `guess_who_zkp` directory, create a new React app:
   ```bash
    npx create-react-app client
    cd client
    npm install @demox-labs/aleo-wallet-adapter-react @demox-labs/aleo-wallet-adapter-leo react-router-dom dotenv
   ```

2. Create a `.env` file in the `client` directory with the following content:
   ```
    REACT_APP_PROGRAM_NAME=guess_who_zkp.aleo
    REACT_APP_NETWORK_URL=https://api.explorer.aleo.org/v1
    REACT_APP_GAME_COST=0.0001
   ```

## 4. Leo Contract

The Leo contract (`main.leo`) defines the game logic, including creating games, joining games, asking questions, and claiming rewards.

```rust
    program guess_who_zkp.aleo {
      // Constants
      const GAME_COST: u64 = 100000u64; // 0.0001 Aleo (assuming 6 decimal places)
      const TAX_RATE: u64 = 10u64; // 10%
      const TAX_RECIPIENT: address = aleo1az8p9vlllyqwtj0c2g9svkd0e5v0p3zzdflwwrpa7kpe8xrfxgfqqpru7m;

      struct Character {
         id: u8,
         hair_color: u8,
         eye_color: u8,
         glasses: bool,
         facial_hair: bool,
         hat: bool,
         gender: u8,
      }

      struct GameState {
         player1: address,
         player2: address,
         player1_character: Character,
         player2_character: Character,
         current_turn: address,
         game_active: bool,
         winner: address,
         questions_asked: u8,
         reward_claimed: bool,
      }

      mapping games: field => GameState;
      mapping player_balances: address => u64;

      async transition create_game(player: address, character: Character) -> (field, Future) {
         let game_id: field = 123field; // Pseudo-random field for simplicity
         return (game_id, finalize_create_game(game_id, player, character));
      }

      async function finalize_create_game(game_id: field, player: address, character: Character) {
         let player_balance: u64 = Mapping::get_or_use(player_balances, player, 0u64);
         assert(player_balance >= GAME_COST);

         let initial_state: GameState = GameState {
               player1: player,
               player2: player,
               player1_character: character,
               player2_character: Character { id: 0u8, hair_color: 0u8, eye_color: 0u8, glasses: false, facial_hair: false, hat: false, gender: 0u8 },
               current_turn: player,
               game_active: false,
               winner: player,
               questions_asked: 0u8,
               reward_claimed: false,
         };

         Mapping::set(games, game_id, initial_state);
         Mapping::set(player_balances, player, player_balance - GAME_COST);
      }

      async transition join_game(game_id: field, player: address, character: Character) -> Future {
         return finalize_join_game(game_id, player, character);
      }

      async function finalize_join_game(game_id: field, player: address, character: Character) {
         let game_state: GameState = Mapping::get(games, game_id);
         assert(!game_state.game_active);
         assert(game_state.player2 == game_state.player1);

         let player_balance: u64 = Mapping::get_or_use(player_balances, player, 0u64);
         assert(player_balance >= GAME_COST);

         let updated_state: GameState = GameState {
               player1: game_state.player1,
               player2: player,
               player1_character: game_state.player1_character,
               player2_character: character,
               current_turn: game_state.player1,
               game_active: true,
               winner: game_state.winner,
               questions_asked: 0u8,
               reward_claimed: false,
         };

         Mapping::set(games, game_id, updated_state);
         Mapping::set(player_balances, player, player_balance - GAME_COST);
      }

      async transition ask_question(game_id: field, player: address, question_type: u8, question_value: u8) -> Future {
         assert(question_type >= 0u8 && question_type <= 6u8); // Validate question_type
         return finalize_ask_question(game_id, player, question_type, question_value);
      }

      async function finalize_ask_question(game_id: field, player: address, question_type: u8, question_value: u8) {
         let game_state: GameState = Mapping::get(games, game_id);
         assert(game_state.current_turn == player);

         let target_character: Character = player == game_state.player1 ? game_state.player2_character : game_state.player1_character;
         
         let is_correct: bool = question_type == 0u8 ? target_character.id == question_value :
                                 question_type == 1u8 ? target_character.hair_color == question_value :
                                 question_type == 2u8 ? target_character.eye_color == question_value :
                                 question_type == 3u8 ? (question_value == 1u8) == target_character.glasses :
                                 question_type == 4u8 ? (question_value == 1u8) == target_character.facial_hair :
                                 question_type == 5u8 ? (question_value == 1u8) == target_character.hat :
                                 question_type == 6u8 ? target_character.gender == question_value :
                                 false;

         let new_turn: address = is_correct ? game_state.current_turn : (player == game_state.player1 ? game_state.player2 : game_state.player1);
         let new_questions_asked: u8 = game_state.questions_asked + 1u8;

         let updated_state: GameState = GameState {
               player1: game_state.player1,
               player2: game_state.player2,
               player1_character: game_state.player1_character,
               player2_character: game_state.player2_character,
               current_turn: new_turn,
               game_active: !is_correct && new_questions_asked < 10u8,
               winner: is_correct ? player : game_state.winner,
               questions_asked: new_questions_asked,
               reward_claimed: game_state.reward_claimed,
         };

         Mapping::set(games, game_id, updated_state);
      }

      async transition claim_reward(game_id: field, player: address) -> Future {
         return finalize_claim_reward(game_id, player);
      }

      async function finalize_claim_reward(game_id: field, player: address) {
         let game_state: GameState = Mapping::get(games, game_id);
         assert(!game_state.game_active);
         assert(game_state.winner == player);
         assert(!game_state.reward_claimed);

         let total_pot: u64 = GAME_COST * 2u64;
         let tax_amount: u64 = (total_pot * TAX_RATE) / 100u64;
         let reward_amount: u64 = total_pot - tax_amount;

         let winner_balance: u64 = Mapping::get_or_use(player_balances, player, 0u64);
         Mapping::set(player_balances, player, winner_balance + reward_amount);

         let tax_recipient_balance: u64 = Mapping::get_or_use(player_balances, TAX_RECIPIENT, 0u64);
         Mapping::set(player_balances, TAX_RECIPIENT, tax_recipient_balance + tax_amount);

         Mapping::set(games, game_id, GameState {
               player1: game_state.player1,
               player2: game_state.player2,
               player1_character: game_state.player1_character,
               player2_character: game_state.player2_character,
               current_turn: game_state.current_turn,
               game_active: false,
               winner: game_state.winner,
               questions_asked: game_state.questions_asked,
               reward_claimed: true,
         });
      }

      async transition end_game(game_id: field) -> Future {
         return finalize_end_game(game_id);
      }

      async function finalize_end_game(game_id: field) {
         let game_state: GameState = Mapping::get(games, game_id);
         assert(game_state.game_active);
         assert(game_state.questions_asked >= 10u8);

         let total_pot: u64 = GAME_COST * 2u64;
         let tax_amount: u64 = (total_pot * TAX_RATE) / 100u64;
         let refund_amount: u64 = (total_pot - tax_amount) / 2u64; // Each player gets half minus tax

         let player1_balance: u64 = Mapping::get_or_use(player_balances, game_state.player1, 0u64);
         let player2_balance: u64 = Mapping::get_or_use(player_balances, game_state.player2, 0u64);

         Mapping::set(player_balances, game_state.player1, player1_balance + refund_amount);
         Mapping::set(player_balances, game_state.player2, player2_balance + refund_amount);

         let tax_recipient_balance: u64 = Mapping::get_or_use(player_balances, TAX_RECIPIENT, 0u64);
         Mapping::set(player_balances, TAX_RECIPIENT, tax_recipient_balance + tax_amount);

         Mapping::remove(games, game_id);
      }
   }
```

## 5. React Application

### 5.1 Project Structure

The React application is structured as follows:

```rust
    client/
    ├── public/
    │   └── character-images/
    ├── src/
    │   ├── components/
    │   │   ├── CreateGame.js
    │   │   ├── ErrorMessage.js
    │   │   ├── GameBoard.js
    │   │   ├── Home.js
    │   │   ├── JoinGame.js
    │   │   ├── LoadingSpinner.js
    │   │   ├── PlayerBalance.js
    │   │   └── WalletConnectionButton.js
    │   ├── utils/
    │   │   ├── aleoUtils.js
    │   │   └── characterData.js
    │   ├── styles/
    │   │   └── App.css
    │   ├── App.js
    │   └── index.js
    ├── .env
    └── package.json
```

### 5.2 Main Components

Here are the main React components of the application:

1. **App.js**: The main component that sets up routing and wallet connection.

```javascript
   import React from 'react';
   import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
   import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
   import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui';
   import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
   import { useMemo } from 'react';

   import Home from './components/Home';
   import CreateGame from './components/CreateGame';
   import JoinGame from './components/JoinGame';
   import GameBoard from './components/GameBoard';
   import WalletConnectionButton from './components/WalletConnectionButton';

   import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';
   import './styles/App.css';

   function App() {
   const wallets = useMemo(
      () => [
         new LeoWalletAdapter({
         appName: 'Guess Who ZKP Game',
         })
      ],
      []
   );

   return (
      <WalletProvider wallets={wallets} autoConnect>
         <WalletModalProvider>
         <Router>
            <div className="App">
               <WalletConnectionButton />
               <Switch>
               <Route exact path="/" component={Home} />
               <Route path="/create" component={CreateGame} />
               <Route path="/join" component={JoinGame} />
               <Route path="/game/:id" component={GameBoard} />
               </Switch>
            </div>
         </Router>
         </WalletModalProvider>
      </WalletProvider>
   );
   }

   export default App;
```

2. **Home.js**: The home page component.

```javascript
   import React from 'react';
   import { Link } from 'react-router-dom';
   import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
   import PlayerBalance from './PlayerBalance';

   function Home() {
   const { publicKey } = useWallet();

   return (
      <div className="home">
         <h1>Welcome to Guess Who ZKP</h1>
         {publicKey ? (
         <div>
            <Link to="/create">
               <button>Create Game</button>
            </Link>
            <Link to="/join">
               <button>Join Game</button>
            </Link>
            <PlayerBalance />
         </div>
         ) : (
         <p>Please connect your wallet to play.</p>
         )}
      </div>
   );
   }

   export default Home;

```

3. **CreateGame.js**: Component for creating a new game.

```javascript
   import React, { useState } from 'react';
   import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
   import { useHistory } from 'react-router-dom';
   import { characters } from '../utils/characterData';
   import { createGame } from '../utils/aleoUtils';
   import LoadingSpinner from './LoadingSpinner';
   import ErrorMessage from './ErrorMessage';

   function CreateGame() {
   const [selectedCharacter, setSelectedCharacter] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const { publicKey } = useWallet();
   const history = useHistory();

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

         const result = await createGame(character);
         console.log("Game created:", result);
         history.push(`/game/${result.gameId}`);
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
```

4. **JoinGame.js**: Component for joining an existing game.

```javascript
   import React, { useState } from 'react';
   import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
   import { useHistory } from 'react-router-dom';
   import { characters } from '../utils/characterData';
   import { joinGame } from '../utils/aleoUtils';
   import LoadingSpinner from './LoadingSpinner';
   import ErrorMessage from './ErrorMessage';

   function JoinGame() {
   const [gameId, setGameId] = useState('');
   const [selectedCharacter, setSelectedCharacter] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const { publicKey } = useWallet();
   const history = useHistory();

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

         const result = await joinGame(gameId, character);
         console.log("Joined game:", result);
         history.push(`/game/${gameId}`);
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
```

5. **GameBoard.js**: The main game interface component.

```javascript
   import React, { useState, useEffect } from 'react';
   import { useParams } from 'react-router-dom';
   import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
   import { characters, getCharacterById, attributeToIndex, indexToAttribute } from '../utils/characterData';
   import { getGameState, askQuestion, claimReward, endGame } from '../utils/aleoUtils';
   import LoadingSpinner from './LoadingSpinner';
   import ErrorMessage from './ErrorMessage';

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

   useEffect(() => {
      fetchGameState();
      const interval = setInterval(fetchGameState, 10000); // Fetch every 10 seconds
      return () => clearInterval(interval);
   }, [gameId]);

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
```

6. **WalletConnectionButton.js**: Component for connecting the Aleo wallet.

```javascript
   import React from 'react';
   import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
   import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';

   function WalletConnectionButton() {
   const { publicKey } = useWallet();

   return (
      <div className="wallet-connection">
         <WalletMultiButton />
         {publicKey && <p>Connected: {publicKey.toString()}</p>}
      </div>
   );
   }

   export default WalletConnectionButton;
```

7. **PlayerBalance.js**: Component for displaying the player's balance.

```javascript
   import React, { useState, useEffect } from 'react';
   import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
   import { getPlayerBalance } from '../utils/aleoUtils';

   function PlayerBalance() {
   const [balance, setBalance] = useState(null);
   const { publicKey } = useWallet();

   useEffect(() => {
      if (publicKey) {
         fetchBalance();
      }
   }, [publicKey]);

   const fetchBalance = async () => {
      try {
         const playerBalance = await getPlayerBalance(publicKey);
         setBalance(playerBalance);
      } catch (error) {
         console.error("Error fetching player balance:", error);
      }
   };

   if (!publicKey) return null;

   return (
      <div className="player-balance">
         <h3>Your Balance</h3>
         <p>{balance !== null ? `${balance / 1_000_000} Aleo` : 'Loading...'}</p>
      </div>
   );
   }

   export default PlayerBalance;

```

8. **LoadingSpinner.js**: A reusable loading spinner component.

```javascript
   import React from 'react';

   function LoadingSpinner() {
   return (
      <div className="loading-spinner">
         <div className="spinner"></div>
         <p>Loading...</p>
      </div>
   );
   }

   export default LoadingSpinner;
```

9. **ErrorMessage.js**: A reusable error message component.

```javascript
   import React from 'react';

   function ErrorMessage({ message }) {
   return (
      <div className="error-message">
         <p>{message}</p>
      </div>
   );
   }

   export default ErrorMessage;
```

### 5.3 Utility Functions

The application uses two main utility files:

1. **aleoUtils.js**: Contains functions for interacting with the Leo contract.

```javascript
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
```

2. **characterData.js**: Defines the game characters and their attributes.

```javascript
   export const characters = [
   { id: 1, name: "Satoshi Nakamoto", attributes: { hairColor: "Brown", eyeColor: "Brown", glasses: true, facialHair: false, hat: true, gender: "Male" }},
   { id: 2, name: "Vitalik Buterin", attributes: { hairColor: "Blonde", eyeColor: "Blue", glasses: false, facialHair: false, hat: false, gender: "Male" }},
   { id: 3, name: "Elon Musk", attributes: { hairColor: "Black", eyeColor: "Green", glasses: false, facialHair: false, hat: true, gender: "Male" }},
   { id: 4, name: "Craig Wright", attributes: { hairColor: "Brown", eyeColor: "Hazel", glasses: true, facialHair: true, hat: false, gender: "Male" }},
   { id: 5, name: "CZ Binance", attributes: { hairColor: "Black", eyeColor: "Brown", glasses: true, facialHair: false, hat: false, gender: "Male" }},
   { id: 6, name: "Charles Hoskinson", attributes: { hairColor: "Red", eyeColor: "Blue", glasses: true, facialHair: true, hat: true, gender: "Male" }},
   { id: 7, name: "Shiba Inu (Doge)", attributes: { hairColor: "White", eyeColor: "Brown", glasses: false, facialHair: false, hat: false, gender: "Non-Binary" }},
   { id: 8, name: "Pepe the Frog", attributes: { hairColor: "Gray", eyeColor: "Green", glasses: false, facialHair: false, hat: true, gender: "Non-Binary" }},
   { id: 9, name: "Bitcoin Maximalist", attributes: { hairColor: "Blonde", eyeColor: "Hazel", glasses: true, facialHair: false, hat: true, gender: "Female" }},
   { id: 10, name: "Ethereum Dev", attributes: { hairColor: "Black", eyeColor: "Blue", glasses: true, facialHair: true, hat: false, gender: "Female" }},
   { id: 11, name: "Ripple Enthusiast", attributes: { hairColor: "Red", eyeColor: "Green", glasses: false, facialHair: false, hat: true, gender: "Female" }},
   { id: 12, name: "Dogecoin Holder", attributes: { hairColor: "White", eyeColor: "Brown", glasses: false, facialHair: true, hat: false, gender: "Female" }},
   { id: 13, name: "Monero Miner", attributes: { hairColor: "Gray", eyeColor: "Hazel", glasses: true, facialHair: false, hat: true, gender: "Male" }},
   { id: 14, name: "Litecoin Lover", attributes: { hairColor: "Blonde", eyeColor: "Blue", glasses: false, facialHair: false, hat: false, gender: "Female" }},
   { id: 15, name: "Cardano Staker", attributes: { hairColor: "Red", eyeColor: "Green", glasses: true, facialHair: true, hat: true, gender: "Male" }},
   { id: 16, name: "Polkadot Enthusiast", attributes: { hairColor: "Brown", eyeColor: "Hazel", glasses: true, facialHair: false, hat: false, gender: "Female" }},
   { id: 17, name: "Chainlink Oracle", attributes: { hairColor: "Gray", eyeColor: "Brown", glasses: true, facialHair: true, hat: true, gender: "Male" }},
   { id: 18, name: "Uniswap User", attributes: { hairColor: "Black", eyeColor: "Blue", glasses: false, facialHair: false, hat: false, gender: "Female" }},
   { id: 19, name: "NFT Artist", attributes: { hairColor: "White", eyeColor: "Green", glasses: false, facialHair: true, hat: false, gender: "Non-Binary" }},
   { id: 20, name: "DeFi Degenerate", attributes: { hairColor: "Gray", eyeColor: "Hazel", glasses: true, facialHair: false, hat: true, gender: "Female" }},
   { id: 21, name: "ApeCoin Holder", attributes: { hairColor: "Red", eyeColor: "Brown", glasses: true, facialHair: true, hat: true, gender: "Male" }},
   { id: 22, name: "Meme Investor", attributes: { hairColor: "Blonde", eyeColor: "Blue", glasses: false, facialHair: false, hat: false, gender: "Non-Binary" }},
   { id: 23, name: "DAO Voter", attributes: { hairColor: "Black", eyeColor: "Green", glasses: false, facialHair: false, hat: true, gender: "Non-Binary" }},
   { id: 24, name: "Crypto Influencer", attributes: { hairColor: "White", eyeColor: "Hazel", glasses: true, facialHair: false, hat: true, gender: "Non-Binary" }},
   ];

   export const getCharacterById = id => characters.find(char => char.id === id);

   export const attributeToIndex = {
   hair_color: { Brown: 1, Blonde: 2, Black: 3, Red: 4, Gray: 5, White: 6 },
   eye_color: { Brown: 1, Blue: 2, Green: 3, Hazel: 4 },
   glasses: { true: 1, false: 0 },
   facial_hair: { true: 1, false: 0 },
   hat: { true: 1, false: 0 },
   gender: { Male: 1, Female: 2, Non-Binary: 3 }
   };

   export const indexToAttribute = {
   hair_color: { 1: "Brown", 2: "Blonde", 3: "Black", 4: "Red", 5: "Gray", 6: "White" },
   eye_color: { 1: "Brown", 2: "Blue", 3: "Green", 4: "Hazel" },
   glasses: { 1: true, 0: false },
   facial_hair: { 1: true, 0: false },
   hat: { 1: true, 0: false },
   gender: { 1: "Male", 2: "Female", 3: "Non-Binary" }
   };
```

### 5.4 Styling

1. **App.css**: The application's basic styling.

```css
   .App {
   text-align: center;
   padding: 20px;
   font-family: Arial, sans-serif;
   }

   .wallet-connection {
   position: absolute;
   top: 10px;
   right: 10px;
   }

   .home, .create-game, .join-game, .game-board {
   max-width: 800px;
   margin: 0 auto;
   }

   button {
   background-color: #4CAF50;
   border: none;
   color: white;
   padding: 15px 32px;
   text-align: center;
   text-decoration: none;
   display: inline-block;
   font-size: 16px;
   margin: 4px 2px;
   cursor: pointer;
   }

   button:disabled {
   background-color: #cccccc;
   cursor: not-allowed;
   }

   .loading-spinner {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: 100vh;
   }

   .spinner {
   border: 4px solid #f3f3f3;
   border-top: 4px solid #3498db;
   border-radius: 50%;
   width: 40px;
   height: 40px;
   animation: spin 1s linear infinite;
   }

   @keyframes spin {
   0% { transform: rotate(0deg); }
   100% { transform: rotate(360deg); }
   }

   .error-message {
   color: red;
   font-weight: bold;
   margin: 10px 0;
   }

   .characters-grid {
   display: flex;
   flex-wrap: wrap;
   justify-content: center;
   }

   .game-actions {
   margin-top: 20px;
   }

   .player-balance {
   margin-top: 20px;
   font-weight: bold;
   }
```

## 6. Running the Application

To run your application:

1. Ensure you're in the `client` directory.
2. Install all dependencies:
   ```bash
    npm install
   ```
3. Start the development server:
   ```bash
    npm start
   ```

Your app should now be running on `http://localhost:3000`.