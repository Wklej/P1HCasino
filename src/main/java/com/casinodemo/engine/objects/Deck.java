package com.casinodemo.engine.objects;

import com.casinodemo.engine.objects.enums.RANK;
import com.casinodemo.engine.objects.enums.SUIT;
import lombok.Getter;

import java.util.*;


public class Deck {
    @Getter
    private final List<Card> cards = new ArrayList<>();
    private final Map<RANK, Integer> cardValues = Map.ofEntries(
            Map.entry(RANK.TWO, 2), Map.entry(RANK.THREE, 3), Map.entry(RANK.FOUR, 4),
            Map.entry(RANK.FIVE, 5), Map.entry(RANK.SIX, 6), Map.entry(RANK.SEVEN, 7),
            Map.entry(RANK.EIGHT, 8), Map.entry(RANK.NINE, 9), Map.entry(RANK.TEN, 10),
            Map.entry(RANK.JACK, 10), Map.entry(RANK.QUEEN, 10), Map.entry(RANK.KING, 10),
            Map.entry(RANK.ACE, 11)
    );

//    public Deck() {
//        shuffleDeck();
//    }

    public void shuffleDeck() {
        cards.clear();
        Arrays.stream(SUIT.values())
                .forEach(suit ->
                        cardValues.forEach((k, v) ->
                                cards.add(new Card(suit, k, v))));

        Collections.shuffle(cards);
    }

    public Card dealCard() {
        System.out.println(cards.size());
        return cards.removeFirst();
    }
}
