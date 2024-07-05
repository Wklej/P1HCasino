package com.casinodemo;

import com.casinodemo.engine.Game;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GameController {

//    private List<String> players = new ArrayList<>();

    private Game game;
    private final SimpMessagingTemplate messagingTemplate;

    public GameController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
        game = new Game();
    }

//
//    @MessageMapping("/join")
//    @SendTo("/topic/players")
//    public List<String> joinGame(String playerName) {
//        players.add(playerName);
//        return players;
////        template.convertAndSend("/topic/players", players);
//    }
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
    public boolean checkBlackJack() {
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