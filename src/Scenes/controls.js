class Controls extends Phaser.Scene {
    constructor() {
        super({ key: 'controlsScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.add.image(width / 2, height / 2, "controlsPNG").setDisplaySize(width, height).setOrigin(0.5);
    
        const backButton = this.add.image(120, height - 25, 'backBTN')
            .setScale(1.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => backButton.setScale(1.6))
            .on('pointerout', () => backButton.setScale(1.5))
            .on('pointerup', () => {
                this.scene.start('mainMenuScene');
            });
    }
}
