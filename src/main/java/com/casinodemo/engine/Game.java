package com.casinodemo.engine;

import com.casinodemo.engine.objects.Card;
import com.casinodemo.engine.objects.enums.RANK;
import lombok.Getter;

import java.util.List;

@Getter
public class Game {
    private GameState state;

    public Game() {
        this.state = new GameState();
    }

    public void start() {
        // Reset hands
        state.getPlayer().clearHand();
        state.getDealer().clearHand();
        state.getDeck().shuffleDeck();

        // Init hands
        state.getPlayer().getPlayerHand().addAll(List.of(state.drawCard(), state.drawCard()));
        state.getDealer().getDealerHand().add(state.drawCard());

        // Calculate scores
        state.getPlayer().setScore(calculateHand(state.getPlayer().getPlayerHand()));
        state.getDealer().setScore(calculateHand(state.getDealer().getDealerHand()));
    }

    public int getPlayerScore() {
        return state.getPlayer().getScore();
    }

    public int getDealerScore() {
        return state.getDealer().getScore();
    }

    public List<Card> getPlayerHand() {
        return state.getPlayer().getPlayerHand();
    }

    public List<Card> getDealerHand() {
        return state.getDealer().getDealerHand();
    }

    public Card playerDraw() {
        var card = state.drawCard();
        state.getPlayer().draw(card);
        state.getPlayer().setScore(calculateHand(state.getPlayer().getPlayerHand()));
        return card;
    }

    public void play(int player) {
//        var playerState = state.getPlayers().get(player);
//        var playerScore = calculateHand(playerState.getPlayerHand());
//        var dealerScore = calculateHand(state.getDealerHand());
//
//        if (isBlackJack(playerState.getPlayerHand()) && !isBlackJack(state.getDealerHand())) {
//            playerState.setWin(true);
//            return;
//        }
//
//        if (!isBust(playerScore)) {

//        }



//        this.playerScore = calculateHand(playerHand);
//        this.dealerScore = calculateHand(dealerHand);

//        while (strategy.test(playerHand) && !isBlackJack(playerHand)) {
//            playerDraw();
//        }
//
//        if (isBlackJack(playerHand) && !isBlackJack(dealerHand)) {
//            return new Result("PLAYER", playerScore, dealerScore, playerHand, dealerHand);
//        }
//
//        if (!isBust(playerScore)) {
//            dealerDraw();
//        } else {
//            return new Result("DEALER", playerScore, dealerScore, playerHand, dealerHand);
//        }
//
//        return new Result(checkWinner(), playerScore, dealerScore, playerHand, dealerHand);
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

//    private void dealerDraw(GameState state) {
//        while (dealerScore <= 17) {
//            dealerHand.add(deck.dealCard());
//            dealerScore = calculateHand(dealerHand);
//        }
//    }

    private boolean isBust(int playerScore) {
        return playerScore > 21;
    }

    public static boolean isBlackJack(List<Card> hand) {
        return hand.size() == 2 && calculateHand(hand) == 21;
    }
}
