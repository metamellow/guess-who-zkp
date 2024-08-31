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