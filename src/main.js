"use strict"

let config = {
    parent: 'alieno-game',
    type: Phaser.CANVAS,
    render: {pixelArt: true},
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {x: 0, y: 0}
        }
    },
    width: 1280,
    height: 720,
    scene: [Load, MainMenu, LevelSelect, Controls, Credits, Level2]
}

var cursors;
var levelCoins = {
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0
}

function updateHUD(coinText, keysText, timerText, resumeBTN, exitBTN, cam) {
    keysText.setPosition(cam.scrollX + 435, cam.scrollY + 245);
    coinText.setPosition(cam.scrollX + 435, cam.scrollY + 260);
    timerText.setPosition(cam.scrollX + 435, cam.scrollY + 275);
    resumeBTN.setPosition(cam.scrollX + 435, cam.scrollY + 245);
    exitBTN.setPosition(cam.scrollX + 435, cam.scrollY + 245);
}

const game = new Phaser.Game(config);