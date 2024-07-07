function updateGameState(game) {
    gameState.dealerCards = mapHand(game.dealerHand);
    gameState.playerCards = mapHand(game.playerHand);
    gameState.dealerScore = game.dealerScore;
    gameState.playerScore = game.playerScore;

    if (game.state.players.length !== 0){
        updateUI(game.state.players);
    }
}

function updateUI(players) {
    dealerScoreDiv.innerText = `Score: ${gameState.dealerScore}`;
    dealerCardsDiv.innerHTML = gameState.dealerCards.map(card => `<div class="card">${card.value}</div>`).join('');

    players.forEach(player => {
        const playerCardsDiv = document.getElementById(`player-cards-${player.name}`)
        const playerScoreDiv = document.getElementById(`player-score-${player.name}`)
        playerCardsDiv.innerHTML = gameState.playerCards.map(card => `<div class="card">${card.value}</div>`).join('');
        playerScoreDiv.innerText = `Score: ${gameState.playerScore}`;
    })

    // playerScoreDiv.innerText = `Score: ${gameState.playerScore}`;
    // playerCardsDiv.innerHTML = gameState.playerCards.map(card => `<div class="card">${card.value}</div>`).join('');
}

function mapHand(hand) {
    return hand.map(card => ({ value: card.value, rank: card.rank }));
}
