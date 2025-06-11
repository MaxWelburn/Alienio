class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenuScene");
    }

    create() {
        const { width, height } = this.cameras.main;

        // Title text at the top
        this.add.image(width / 2, height / 2, "titlePNG").setDisplaySize(width, height).setOrigin(0.5);

        // Button style
        const buttonStyle = {
            fontFamily: 'Arial',
            fontSize: '1200px',
            color: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            align: 'center',
            fontStyle: "bold"
        };

        // Play Button
        const playButton = this.add.image(width / 2, height * 0.45, 'playBTN')
            .setOrigin(0.5)
            .setScale(3)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => playButton.setScale(3.1))
            .on('pointerout', () => playButton.setScale(3))
            .on('pointerup', () => {
                this.scene.start('levelSelect');
            });

        // Controls Button
        const controlsButton = this.add.image(width / 2, height * 0.575, 'controlsBTN')
            .setOrigin(0.5)
            .setScale(3)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => controlsButton.setScale(3.1))
            .on('pointerout', () => controlsButton.setScale(3))
            .on('pointerup', () => {
                this.scene.start('controlsScene');
            });

        // Credits Button
        const creditsButton = this.add.image(width / 2, height * 0.7, 'creditsBTN')
            .setOrigin(0.5)
            .setScale(3)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => creditsButton.setScale(3.1))
            .on('pointerout', () => creditsButton.setScale(3))
            .on('pointerup', () => {
                this.scene.start('creditsScene');
            });
    }
}
