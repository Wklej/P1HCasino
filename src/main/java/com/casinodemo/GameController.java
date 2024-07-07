package com.casinodemo;

import com.casinodemo.engine.Game;
import com.casinodemo.engine.Player;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GameController {

//    private List<String> players = new ArrayList<>();

    private Game game;
    private final SimpMessagingTemplate messagingTemplate;

    public GameController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
        game = new Game();
    }

    @MessageMapping("/join")
    @SendTo("/topic/players")
    public List<Player> joinGame() {
        game.joinNewPlayer();
        return game.getState().getPlayers();
    }
//
//    @GetMapping("/players")
//    @MessageMapping("/app/players")
//    public List<String> getPlayers() {
//        return players;
//    }

    @MessageMapping("/start")
    public void startGame() {
        game.start();
        broadcastGameState();
    }

    @MessageMapping("/hit")
    public void playerHit() {
        game.playerDraw();
        broadcastGameState();
    }

    @MessageMapping("/stay")
    public void playerStay() {
        game.stay();
        broadcastGameState();
    }

    @GetMapping("/checkBlackJack")
    public List<String> checkBlackJack() {
        return game.checkBlackJack();
    }

    @GetMapping("/isBust")
    public boolean isBust() {
        return game.isBust();
    }

    private void broadcastGameState() {
        messagingTemplate.convertAndSend("/topic/game", game);
    }
}