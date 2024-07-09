package com.casinodemo;

import com.casinodemo.engine.Game;
import com.casinodemo.engine.Player;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class GameController {
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

    @MessageMapping("/start")
    public void startGame() {
        game.start();
        broadcastGameState();
    }

    @MessageMapping("/hit")
    public void playerHit(@Payload Map<String, String> payload) {
        var playerName = payload.get("playerName");
        game.playerDraw(playerName);
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
    public boolean isBust(String name) {
        return game.isBust(name);
    }

    private void broadcastGameState() {
        messagingTemplate.convertAndSend("/topic/game", game);
    }
}