package com.casinodemo.engine;

import com.casinodemo.engine.objects.Card;
import lombok.Getter;

import java.util.List;
import java.util.Random;

import static com.casinodemo.engine.GameState.calculateHand;

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

    public boolean isBust(String name) {
        return state.isBust(name);
    }

    public void joinNewPlayer() {
        state.getPlayers().add(new Player(new Random().nextInt(10)));
    }
}
