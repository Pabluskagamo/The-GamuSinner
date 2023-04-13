import Phaser from 'phaser'

export default class SettingScene extends Phaser.Scene {
    constructor() {
        super('stats');
    }

    init() {
        this.cameras.main.fadeIn(500);
    }

    preload() {
        this.load.image('background_stats', './img/libro.png');
        this.load.spritesheet('bigMeiga', './assets/enemies/MeigaSpritesheet.png', { frameWidth: 1036, frameHeight: 1200 });
        this.load.spritesheet('lifebar', './assets/statusbars/LifeBar.png', { frameWidth: 256, frameHeight: 64 });
        this.load.spritesheet('strongbar', './assets/statusbars/StrongBar.png', { frameWidth: 256, frameHeight: 64 });
        this.load.spritesheet('speedbar', './assets/statusbars/SpeedBar.png', { frameWidth: 256, frameHeight: 64 });
        this.load.spritesheet('cadencebar', './assets/statusbars/CadenceBar.png', { frameWidth: 256, frameHeight: 64 });
        this.load.image('buttonStats', './assets/ui/Statsbutton.png');
        this.load.image('closeButton', './assets/ui/CloseButton.png');

    }

    create(data) {
        // BACKGROUND
        this.add.image(40, 0, 'background_stats').setOrigin(0, 0).setScale(0.86);

        const closeButton = this.add.image(1070, 80, 'closeButton');
        closeButton.setInteractive({ cursor: 'pointer' });

		closeButton.on('pointerover', function (pointer) {
			this.setTint(0x856127);
		});

		closeButton.on('pointerout', function (pointer) {
			this.clearTint();
		});

		closeButton.on('pointerdown', () => {
            this.scene.resume('level');
            this.scene.resume('UIScene');
			this.scene.pause('stats');
            this.scene.sleep('stats');
        });

        this.e = this.input.keyboard.addKey('E');

        // MEIGA
        const meiga = this.add.sprite(330, 330, 'bigMeiga').setScale(0.4);
        this.anims.create({
            key: 'meigaMovement',
            frames: this.anims.generateFrameNumbers('bigMeiga', { start: 0, end: 8 }),
            frameRate: 5,
            repeat: -1
        });
        meiga.play('meigaMovement');

        const lifebar = this.add.sprite(840, 220, 'lifebar').setScale(1.4);
        const lifeButton = this.add.image(1040, 227, 'buttonStats').setScale(0.75);
        const strongbar = this.add.sprite(840, 320, 'strongbar').setScale(1.4);
        const strongButton = this.add.image(1040, 327, 'buttonStats').setScale(0.75);
        const speedbar = this.add.sprite(840, 420, 'speedbar').setScale(1.4);
        const speedButton = this.add.image(1040, 427, 'buttonStats').setScale(0.75);
        const cadencebar = this.add.sprite(840, 520, 'cadencebar').setScale(1.4);
        const cadenceButton = this.add.image(1040, 527, 'buttonStats').setScale(0.75);
    }

    update(t){
        if (this.e.isDown){
            this.scene.resume('level');
            this.scene.resume('UIScene');
			this.scene.pause('stats');
            this.scene.sleep('stats');
        }
    }
}