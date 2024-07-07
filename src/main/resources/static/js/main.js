//TODO: Backend - enums
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const gameState = {
    dealerCards: [],
    playerCards: [],
    dealerScore: 0,
    playerScore: 0,
    players: []
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
        stompClient.subscribe("/topic/players", function (message) {
            const players = JSON.parse(message.body)
            updatePlayers(players);
        })
        setTimeout(() => {
            stompClient.send("/app/join", {}, {})
        }, 300)
        setTimeout(() => {
            startGame()
        }, 500)
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
        .then(BJs => {
            BJs.forEach(playerName => {
                setTimeout(() => alert(`Player ${playerName} has BlackJack!`))
            }, 100)
            // if (isBJ) {
            //     setTimeout(() => {
            //         alert('Player has BlackJack! Player wins!');
            //         // resetGame();
            //     }, 100)
            // }
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

function updatePlayers(players) {
    const playersDiv = document.getElementById("players")
    playersDiv.innerText = ""

    players.forEach(player => {
        const newPlayer = document.createElement("div")
        newPlayer.id = `player ${player.name}`
        const heading = document.createElement("h2");
        heading.innerText = `PLAYER ${player.name}`
        const cardsDiv = document.createElement("div")
        cardsDiv.id = `player-cards-${player.name}`
        cardsDiv.className = "cards"
        const scoreDiv = document.createElement("div")
        scoreDiv.id = `player-score-${player.name}`
        scoreDiv.innerText = "Score: 0"

        newPlayer.appendChild(heading);
        newPlayer.appendChild(cardsDiv)
        newPlayer.appendChild(scoreDiv)

        playersDiv.appendChild(newPlayer)
    })
    // updateUI(players)
}

hitButton.addEventListener('click', hit);
stayButton.addEventListener('click', stay);

connect()