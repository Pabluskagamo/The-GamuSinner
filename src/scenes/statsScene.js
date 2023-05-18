import Phaser from 'phaser'
import dialogBox from '../dialogs/dialogBox';
import dialogsMeiga from '../dialogs/dialogsMeiga';
import LevelScene from './levelScene';

// ESCENA DE LAS ESTADISTICAS DE LA MEIGA

export default class StatsScene extends Phaser.Scene {
    constructor() {
        super('stats');
        this.isTransitioning = false;
    }

    // INTRODUCES TODA LA INFORMACION NECESARIA DEL PERSONAJE
    init(data) {
        this.cameras.main.fadeIn(500);
        this.player = data.playerData;
        this.wallet = this.player.coins;
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
        this.load.image('dialog2', './assets/ui/dialogBox 2.png');
        this.load.image('dialog', './assets/ui/dialogBox.png');
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
            this.scene.sleep();
            this.dialogBox.clearText();
            
            if (!this.isTransitioning) {
                this.levelGame.abrirpuertasFirstTalk()
			}
            this.isTransitioning = true;
        });

        this.e = this.input.keyboard.addKey('E');
        this.q = this.input.keyboard.addKey('Q')

        // MEIGA
        this.meiga = this.add.sprite(330, 330, 'bigMeiga').setScale(0.4);
        this.anims.create({
            key: 'meigaMovement',
            frames: this.anims.generateFrameNumbers('bigMeiga', { start: 0, end: 8 }),
            frameRate: 5,
            repeat: -1
        });
        this.meiga.play('meigaMovement');

        // MONEDAS QUE TIENES
        const coins = this.add.sprite(980, 150, 'coin').setScale(1.6);
        this.actualcoins = this.add.text(995, 140, `X ${this.wallet}`, { fontFamily: 'MedievalSharp-Regular' }).setFontSize(24);
        this.actualcoins.setColor('#856127');

        //DIALOGOS DE LA MEIGA
        this.dialogBox = new dialogBox(this, 120, 525, 460);
        this.dialogBox.setFontSize(18);
        this.dialogBox.clearText();
        this.dialogBox.setDepth(2);

        const dialog = this.add.image(347, 570, 'dialog').setScale(1.05);
        dialog.setDepth(1);

        this.skipkey = this.add.sprite(560, 600, 'q_key').setScale(1.3)

        this.anims.create({
			key: 'Q_Press',
			frames: this.anims.generateFrameNumbers('q_key', { start: 0, end: 2 }),
			frameRate: 2,
			repeat: -1
		});

		this.skipkey.play('Q_Press');
        this.skipkey.setVisible(false);
        this.skipkey.setDepth(2);

        // INICIALIZACION DE LAS BARRAS DE ESTADISTICAS
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
            this.events.emit('incrementLife', this.player.hp + 1);
            this.player.hp += 1;
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
            this.events.emit('incrementSpeed', this.player.speed + 15);
            this.player.speed += 15;    
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
            this.events.emit('incrementCadence', this.player.cadence - 50);
            this.player.cadence -= 50;  
        });

        this.levelGame = this.scene.get(this.level);

        // EVENTO PARA QUE CUANDO SE DESPIERTE SE ACTUALICE LA INFORMACION
        this.events.on('wake', (sys, data)=>{
            this.player = data.playerData;
            this.wallet = this.player.coins;
            this.dmg = data.dmg;
        }, this)

        this.previousLetterTime = 0;

    }

    // FUNCION PARA AUMENTAR LA BARRA DE ESTADISTICA ESPECIFICADA
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

    update(t, dt) {

        // CUANDO SALGAS DE LA MEIGA SE REINCIE EL NIVEL EN EL QUE TE ENCONTRABAS Y EN EL CASO DE QUE SEA LA PRIMERA VEZ ABRA LAS PUERTAS
        if (this.e.isDown) {
            this.scene.resume(this.level);
            this.scene.resume('UIScene');
            this.scene.sleep();
            this.dialogBox.clearText();
            if (!this.isTransitioning) {
                this.levelGame.abrirpuertasFirstTalk()
			}
            this.isTransitioning = true;
        }

        // ACTUALIZACION DE LAS MONEDAS
        this.actualcoins.setText(`X ${this.wallet}`);
        let i = 0;
        // ACTUALIZACION DE LAS BARRAS DE ESTADISTICAS Y SUS BOTONES
        for(let spent of this.barSpent){
            if(i === 0){
                if(this.wallet < spent){
                    this.lifeButton.disableInteractive().setAlpha(0.5);
                }else{
                    this.lifeButton.setInteractive({ cursor: 'pointer' }).setAlpha(1);
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
                    this.strongButton.setInteractive({ cursor: 'pointer' }).setAlpha(1);;
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
                    this.speedButton.setInteractive({ cursor: 'pointer' }).setAlpha(1);;
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
                    this.cadenceButton.setInteractive({ cursor: 'pointer' }).setAlpha(1);;
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

        // CONTADOR CON EL TIEMPO TRANSCURRIDO DESDE LA ULTIMA LETRA
        this.previousLetterTime += dt;

		// SI HA PASADO EL TIEMPO NECESARIO Y NO HA TERMINADO DE ESCRIBIR ESCRIBE LA SIGUIENTE LETRA
		if(this.dialogBox.isWritting && this.dialogBox.timePerLetter <= this.previousLetterTime){
			this.dialogBox.write();
			this.previousLetterTime = 0;
		}else if(!this.skipkey.visible){
            this.skipkey.setVisible(true);
        }

        if(this.q.isDown && !this.dialogBox.isWritting && this.listDialogs.length > 0){
            this.dialogBox.clearText();
            this.dialogBox.setTextToDisplay(this.listDialogs.shift())
            this.skipkey.setVisible(false)
        }
    }

    // FUNCION PARA CUANDO SE CAMBIA DE NIVEL GUARDAR DICHO NIVEL
    changeLevel(level){ 
        this.level = level;

        this.levelGame.events.removeAllListeners('passLevel');

        this.levelGame = this.scene.get(this.level);
    }

    // INICIALIZACION DE DIALOGOS DE LA MEIGA EN FUNCION DE LA SALA
    initDialog(){
        this.skipkey.setVisible(false)
        if(!LevelScene.progress.level3 && !LevelScene.progress.level4){
            this.listDialogs = [...dialogsMeiga.level1];
        }else if(LevelScene.progress.level3 && LevelScene.progress.level4){
            this.listDialogs = [...dialogsMeiga.boss];
        }else{
            this.listDialogs = [...dialogsMeiga.others];
        }
        this.dialogBox.setTextToDisplay(this.listDialogs.shift())
    }
    
}