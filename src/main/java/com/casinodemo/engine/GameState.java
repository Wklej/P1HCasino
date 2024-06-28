package com.casinodemo.engine;

import com.casinodemo.engine.objects.Card;
import com.casinodemo.engine.objects.Dealer;
import com.casinodemo.engine.objects.Deck;
import lombok.Data;

import java.util.List;

@Data
public class GameState {
    private Deck deck;
//    private List<Card> dealerHand;
    private Player player;
    private Dealer dealer;
    //TODO: later extend to multiplayer
//    private List<Player> players;
//    private List<Player> waitingPlayers;
    boolean inProgress;

    public GameState() {
        deck = new Deck();
        player = new Player();
        dealer = new Dealer();
    }

    //    public void resetHands() {
//        dealerHand.clear();
//        players.forEach(Player::clearHand);
//    }

//    public void joinWaitingPlayers() {
//        players.addAll(waitingPlayers);
//        waitingPlayers.clear();
//    }

    public Card drawCard() {
        return deck.dealCard();
    }
}
