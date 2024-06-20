package com.casinodemo.engine;

import com.casinodemo.engine.objects.Card;
import lombok.Data;

import java.util.List;

@Data
public class GameState {
    private List<Card> dealerHand;
    private List<Player> players;
    private List<Player> waitingPlayers;
    boolean inProgress;

    public void resetHands() {
        dealerHand.clear();
        players.forEach(Player::clearHand);
    }

    public void joinWaitingPlayers() {
        players.addAll(waitingPlayers);
        waitingPlayers.clear();
    }
}
