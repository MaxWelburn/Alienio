"use strict"

let config = {
    parent: 'alienio-game',
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
    scene: [Load, MainMenu, LevelSelect, Controls, Credits, Level1, Level2, Level3, Level4, Level5]
}

var cursors;
var defaultStats = {
    level1: [0, 0],
    level2: [0, 0],
    level3: [0, 0],
    level4: [0, 0],
    level5: [0, 0]
}


function updateHUD(coinText, keysText, timerText, pauseIMG, resumeBTN, restartBTN, exitBTN, cam) {
    keysText.setPosition(cam.scrollX + 435, cam.scrollY + 245);
    coinText.setPosition(cam.scrollX + 435, cam.scrollY + 260);
    timerText.setPosition(cam.scrollX + 435, cam.scrollY + 275);
    pauseIMG.setPosition(cam.scrollX + 606, cam.scrollY + 20);
    resumeBTN.setPosition(cam.scrollX + 606, cam.scrollY + 10);
    restartBTN.setPosition(cam.scrollX + 606, cam.scrollY + 35);
    exitBTN.setPosition(cam.scrollX + 606, cam.scrollY + 60);
}

const game = new Phaser.Game(config);