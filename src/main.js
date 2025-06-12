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

//Display esc menu options template
Phaser.Scene.prototype.menuHUD = function() {
    this.resumeBtn = this.add
        .image(180, -30, 'resumeBTN')
        .setScale(0.6)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.resumeBtn.setScale(0.7))
        .on('pointerout', () => this.resumeBtn.setScale(0.6))
        .on('pointerup', () => this.togglePause());
    
    this.restartBtn = this.add
        .image(180, -10, 'restartBTN')
        .setScale(0.6)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.restartBtn.setScale(0.7))
        .on('pointerout', () => this.restartBtn.setScale(0.6))
        .on('pointerup', () => this.scene.restart());
    
    this.exitBtn = this.add
        .image(180, 10, 'exitBTN')
        .setScale(0.6)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.exitBtn.setScale(0.7))
        .on('pointerout', () => this.exitBtn.setScale(0.6))
        .on('pointerup', () => this.scene.start('levelSelect'));
    
    this.pauseMenu.add([ this.pauseIMG, this.resumeBtn, this.restartBtn, this.exitBtn ]);
};

//Updates all ui elements
function updateHUD(coinText, keysText, timerText, pauseIMG, resumeBTN, restartBTN, exitBTN, cam, lvl5) {
    keysText.setPosition(cam.scrollX + 435, cam.scrollY + 245);
    coinText.setPosition(cam.scrollX + 435, cam.scrollY + 260);
    timerText.setPosition(cam.scrollX + 435, cam.scrollY + 275);
    pauseIMG.setPosition(cam.scrollX + 606, cam.scrollY + (lvl5 != null ? -1060 : 20));
    resumeBTN.setPosition(cam.scrollX + 606, cam.scrollY + (lvl5 != null ? -1070 : 10));
    restartBTN.setPosition(cam.scrollX + 606, cam.scrollY + (lvl5 != null ? -1045 : 35));
    exitBTN.setPosition(cam.scrollX + 606, cam.scrollY + (lvl5 != null ? -1020 : 60));
}

const game = new Phaser.Game(config);