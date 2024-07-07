package com.casinodemo.engine;

import com.casinodemo.engine.objects.Card;
import com.casinodemo.engine.objects.Dealer;
import com.casinodemo.engine.objects.Deck;
import com.casinodemo.engine.objects.enums.RANK;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class GameState {
    private Deck deck;
    //TODO: Player and Dealer class poly
    private Player player;
    private Dealer dealer;
    //TODO: later extend to multiplayer
    private List<Player> players;
//    private List<Player> waitingPlayers;
    boolean inProgress;

    public GameState() {
        deck = new Deck();
        player = new Player();
        dealer = new Dealer();
        players = new ArrayList<>();
    }

//        public void resetHands() {
//        dealerHand.clear();
//        players.forEach(Player::clearHand);
//    }
//
//    public void joinWaitingPlayers() {
//        players.addAll(waitingPlayers);
//        waitingPlayers.clear();
//    }

    public Card drawCard() {
        return deck.dealCard();
    }

    public boolean checkBlackJack() {
        return isBlackJack(player.getPlayerHand()) && !isBlackJack(dealer.getDealerHand());
    }

    public static Integer calculateHand(List<Card> hand) {
        int sum = hand.stream()
                .map(Card::value)
                .reduce(0, Integer::sum);

        long aceCount = hand.stream()
                .filter(card -> card.rank() == RANK.ACE)
                .count();

        while (sum > 21 && aceCount > 0) {
            sum -= 10;
            aceCount--;
        }

        return sum;
    }

    public boolean isBust(int playerScore) {
        return playerScore > 21;
    }

    public static boolean isBlackJack(List<Card> hand) {
        return hand.size() == 2 && calculateHand(hand) == 21;
    }
}
