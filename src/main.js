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
    scene: [Load, Platformer]
}

var cursors;
var levelCoins = {
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0
}

function updateHUD(coinText, keysText, timerText, cam) {
    keysText.setPosition(cam.scrollX + 435,cam.scrollY + 245);
    coinText.setPosition(cam.scrollX + 435, cam.scrollY + 260);
    timerText.setPosition(cam.scrollX + 435, cam.scrollY + 275);
}

const game = new Phaser.Game(config);