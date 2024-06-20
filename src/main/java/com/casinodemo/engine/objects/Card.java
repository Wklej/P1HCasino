package com.casinodemo.engine.objects;


import com.casinodemo.engine.objects.enums.RANK;
import com.casinodemo.engine.objects.enums.SUIT;

public record Card(SUIT suit, RANK rank, int value) {
    @Override
    public String toString() {
        return rank.toString();
    }
}
