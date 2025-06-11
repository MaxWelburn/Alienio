class Level1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }

    init() {
        this.ACCELERATION = 1000;
        this.DRAG = 1000;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -300;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 3.0;
        this.canDoubleJump = true;
    }

    create() {
        console.log(levelCoins.level2);
        //Level variables
        this.keys = 0;
        this.coins = 0;
        this.startTime = Math.floor(Date.now());
        this.endTime = 0;
        this.physics.world.drawDebug = false
        this.physics.world.debugGraphic.clear()
        cursors = this.input.keyboard.createCursorKeys();

        //Map
        this.map = this.add.tilemap("level1Set", 18, 18, 0, 0);
        this.tileset = this.map.addTilesetImage("set1", "tilemap_tiles");
        this.parallax = this.add.image(0, 0, "parallaxMap").setDepth(-1).setOrigin(0).setScale(0.75).setScrollFactor(0.25);
        
        //Layers
        this.foregroundLayer = this.map.createLayer("Foreground", this.tileset, 0, 0).setDepth(6);
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0).setDepth(5);
        this.killPartLayer = this.map.createLayer("KillPart", this.tileset, 0, 0).setDepth(4);
        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 0, 0).setDepth(3);
        this.keysLayer = this.map.createLayer("Keys", this.tileset, 0, 0).setDepth(2);
        this.flagLayer = this.map.createLayer("Flag", this.tileset, 0, 0).setDepth(1);
        this.coinsLayer = this.map.createLayer("Coins", this.tileset, 0, 0).setDepth(0);

        //Player
        this.player = this.physics.add.sprite(40, 320, "platformer_characters", "tile_0000.png").setDepth(7);
        this.player.setCollideWorldBounds(true);
        this.player.setMaxVelocity(180, 350).setDisplaySize(16, 16);

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
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {this.runSound.stop()});
        this.events.on(Phaser.Scenes.Events.POST_UPDATE, () => updateHUD(this.coinText, this.keysText, this.timerText, this.cameras.main), this);
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
            levelCoins.level2 = this.coins;
            this.endTime = Math.floor(Date.now());
            this.flagLayer.removeTileAt(tile.x, tile.y, true, true);
            this.physics.pause();
            this.sound.stopAll();
            player.setVelocity(0).anims.stop();
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.add.text(
                    this.cameras.main.midPoint.x,
                    this.cameras.main.midPoint.y,
                    'YOU WIN!',
                    {fontSize: '32px', color: '#ffffff'}
                ).setOrigin(0.5).setScrollFactor(0);
            });
        }
    }

    update() {
        //Check if game over
        if (this.endTime != 0) return;
        //Movement input handler
        if (cursors.left.isDown) {
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
        let elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.timerText.setText("Timer: " + `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`);
    }
}