package com.casinodemo.engine;

import com.casinodemo.engine.objects.Card;
import com.casinodemo.engine.objects.enums.RANK;
import lombok.Getter;

import java.util.List;
import java.util.Random;

import static com.casinodemo.engine.GameState.calculateHand;
import static com.casinodemo.engine.GameState.isBlackJack;

@Getter
public class Game {
    private GameState state;

    public Game() {
        this.state = new GameState();
    }

    public void start() {
        // Reset
        state.getDealer().clearHand();
        state.getPlayers().forEach(Player::clearHand);
        state.getDeck().shuffleDeck();


        // Init hands and scores
        state.getDealer().getDealerHand().add(state.drawCard());
        state.getDealer().setScore(calculateHand(state.getDealer().getDealerHand()));
        state.getPlayers().forEach(player -> {
                player.getPlayerHand()
                        .addAll((List.of(state.drawCard(), state.drawCard())));
                player.setScore(calculateHand(player.getPlayerHand()));
                });
    }

    public int getDealerScore() {
        return state.getDealer().getScore();
    }

    public void playerDraw(String name) {
        var card = state.drawCard();
        var player = state.getPlayerByName(name).get();
        player.draw(card);
        player.setScore(calculateHand(player.getPlayerHand()));
    }

    public Card dealerDraw() {
        var card = state.drawCard();
        state.getDealer().draw(card);
        state.getDealer().setScore(calculateHand(state.getDealer().getDealerHand()));
        return card;
    }

    public void stay() {
        while (getDealerScore() <= 17) {
            dealerDraw();
        }
    }

    public List<String> checkBlackJack() {
        return state.checkBlackJack();
    }

    public List<String> isBust() {
        return state.isBust();
    }

    public void joinNewPlayer() {
        state.getPlayers().add(new Player(new Random().nextInt(10)));
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

//    public static Integer calculateHand(List<Card> hand) {
//        int sum = hand.stream()
//                .map(Card::value)
//                .reduce(0, Integer::sum);
//
//        long aceCount = hand.stream()
//                .filter(card -> card.rank() == RANK.ACE)
//                .count();
//
//        while (sum > 21 && aceCount > 0) {
//            sum -= 10;
//            aceCount--;
//        }
//
//        return sum;
//    }

//    private void dealerDraw(GameState state) {
//        while (dealerScore <= 17) {
//            dealerHand.add(deck.dealCard());
//            dealerScore = calculateHand(dealerHand);
//        }
//    }

//    private boolean isBust(int playerScore) {
//        return playerScore > 21;
//    }
//
//    public static boolean isBlackJack(List<Card> hand) {
//        return hand.size() == 2 && calculateHand(hand) == 21;
//    }
}
