package com.casinodemo.engine.objects;

import lombok.Data;

import java.util.List;

@Data
public class Dealer {
    private List<Card> dealerHand;
    private int score;
    private boolean win;

    public void clearHand() {
        dealerHand.clear();
    }
}
