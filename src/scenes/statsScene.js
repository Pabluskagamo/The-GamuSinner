import Phaser from 'phaser'

export default class SettingScene extends Phaser.Scene {
    constructor() {
        super('stats');
    }

    init(data) {
        this.cameras.main.fadeIn(500);
        this.player = data.player;
        this.wallet = this.player.getWallet();
        this.dmg = data.dmg;
        this.level = data.level;
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
        this.load.spritesheet('coin', './assets/items/coin.png', { frameWidth: 16, frameHeight: 16 })
    }

    create() {
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
            this.scene.resume(this.level);
            this.scene.resume('UIScene');
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

        const coins = this.add.sprite(980, 150, 'coin').setScale(1.6);
        this.actualcoins = this.add.text(995, 140, `X ${this.wallet}`, { fontFamily: 'MedievalSharp-Regular' }).setFontSize(24);
        this.actualcoins.setColor('#856127');

        this.barIndex = [0, 0, 0, 0];
        this.barSpent = [20, 20, 20, 20];

        // LIFEBAR
        const lifebar = this.add.sprite(840, 220, 'lifebar').setScale(1.4);
        this.lifeButton = this.add.image(1040, 227, 'buttonStats').setScale(0.75);
        const lifecoin = this.add.sprite(1010, 227, 'coin').setScale(1.6);
        var numMonedasLife = this.add.text(1025, 218, `X ${this.barSpent[0]}`, { fontFamily: 'MedievalSharp-Regular' }).setFontSize(17);
        this.lifeButton.setInteractive({ cursor: 'pointer' });

        this.lifeButton.on('pointerover', function (pointer) {
            this.setTint(0x856127);
        });

        this.lifeButton.on('pointerout', function (pointer) {
            this.clearTint();
        });

        this.lifeButton.on('pointerdown', () => {
            this.aumentarBar(this.lifeButton, 0, numMonedasLife, lifebar);
            this.events.emit('incrementLife', this.player.getHp() + 1);
            console.log('INCREMENTAR')
        });

        // STRONGBAR
        const strongbar = this.add.sprite(840, 320, 'strongbar').setScale(1.4);
        this.strongButton = this.add.image(1040, 327, 'buttonStats').setScale(0.75);
        const strongcoin = this.add.sprite(1010, 327, 'coin').setScale(1.6);
        var numMonedasStrong = this.add.text(1025, 318, `X ${this.barSpent[1]}`, { fontFamily: 'MedievalSharp-Regular' }).setFontSize(17);
        this.strongButton.setInteractive({ cursor: 'pointer' });

        this.strongButton.on('pointerover', function (pointer) {
            this.setTint(0x856127);
        });

        this.strongButton.on('pointerout', function (pointer) {
            this.clearTint();
        });

        this.strongButton.on('pointerdown', () => {
            this.aumentarBar(this.strongButton, 1, numMonedasStrong, strongbar);
            this.dmg = this.dmg + 10;
            this.events.emit('incrementStrong', this.dmg);
        });

        // SPEEDBAR
        const speedbar = this.add.sprite(840, 420, 'speedbar').setScale(1.4);
        this.speedButton = this.add.image(1040, 427, 'buttonStats').setScale(0.75);
        const speedcoin = this.add.sprite(1010, 427, 'coin').setScale(1.6);
        var numMonedasSpeed = this.add.text(1025, 418, `X ${this.barSpent[2]}`, { fontFamily: 'MedievalSharp-Regular' }).setFontSize(17);
        this.speedButton.setInteractive({ cursor: 'pointer' });

        this.speedButton.on('pointerover', function (pointer) {
            this.setTint(0x856127);
        });

        this.speedButton.on('pointerout', function (pointer) {
            this.clearTint();
        });

        this.speedButton.on('pointerdown', () => {
            this.aumentarBar(this.speedButton, 2, numMonedasSpeed, speedbar);
            this.events.emit('incrementSpeed', this.player.getSpeed() + 15);
        });

        // CADENCEBAR
        const cadencebar = this.add.sprite(840, 520, 'cadencebar').setScale(1.4);
        this.cadenceButton = this.add.image(1040, 527, 'buttonStats').setScale(0.75);
        const cadencecoin = this.add.sprite(1010, 527, 'coin').setScale(1.6);
        var numMonedasCadence = this.add.text(1025, 518, `X ${this.barSpent[3]}`, { fontFamily: 'MedievalSharp-Regular' }).setFontSize(17);
        this.cadenceButton.setInteractive({ cursor: 'pointer' });

        this.cadenceButton.on('pointerover', function (pointer) {
            this.setTint(0x856127);
        });

        this.cadenceButton.on('pointerout', function (pointer) {
            this.clearTint();
        });

        this.cadenceButton.on('pointerdown', () => {
            this.aumentarBar(this.cadenceButton, 3, numMonedasCadence, cadencebar);
            this.events.emit('incrementCadence', this.player.getCadence() - 50);
        });

        this.levelGame = this.scene.get(this.level);
        this.levelGame.events.on('passLevel', function (level) {
            this.level = level;
        }, this);
    }

