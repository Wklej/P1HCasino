//TODO: Backend - enums
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const gameState = {
    dealerCards: [],
    playerCards: [],
    dealerScore: 0,
    playerScore: 0,
};

const dealerCardsDiv = document.getElementById('dealer-cards');
const dealerScoreDiv = document.getElementById('dealer-score');
const playerCardsDiv = document.getElementById('player-cards');
const playerScoreDiv = document.getElementById('player-score');
const hitButton = document.getElementById('hit-button');
const stayButton = document.getElementById('stay-button');

/**
 * Draw next card from Deck
 * @Deck - GameState should hold deck?
 */
function getRandomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    return { suit, value };
}

/**
 * Equivalent to calculateHand() from java code
 */
function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['K', 'Q', 'J'].includes(card.value)) return 10;
    return parseInt(card.value);
}

// Utility function for fetching data
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

/**
 * Calculate hands for dealer and player + updating score div
 */
async function updateScores() {
    // dealerScore = stompClient.send(/app/calculateHand) or something like that
    gameState.dealerScore = await fetchData("/getDealerScore")
    gameState.playerScore = await fetchData("/getPlayerScore")

    //original code - JS evaluation
    // dealerScore = dealerCards.reduce((sum, card) => sum + getCardValue(card), 0);
    // playerScore = playerCards.reduce((sum, card) => sum + getCardValue(card), 0);

    dealerScoreDiv.innerText = `Score: ${gameState.dealerScore}`;
    playerScoreDiv.innerText = `Score: ${gameState.playerScore}`;
}

/**
 * GET request hands then render them as below
 */
function renderCards() {
    dealerCardsDiv.innerHTML = gameState.dealerCards.map(card => `<div class="card">${card.value}</div>`).join('');
    playerCardsDiv.innerHTML = gameState.playerCards.map(card => `<div class="card">${card.value}</div>`).join('');
}

/**
 * init hands + updateState()
 * Place bets here in future also
 */
async function startGame() {
    try {
        await fetch("/start")

        const dealerHandResponse = await fetchData("/getDealerHand");
        const playerHandResponse = await fetchData("/getPlayerHand");

        gameState.dealerCards = mapHand(dealerHandResponse);
        gameState.playerCards = mapHand(playerHandResponse);

        await updateState()

        const isBJ = await fetchData("/checkBlackJack")
        if (isBJ) {
            setTimeout(() => {
                alert('Player has BlackJack! Player wins!');
                resetGame();
            }, 100)
        }
    } catch (err) {
        console.error('error starting game: ', err)
    }
}

function mapHand(hand) {
    return hand.map(card => ({ value: card.value, rank: card.rank }));
}

/**
 * Each hit call would add one card from Deck to playerHand
 * 1. stompClient.send(/app/drawPlayer)
 *      a) update state with +1 player card -- DONE
 *      b) ifBust() logic on backend
 *      c) backend returns boolean
 * 2. return == true ? updateState() + alert : updateState()
 */
async function hit() {
    const drawnCard = await fetchData("/playerDraw")
    gameState.playerCards.push({value: drawnCard.value, rank: drawnCard.rank})

    await updateState()

    const playerBust = await fetchData("/isBust")
    if (playerBust) {
        setTimeout(() => {
            alert('Player busts! Dealer wins!');
            resetGame();
        }, 100)
    }
}

/**
 * 1. stompClient.send(/app/stay)
 *      a) dealerDraw() logic
 * 2. updateState()
 * 3. returns winner (alert winner) + reset game
 */
async function stay() {
    await fetch("/stay")

    const dealerHandResponse = await fetchData("/getDealerHand")
    gameState.dealerCards = mapHand(dealerHandResponse)

    await updateState()

    setTimeout(() => {
        if (gameState.dealerScore > 21) {
            alert('Dealer busts! Player wins!');
        } else if (gameState.dealerScore > gameState.playerScore) {
            alert('Dealer wins!');
        } else if (gameState.dealerScore === gameState.playerScore) {
            alert('Draw!')
        } else {
            alert('Player wins!');
        }
        resetGame();
    }, 100)
}

/**
 * Resets GameState hands and scores + start new game
 */
function resetGame() {
    gameState.dealerCards = [];
    gameState.playerCards = [];
    gameState.dealerScore = 0;
    gameState.playerScore = 0;
    startGame();
}

/**
 * simply call backend to update scores - calculateHand()
 * renderCards()
 */
async function updateState() {
    await updateScores()
    renderCards()
}

hitButton.addEventListener('click', hit);
stayButton.addEventListener('click', stay);

startGame();