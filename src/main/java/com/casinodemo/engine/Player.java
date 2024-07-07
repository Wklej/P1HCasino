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
    private String name;

    public Player() {
        playerHand = new ArrayList<>();
    }

    public Player(int name) {
        playerHand = new ArrayList<>();
        this.name = String.valueOf(name);
    }

    public void clearHand() {
        playerHand.clear();
    }

    public void draw(Card card) {
        playerHand.add(card);
    }
}