    aumentarBar(button, index, numMonedas, bar) {
        if(this.barIndex[index] !== 3){
            this.barIndex[index] = this.barIndex[index] + 1;

            bar.setFrame(this.barIndex[index]);

            this.wallet = this.wallet - this.barSpent[index];

            this.barSpent[index] = this.barSpent[index] * 10;

            this.events.emit('spentcoins', this.wallet);

            if(this.barIndex[index] !== 3){
                numMonedas.setText(`X ${this.barSpent[index]}`);
            }else{
                numMonedas.setText(`X MAX`);
            }
        }
        else{
            button.setInteractive(false);
        }
    }

    update(t) {
        if (this.e.isDown) {
            this.scene.resume(this.level);
            this.scene.resume('UIScene');
            this.scene.sleep('stats');
        }
        this.actualcoins.setText(`X ${this.wallet}`);
        let i = 0;
        for(let spent of this.barSpent){
            if(i === 0){
                if(this.wallet < spent){
                    this.lifeButton.disableInteractive().setAlpha(0.5);
                }else{
                    this.lifeButton.setInteractive({ cursor: 'pointer' });
                    this.lifeButton.on('pointerover', function (pointer) {
                        this.setTint(0x856127);
                    });
                    this.lifeButton.on('pointerout', function (pointer) {
                        this.clearTint();
                    });
                }
            }else if(i === 1){
                if(this.wallet < spent){
                    this.strongButton.disableInteractive().setAlpha(0.5);
                }else{
                    this.strongButton.setInteractive({ cursor: 'pointer' });
                    this.strongButton.on('pointerover', function (pointer) {
                        this.setTint(0x856127);
                    });
                    this.strongButton.on('pointerout', function (pointer) {
                        this.clearTint();
                    });
                }
            }else if(i === 2){
                if(this.wallet < spent){
                    this.speedButton.disableInteractive().setAlpha(0.5);
                }else{
                    this.speedButton.setInteractive({ cursor: 'pointer' });
                    this.speedButton.on('pointerover', function (pointer) {
                        this.setTint(0x856127);
                    });
                    this.speedButton.on('pointerout', function (pointer) {
                        this.clearTint();
                    });
                }
            }else{
                if(this.wallet < spent){
                    this.cadenceButton.disableInteractive().setAlpha(0.5);
                }else{
                    this.cadenceButton.setInteractive({ cursor: 'pointer' });
                    this.cadenceButton.on('pointerover', function (pointer) {
                        this.setTint(0x856127);
                    });
                    this.cadenceButton.on('pointerout', function (pointer) {
                        this.clearTint();
                    });
                }
            }
            i++;
        }
    }

}