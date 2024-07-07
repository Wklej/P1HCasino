function updateGameState(game) {
    gameState.dealerCards = mapHand(game.dealerHand);
    gameState.playerCards = mapHand(game.playerHand);
    gameState.dealerScore = game.dealerScore;
    gameState.playerScore = game.playerScore;

    updatePlayersState(game.state.players)

    if (game.state.players.length !== 0) {
        updateUI(game.state.players);
    }
}

function updatePlayersState(players) {
    for (let i = 0; i < players.length; i++) {
        gameState.players[i] = {hand: mapHand(players[i].playerHand), score: players[i].score}
    }
    // players.forEach(player => {
    //     gameState.players.push({hand: mapHand(player.playerHand), score: player.score})
    // })
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

    // players.forEach(player => {
    //     const playerCardsDiv = document.getElementById(`player-cards-${player.name}`)
    //     const playerScoreDiv = document.getElementById(`player-score-${player.name}`)
    //     playerCardsDiv.innerHTML = gameState.playerCards.map(card => `<div class="card">${card.value}</div>`).join('');
    //     playerScoreDiv.innerText = `Score: ${gameState.playerScore}`;
    // })

    // playerScoreDiv.innerText = `Score: ${gameState.playerScore}`;
    // playerCardsDiv.innerHTML = gameState.playerCards.map(card => `<div class="card">${card.value}</div>`).join('');
}

function mapHand(hand) {
    return hand.map(card => ({ value: card.value, rank: card.rank }));
}
