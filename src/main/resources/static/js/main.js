//TODO: Backend - enums
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const gameState = {
    dealerCards: [],
    dealerScore: 0,
    players: []
};

const dealerCardsDiv = document.getElementById('dealer-cards');
const dealerScoreDiv = document.getElementById('dealer-score');

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
        })
}

function hit(event) {
    const playerName = event.target.id
    stompClient.send("/app/hit", {}, JSON.stringify({playerName: playerName}));

    setTimeout(() => {
        fetch("/isBust")
            .then(res => res.json())
            .then(busts => {
                busts.forEach(playerName => {
                    setTimeout(() => {
                        alert(`Player ${playerName} busts! Dealer wins with ${playerName}!`);
                        // resetGame();
                    }, 100)
                })
            })
    }, 200)
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
    gameState.players = []
    startGame();
}

connect()