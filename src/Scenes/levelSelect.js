class LevelSelect extends Phaser.Scene {
    constructor() {
        super({ key: 'levelSelect' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.add.image(width / 2, height / 2, "levelsPNG").setDisplaySize(width, height).setOrigin(0.5);

        const backButton = this.add.image(70, height - 35, 'backBTN')
            .setScale(2)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => backButton.setScale(2.1))
            .on('pointerout', () => backButton.setScale(2))
            .on('pointerup', () => {
                this.scene.start('mainMenuScene');
        });

        const timeStyle = {
            fontFamily: 'Arial',
            fontSize: '200px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 25,
            fontStyle: 'bold'
        };

        const storedData = localStorage.getItem('dataStats');
        window.dataStats = storedData ? JSON.parse(storedData) : defaultStats;

        for (let i = 0; i < 5; i++) {
            //Button setup
            const xPos = ((width - 660) / 2 + 100 / 2) + i * 140;
            const theLevel = this.add.image(xPos, height * 0.5, 'level' + (i + 1))
                .setInteractive({ useHandCursor: true })
                .setScale(3)
                .on('pointerover', () => theLevel.setScale(3.1))
                .on('pointerout', () => theLevel.setScale(3))
                .on('pointerup', () => {
                    this.scene.start('level' + (i + 1) + 'Scene');
            });
            
            //Coins/stars display
            const levelStats = window.dataStats['level' + (i + 1)];
            for (let s = 0; s < 3; s++) {
                const starX = xPos - 40 + s * 40;
                const starY = (height * 0.5) + 100 / 2 + 40;
                this.add.image(starX, starY, 'grayKey').setScale(3).setOrigin(0.5);
                if (levelStats[0] > s) {
                    this.add.image(starX, starY, 'colorKey').setScale(3).setOrigin(0.5);
                }
            }

            //Time display
            if (levelStats[0] > 0) {
                console.log(levelStats);
                const seconds = Math.floor(levelStats[1]);
                const ms = Math.floor((levelStats[1] - seconds) * 1000);
                const timeStr = `${String(seconds).padStart(2, '0')}:${String(ms).padStart(2, '0')}`;
                this.add.text(xPos, height * 0.5 + 100 / 2 + 80, timeStr, timeStyle).setOrigin(0.5).setScale(0.18);
            }
        }
    }
}