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