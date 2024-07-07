function updateGameState(game) {
    gameState.dealerCards = mapHand(game.state.dealer.dealerHand);
    gameState.dealerScore = game.state.dealer.score;

    updatePlayersState(game.state.players)

    if (game.state.players.length !== 0) {
        updateUI(game.state.players);
    }
}

function updatePlayersState(players) {
    for (let i = 0; i < players.length; i++) {
        gameState.players[i] = {hand: mapHand(players[i].playerHand), score: players[i].score}
    }
}

function updateUI(players) {
    dealerScoreDiv.innerText = `Score: ${gameState.dealerScore}`;
    dealerCardsDiv.innerHTML = gameState.dealerCards.map(card => `<div class="card">${card.value}</div>`).join('');

    for (let i = 0; i < players.length; i++) {
        const playerCardsDiv = document.getElementById(`player-cards-${players[i].name}`)
        const playerScoreDiv = document.getElementById(`player-score-${players[i].name}`)
        playerCardsDiv.innerHTML = gameState.players[i].hand.map(card => `<div class="card">${card.value}</div>`).join('');
        playerScoreDiv.innerText = `Score: ${gameState.players[i].score}`;
    }
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

        const hitButton = document.createElement("button")
        hitButton.id = `${player.name}`
        hitButton.addEventListener('click', hit)
        hitButton.innerText = "Hit"

        const stayButton = document.createElement("button")
        stayButton.id = `${player.name}`
        stayButton.addEventListener('click', stay)
        stayButton.innerText = "Stay"

        newPlayer.appendChild(heading);
        newPlayer.appendChild(cardsDiv)
        newPlayer.appendChild(scoreDiv)
        newPlayer.appendChild(hitButton)
        newPlayer.appendChild(stayButton)

        playersDiv.appendChild(newPlayer)
    })
}

function mapHand(hand) {
    return hand.map(card => ({ value: card.value, rank: card.rank }));
}

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
