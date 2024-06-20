package com.casinodemo.engine;

import com.casinodemo.engine.objects.Card;
import com.casinodemo.engine.objects.enums.RANK;

import java.util.List;

public class Game {
    private GameState state;

    public void play(int player) {
        var playerState = state.getPlayers().get(player);
        var playerScore = calculateHand(playerState.getPlayerHand());
        var dealerScore = calculateHand(state.getDealerHand());

        if (isBlackJack(playerState.getPlayerHand()) && !isBlackJack(state.getDealerHand())) {
            playerState.setWin(true);
            return;
        }

        if (!isBust(playerScore)) {

        }



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
