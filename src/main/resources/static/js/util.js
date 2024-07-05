function updateGameState(game) {
    gameState.dealerCards = mapHand(game.dealerHand);
    gameState.playerCards = mapHand(game.playerHand);
    gameState.dealerScore = game.dealerScore;
    gameState.playerScore = game.playerScore;
    updateUI();
}

function updateUI() {
    dealerScoreDiv.innerText = `Score: ${gameState.dealerScore}`;
    playerScoreDiv.innerText = `Score: ${gameState.playerScore}`;

    dealerCardsDiv.innerHTML = gameState.dealerCards.map(card => `<div class="card">${card.value}</div>`).join('');
    playerCardsDiv.innerHTML = gameState.playerCards.map(card => `<div class="card">${card.value}</div>`).join('');
}

function mapHand(hand) {
    return hand.map(card => ({ value: card.value, rank: card.rank }));
}
