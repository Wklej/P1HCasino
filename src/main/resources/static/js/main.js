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
        stompClient.subscribe("/topic/gameResult", function () {
            gameResults()
        })
        stompClient.subscribe("/topic/ready", function (message) {
            const allPlayersReady = JSON.parse(message.body)
            if (allPlayersReady) {
                setTimeout(() => {
                    startGame()
                }, 500)
            }
        })
        setTimeout(() => {
            stompClient.send("/app/join", {}, {})
        }, 300)
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
        fetch(`/isBust?name=${encodeURIComponent(playerName)}`)
            .then(res => res.json())
            .then(isBust => {
                isBust ? console.log("TODO: send stay command + block hit button") : console.log("Player didnt bust...")
            })
    }, 200)
}

function stay(event) {
    const playerName = event.target.id
    // event.target.disabled = true
    stompClient.send("/app/stay", {}, JSON.stringify({playerName: playerName}));
}

function gameResults() {
    setTimeout(() => {
        const result = gameResult()
        alert(` Winners: ${result.winners}
                Losers: ${result.losers}
                Draws: ${result.draws}`)
        resetGame();
    }, 300)
}

function ready(event) {
    var playerName = event.target.id
    stompClient.send("/app/ready", {}, JSON.stringify({playerName: playerName}));
}

function resetGame() {
    gameState.dealerCards = [];
    gameState.playerCards = [];
    gameState.dealerScore = 0;
    gameState.playerScore = 0;
    gameState.players = []
    //resetUI ?
    startGame();
}

connect()