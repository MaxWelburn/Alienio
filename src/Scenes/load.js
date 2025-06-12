class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        //Textures
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");
        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.image("parallaxMap", "parallax.png");
        this.load.tilemapTiledJSON("level1Set", "level2.tmj");
        this.load.tilemapTiledJSON("level2Set", "level1.tmj");
        this.load.tilemapTiledJSON("level3Set", "level3.tmj");
        this.load.tilemapTiledJSON("level4Set", "level4.tmj");
        this.load.tilemapTiledJSON("level5Set", "level5.tmj");
        //UI
        this.load.image("levelsPNG", "Levels.png");
        this.load.image("creditsPNG", "Alieno_credits.png");
        this.load.image("titlePNG", "Alieno_Title.png");
        this.load.image("controlsPNG", "Controlls.png");
        this.load.image("creditsBTN", "Credits_Button.png");
        this.load.image("controlsBTN", "Controlls_Button.png");
        this.load.image("backBTN", "BackButton.png");
        this.load.image("playBTN", "Play.png");
        this.load.image("resumeBTN", "Resume.png");
        this.load.image("restartBTN", "Restart.png");
        this.load.image("nextBTN", "level_arrow.png");
        this.load.image("exitBTN", "level_exit.png");
        this.load.image("level1", "Level_1_block.png");
        this.load.image("level2", "Level_2_block.png");
        this.load.image("level3", "Level_3_block.png");
        this.load.image("level4", "Level_4_block.png");
        this.load.image("level5", "Level_5_block.png");
        this.load.image("grayKey", "keyGRAY.png");
        this.load.image("colorKey", "keyColor.png");
        this.load.image("pausePNG", "Paused.png");
        this.load.image("boxPNG", "Box.png");
        this.load.image("snowballPNG", "snowball.png");
        //Audio
        this.load.audio("run", [
            "audio/footstep01.ogg",
            "audio/footstep02.ogg",
            "audio/footstep03.ogg",
            "audio/footstep04.ogg",
            "audio/footstep05.ogg",
            "audio/footstep06.ogg"
        ])
        this.load.audio("coins", [
            "audio/handleCoins.ogg",
            "audio/handleCoins2.ogg"
        ])
        this.load.audio("jump1", [
            "audio/cloth1.ogg",
            "audio/cloth2.ogg"
        ])
        this.load.audio("jump2", [
            "audio/cloth3.ogg",
            "audio/cloth4.ogg"
        ])
        this.load.audio("death", [
            "audio/knifeSlice.ogg",
            "audio/knifeSlice2.ogg"
        ])
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

        this.scene.start("mainMenuScene");
    }

    update() {

    }
}