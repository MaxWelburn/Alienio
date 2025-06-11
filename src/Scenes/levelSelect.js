class LevelSelect extends Phaser.Scene {
    constructor() {
        super({ key: 'levelSelect' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Title at the top
        const title = this.add.text(width / 2, height * 0.1, 'Levels', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4,
        });
        title.setOrigin(0.5);

        const backStyle = {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
        };
        const backButton = this.add
            .text(10, 10, '← Back', backStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => backButton.setStyle({ backgroundColor: '#555555' }))
            .on('pointerout', () => backButton.setStyle({ backgroundColor: '#000000' }))
            .on('pointerdown', () => {
                this.scene.start('mainMenuScene');
            });

        // Level buttons configuration
        const buttonSize = 100;
        const spacing = 20;
        const totalWidth = buttonSize * 5 + spacing * 4;
        const startX = (width - totalWidth) / 2 + buttonSize / 2;
        const yPos = height * 0.4;

        const buttonTextStyle = {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#FFFFFF',
        };

        for (let i = 0; i < 5; i++) {
            const xPos = startX + i * (buttonSize + spacing);
            
            // Draw a square background for the level button
            const rect = this.add
                .rectangle(xPos, yPos, buttonSize, buttonSize, 0x000000)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => rect.setFillStyle(0x555555))
                .on('pointerout', () => rect.setFillStyle(0x000000))
                .on('pointerdown', () => rect.setFillStyle(0x333333))
                .on('pointerup', () => {
                    this.scene.start('level' + (i + 1) + 'Scene');
                });

            this.add
                .text(xPos, yPos, `${i + 1}`, buttonTextStyle)
                .setOrigin(0.5);
        }
    }
}
