package com.casinodemo.engine;

import com.casinodemo.engine.objects.Card;
import com.casinodemo.engine.objects.Dealer;
import com.casinodemo.engine.objects.Deck;
import com.casinodemo.engine.objects.enums.RANK;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Predicate;

@Data
public class GameState {
    private Deck deck;
    //TODO: Player and Dealer class poly
    private Player player; //TODO: to remove
    private Dealer dealer;
    //TODO: later extend to multiplayer
    private List<Player> players;
//    private List<Player> waitingPlayers;
    boolean inProgress;

    public GameState() {
        deck = new Deck();
        dealer = new Dealer();
        player = new Player();
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

    public List<String> checkBlackJack() {
        var BJs = new ArrayList<String>();
        BJs.addAll(players.stream()
                .filter(hasBlackJack())
                .map(Player::getName)
                .toList());
//        players.forEach(player -> {
//            if (isBlackJack(getPlayerByName(player.getName()).get().getPlayerHand())
//                    && !isBlackJack(dealer.getDealerHand())) {
//                BJs.add(player.getName());
//            }
//        });

//        return isBlackJack(getPlayerByName(name).get().getPlayerHand())
//                && !isBlackJack(dealer.getDealerHand());
        return BJs;
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

    private Optional<Player> getPlayerByName(String name) {
        return players.stream()
                .filter(player -> Objects.equals(player.getName(), name))
                .findFirst();
    }

    private Predicate<Player> hasBlackJack() {
        return player -> isBlackJack(getPlayerByName(player.getName()).get().getPlayerHand())
                && !isBlackJack(dealer.getDealerHand());
    }
}
