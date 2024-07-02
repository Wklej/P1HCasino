package com.casinodemo.engine.objects;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Dealer {
    private List<Card> dealerHand;
    private int score;
    private boolean win;

    public Dealer() {
        dealerHand = new ArrayList<>();
    }

    public void clearHand() {
        dealerHand.clear();
    }
}
