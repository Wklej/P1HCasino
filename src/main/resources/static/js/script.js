//TODO: Backend - enums
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

//TODO: move to GameState
let dealerCards = [];
let playerCards = [];
let dealerScore = 0;
let playerScore = 0;

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

/**
 * Calculate hands for dealer and player + updating score div
 */
async function updateScores() {
    // dealerScore = stompClient.send(/app/calculateHand) or something like that
    dealerScore = await fetch("/getDealerScore")
        .then(response => response.json())
    playerScore = await fetch("/getPlayerScore")
        .then(response => response.json())

    //original code - JS evaluation
    // dealerScore = dealerCards.reduce((sum, card) => sum + getCardValue(card), 0);
    // playerScore = playerCards.reduce((sum, card) => sum + getCardValue(card), 0);

    dealerScoreDiv.innerText = `Score: ${dealerScore}`;
    playerScoreDiv.innerText = `Score: ${playerScore}`;
}

/**
 * GET request hands then render them as below
 */
function renderCards() {
    dealerCardsDiv.innerHTML = dealerCards.map(card => `<div class="card">${card.value}</div>`).join('');
    playerCardsDiv.innerHTML = playerCards.map(card => `<div class="card">${card.value}</div>`).join('');
}

/**
 * init hands + updateState()
 * Place bets here in future also
 */
async function startGame() {
    try {
        await fetch("/start")

        const dealerHandResponse = await fetch("/getDealerHand")
            .then(response => response.json())
        const playerHandResponse = await fetch("/getPlayerHand")
            .then(response => response.json())

        dealerCards = mapHand(dealerHandResponse)
        playerCards = mapHand(playerHandResponse)

        await updateState()

        const isBJ = await fetch("/checkBlackJack")
            .then(res => res.json())

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
    const drawnCard = await fetch("/playerDraw")
        .then(response => response.json())
    playerCards.push({value: drawnCard.value, rank: drawnCard.rank})
    await updateState()

    const playerBust = await fetch("/isBust")
        .then(res => res.json())

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
function stay() {
    while (dealerScore < 17) {
        dealerCards.push(getRandomCard());
        updateState()
    }

    updateState()

    setTimeout(() => {
        if (dealerScore > 21) {
            alert('Dealer busts! Player wins!');
        } else if (dealerScore > playerScore) {
            alert('Dealer wins!');
        } else if (dealerScore === playerScore) {
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
    dealerCards = [];
    playerCards = [];
    dealerScore = 0;
    playerScore = 0;
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