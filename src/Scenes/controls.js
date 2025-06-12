class Controls extends Phaser.Scene {
    constructor() {
        super({ key: 'controlsScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.add.image(width / 2, height / 2, "controlsPNG").setDisplaySize(width, height).setOrigin(0.5);
    
        const backButton = this.add.image(70, height - 35, 'backBTN')
            .setScale(2)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => backButton.setScale(2.1))
            .on('pointerout', () => backButton.setScale(2))
            .on('pointerup', () => {
                this.scene.start('mainMenuScene');
            });
    }
}
