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

// WebSocket setup
let stompClient = null;

function connect() {
    const socket = new SockJS('/blackjack');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/game', function (message) {
            const game = JSON.parse(message.body);
            updateGameState(game);
        });
        startGame();
    });
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
 * Place bets here in future also
 */
function startGame() {
    stompClient.send("/app/start", {}, {});

    //check for BJ
    fetch("/checkBlackJack")
        .then(res => res.json())
        .then(isBJ => {
            if (isBJ) {
                setTimeout(() => {
                    alert('Player has BlackJack! Player wins!');
                    resetGame();
                }, 100)
            }
        })
}

function hit() {
    stompClient.send("/app/hit", {}, {});

    fetch("/isBust")
        .then(res => res.json())
        .then(isBust => {
            if (isBust) {
                setTimeout(() => {
                    alert('Player busts! Dealer wins!');
                    resetGame();
                }, 100)
            }
        })
}

function stay() {
    stompClient.send("/app/stay", {}, {});

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

function resetGame() {
    gameState.dealerCards = [];
    gameState.playerCards = [];
    gameState.dealerScore = 0;
    gameState.playerScore = 0;
    startGame();
}

hitButton.addEventListener('click', hit);
stayButton.addEventListener('click', stay);

connect()