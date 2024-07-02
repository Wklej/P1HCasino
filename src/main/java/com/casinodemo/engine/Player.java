package com.casinodemo.engine;

import com.casinodemo.engine.objects.Card;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Player {
    private List<Card> playerHand;
    private int score;
    private Double balance;
    private boolean isReady;
    private boolean win;

    public Player() {
        playerHand = new ArrayList<>();
    }

    public void clearHand() {
        playerHand.clear();
    }

    public void draw(Card card) {
        playerHand.add(card);
    }
}
