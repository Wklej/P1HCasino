package com.casinodemo;

import com.casinodemo.engine.Game;
import com.casinodemo.engine.objects.Card;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class GameController {

    private int sharedValue = 0;
    private List<String> players = new ArrayList<>();

    private Game game;

    public GameController() {
        game = new Game();
    }

    @MessageMapping("/update")
    @SendTo("/topic/updates")
    public Integer updateValue(Integer newValue) {
        sharedValue = newValue;
        return sharedValue;
    }

    @MessageMapping("/current")
    @SendTo("/topic/updates")
    public Integer getCurrentValue() {
        return sharedValue;
    }

    @MessageMapping("/join")
    @SendTo("/topic/players")
    public List<String> joinGame(String playerName) {
        players.add(playerName);
        return players;
//        template.convertAndSend("/topic/players", players);
    }

    @GetMapping("/players")
    @MessageMapping("/app/players")
    public List<String> getPlayers() {
        return players;
    }

    @GetMapping("/start")
    public void startGame() {
        game.start();
    }

    @GetMapping("/getPlayerScore")
    public int getPlayerScore() {
        return game.getPlayerScore();
    }

    @GetMapping("/getDealerScore")
    public int getDealerScore() {
        return game.getDealerScore();
    }

    @GetMapping("/getPlayerHand")
    public List<Card> getPlayerHand() {
        return game.getPlayerHand();
    }

    @GetMapping("/getDealerHand")
    public List<Card> getDealerHand() {
        return game.getDealerHand();
    }

    @GetMapping("/playerDraw")
    public Card playerDraw() {
        return game.playerDraw();
    }

    @GetMapping("/checkBlackJack")
    public boolean checkBlackJack() {
        return game.checkBlackJack();
    }
}