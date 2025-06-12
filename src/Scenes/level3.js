class Level3 extends Phaser.Scene {
    constructor() {
        super("level3Scene");
    }

    init() {
        this.ACCELERATION = 1000;
        this.DRAG = 1000;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -300;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 3.0;
        this.canDoubleJump = true;
        //Pause menu
        this.isPaused = false;
        this.pauseStartTime = 0;
        this.pausedDuration = 0;
    }

    create() {
        const { width, height } = this.cameras.main;
        //Level variables
        this.keys = 0;
        this.coins = 0;
        this.startTime = 0;
        this.endTime = 0;
        this.physics.world.drawDebug = false
        this.physics.world.debugGraphic.clear()
        cursors = this.input.keyboard.createCursorKeys();

        //Map
        this.map = this.add.tilemap("level3Set", 18, 18, 0, 0);
        this.tileset = this.map.addTilesetImage("set1", "tilemap_tiles");
        this.parallax = this.add.image(0, 0, "parallaxMap").setDepth(-1).setOrigin(0).setScale(0.75).setScrollFactor(0.25);
        
        //Layers
        this.boxesLayer = this.map.createLayer("Push", this.tileset, 0, 0).setDepth(7);
        this.foregroundLayer = this.map.createLayer("Foreground", this.tileset, 0, 0).setDepth(6);
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0).setDepth(5);
        this.killPartLayer = this.map.createLayer("KillPart", this.tileset, 0, 0).setDepth(4);
        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 0, 0).setDepth(3);
        this.keysLayer = this.map.createLayer("Keys", this.tileset, 0, 0).setDepth(2);
        this.flagLayer = this.map.createLayer("Flag", this.tileset, 0, 0).setDepth(1);
        this.coinsLayer = this.map.createLayer("Coins", this.tileset, 0, 0).setDepth(0);

        //Player
        this.player = this.physics.add.sprite(40, 334, "platformer_characters", "tile_0000.png").setDepth(7);
        this.player.setCollideWorldBounds(true);
        this.player.setMaxVelocity(180, 350).setDisplaySize(16, 16);
        this.player.setFlip(true, false);

        //Collisions
        this.killPartLayer.setCollisionByExclusion([-1]);
        this.groundLayer.setCollisionByExclusion([-1]);
        this.keysLayer.setCollisionByExclusion([-1]);
        this.coinsLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, this.groundLayer);
        this.physics.add.overlap(this.player, this.killPartLayer);
        this.physics.add.overlap(this.player, this.keysLayer);
        this.physics.add.overlap(this.player, this.coinsLayer);
        this.physics.add.overlap(this.player, this.flagLayer);
        this.killPartLayer.setTileIndexCallback([54, 69, 74], this.killPlayer, this);
        this.keysLayer.setTileIndexCallback([28], this.addKey, this);
        this.coinsLayer.setTileIndexCallback([152], this.addCoin, this);
        this.flagLayer.setTileIndexCallback([113], this.reachFlag, this);

        //Camera
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        //Audio
        this.runSound = this.sound.add('run', {loop: true, volume: 0.2});
        this.coinSound = this.sound.add('coins', {loop: false, volume: 0.2});
        this.jumpSound1 = this.sound.add('jump1', {loop: false, volume: 0.2});
        this.jumpSound2 = this.sound.add('jump2', {loop: false, volume: 0.2});
        this.deathSound = this.sound.add('death', {loop: false, volume: 0.2});

        //Particles
        this.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_01.png', 'smoke_02.png', 'smoke_03.png'],
            scale: {start: 0.03, end: 0.1},
            lifespan: 350,
            alpha: {start: 1, end: 0.1}, 
        });

        this.boxesGroup = this.physics.add.group({ 
            allowGravity: false,   // so they don’t fall
            immovable: true        // until we push them
        });




        //Box mechanic
        this.boxesLayer.forEachTile(tile => {
            if (tile.properties?.isMove) {
                const frame = tile.index;// - this.tileset.firstgid;
                const x = tile.getCenterX();
                const y = tile.getCenterY();
                const box = this.boxesGroup.create(x, y, 'boxPNG')
                    .setDepth(this.boxesLayer.depth)
                    .setOrigin(0.5);
                box.body.setSize(tile.width, tile.height);
                box.body.setDragX(800);
                this.boxesLayer.removeTileAt(tile.x, tile.y);
            }
        });
        this.physics.add.collider(this.player,       this.boxesGroup, this.pushBox,       null, this);
        this.physics.add.collider(this.boxesGroup,   this.groundLayer);

        this.boxesGroup?.children.iterate(box => box.setCollideWorldBounds(true));





        //GUI
        const cam = this.cameras.main;
        this.coinText = this.add.text(0, 0, 'Coins: 0', {
            fontSize: '100px',
            stroke: '#00000',
            strokeThickness: 20,
            fontStyle: "bold"
        }).setDepth(2000).setPosition(cam.scrollX, cam.scrollY).setScale(1 / cam.zoom / 3);
        this.keysText = this.add.text(0, 0, 'Keys: 0', {
            fontSize: '100px',
            stroke: '#00000',
            strokeThickness: 20,
            fontStyle: "bold"
        }).setDepth(2000).setPosition(cam.scrollX, cam.scrollY).setScale(1 / cam.zoom / 3);
        this.timerText = this.add.text(0, 0, 'Time: 0:00', {
            fontSize: '100px',
            stroke: '#00000',
            strokeThickness: 20,
            fontStyle: "bold"
        }).setDepth(2000).setPosition(cam.scrollX, cam.scrollY).setScale(1 / cam.zoom / 3);
        
        //Gameplay pause menu
        this.pauseOverlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5)
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(1000)
            .setVisible(false);

        this.pauseMenu = this.add.container(cam.midPoint.x, cam.midPoint.y).setDepth(1001).setVisible(false);
        this.pauseIMG = this.add.image(180, -50, 'pausePNG');
        this.menuHUD();
        this.pauseMenu.add([this.pauseIMG, this.resumeBtn, this.restartBtn, this.exitBtn]);

        this.input.keyboard.on('keydown-ESC', this.togglePause, this);
        this.input.keyboard.on('keydown-R', () => this.scene.restart(), this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {this.runSound.stop()});
        this.events.on(Phaser.Scenes.Events.POST_UPDATE, () => updateHUD(this.coinText, this.keysText, this.timerText, this.pauseIMG, this.resumeBtn, this.restartBtn, this.exitBtn, this.cameras.main), this);
    }

    //Push box mechanic
    pushBox(player, box) {
        if (player.body.touching.right && box.body.touching.left) {
            box.setVelocityX(50);
        }
        else if (player.body.touching.left && box.body.touching.right) {
            box.setVelocityX(-50);
        }
        else {
            box.setVelocityX(0);
        }
    }

    //Pauses the game when hitting esc key
    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.physics.world.pause();
            this.runSound.pause();
            this.pauseStartTime = Date.now();
            this.pauseOverlay.setVisible(true);
            this.pauseMenu.setVisible(true);
        } else {
            this.physics.world.resume();
            if (!this.runSound.isPlaying) this.runSound.play();
            this.pausedDuration += Date.now() - this.pauseStartTime;
            this.pauseOverlay.setVisible(false);
            this.pauseMenu.setVisible(false);
        }
    }

    //Kills player and resets scene
    killPlayer() {
        this.cameras.main.flash(100, 255, 0, 0);
        this.player.setTint(0xff0000);
        this.deathSound.play();
        this.time.delayedCall(50, () => {
            this.scene.restart();
        });
    }

    //Updates key text and var
    addKey(_, tile) {
        this.keysLayer.removeTileAt(tile.x, tile.y, true, true);
        this.keys++;
        this.keysText.setText('Keys: ' + this.keys);
        this.coinSound.play();
    }

    //Updates coin text and var
    addCoin(_, tile) {
        this.coinsLayer.removeTileAt(tile.x, tile.y, true, true);
        this.coins++;
        this.coinText.setText('Coins: ' + this.coins);
        this.coinSound.play();
    }
    
    //Fires when player touches end flag
    reachFlag(player, tile) {
        if (this.keys == 3) {
            //Check and save data
            this.endTime = Math.floor(Date.now() - this.startTime - this.pausedDuration) / 1000;
            const levelStats = window.dataStats.level3;
            levelStats[0] = this.coins > levelStats[0] ? this.coins : levelStats[0];
            levelStats[1] = levelStats[1] == 0 ? this.endTime : (this.endTime < levelStats[1] ? this.endTime : levelStats[1]);
            localStorage.setItem('dataStats', JSON.stringify(window.dataStats));
            this.flagLayer.removeTileAt(tile.x, tile.y, true, true);
            this.physics.pause();
            this.sound.stopAll();
            player.setVelocity(0).anims.stop();
            this.time.delayedCall(120, () => {
                //You Win title
                this.cameras.main.resetFX();
                this.add.text(
                    this.cameras.main.scrollX + 526,
                    this.cameras.main.scrollY + 300,
                    'YOU WIN!',
                    {fontSize: '200px', fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 10}
                ).setDepth(2000).setScale(0.25);

                //All buttons
                const btnContainer = this.add.container(this.cameras.main.scrollX + 640, this.cameras.main.scrollY + 360).setDepth(2000);

                const nextBtn = this.add.image(0, 0, 'nextBTN')
                    .setInteractive({ useHandCursor: true })
                    .on('pointerover', () => nextBtn.setScale(1.1))
                    .on('pointerout', () => nextBtn.setScale(1))
                    .on('pointerup', () => this.scene.start('level4Scene'));

                const restartBtn = this.add.image(0, 30, 'restartBTN')
                    .setInteractive({ useHandCursor: true })
                    .on('pointerover', () => restartBtn.setScale(1.1))
                    .on('pointerout', () => restartBtn.setScale(1))
                    .on('pointerup', () => this.scene.restart());

                const exitBtn = this.add.image(0, 60, 'exitBTN')
                    .setInteractive({ useHandCursor: true })
                    .on('pointerover', () => exitBtn.setScale(1.1))
                    .on('pointerout', () => exitBtn.setScale(1))
                    .on('pointerup', () => this.scene.start('levelSelect'));

                btnContainer.add([ nextBtn, restartBtn, exitBtn ]);
            });
        }
    }

    update(time, delta) {
        //Check if game over
        if (this.endTime != 0 || this.isPaused) return;
        //Movement input handler
        if (cursors.left.isDown) {
            if (this.startTime == 0) this.startTime = Math.floor(Date.now());
            this.player.setAccelerationX(-this.ACCELERATION);
            this.player.resetFlip();
            this.player.anims.play('walk', true);
            this.walking.startFollow(this.player, this.player.displayWidth / 2 - 10, this.player.displayHeight / 2 - 5, false);
            this.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (this.player.body.blocked.down) {
                this.walking.start();
                if (!this.runSound.isPlaying) this.runSound.play();
            } else {
                this.walking.stop();
                if (this.runSound.isPlaying) this.runSound.stop();
            }
        } else if (cursors.right.isDown) {
            if (this.startTime == 0) this.startTime = Math.floor(Date.now());
            this.player.setAccelerationX(this.ACCELERATION);
            this.player.setFlip(true, false);
            this.player.anims.play('walk', true);
            this.walking.startFollow(this.player, this.player.displayWidth / 2 - 10, this.player.displayHeight / 2 - 5, false);
            this.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (this.player.body.blocked.down) {
                this.walking.start();
                if (!this.runSound.isPlaying) this.runSound.play();
            } else {
                this.walking.stop();
                if (this.runSound.isPlaying) this.runSound.stop();
            }
        } else {
            this.player.setAccelerationX(0);
            this.player.setDragX(this.DRAG);
            this.player.anims.play('idle');
            this.walking.stop();
            if (this.runSound.isPlaying) this.runSound.stop();
        }
        //Jump handler
        if (!this.player.body.blocked.down) {
            this.player.anims.play('jump');
        } else {
            this.canDoubleJump = true;
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.canDoubleJump) {
            if (this.startTime == 0) this.startTime = Math.floor(Date.now());
            this.player.body.setVelocityY(this.JUMP_VELOCITY);
            if (!this.player.body.blocked.down) {
                this.canDoubleJump = false;
                this.jumpSound2.play();
            } else {
                this.jumpSound1.play();
            }
            this.walking.start();
        }
        //Timer text
        const elapsedMS = Date.now() - (this.startTime == 0 ? Date.now() : this.startTime - this.pausedDuration);
        const totalSec = Math.floor(elapsedMS / 1000);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        const pad = n => String(n).padStart(2, '0');
        this.timerText.setText(`${pad(mins)}:${pad(secs)}`);
    }
}