class Credits extends Phaser.Scene {
    constructor() {
        super({ key: 'creditsScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.add.image(width / 2, height / 2, "creditsPNG").setDisplaySize(width, height).setOrigin(0.5);

        const backStyle = {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
        };
        
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
