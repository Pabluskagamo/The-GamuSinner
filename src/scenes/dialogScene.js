import Phaser from 'phaser'
import dialogBox from '../dialogs/dialogBox';

export default class dialogScene extends Phaser.Scene {
    constructor() {
        super('dialog')
        this.dialogDieguinio;
        this.dialogAbuelo;
    }

    init() {
        this.cameras.main.fadeIn(500);
    }

    preload() {
        this.load.image('room', './img/room2.png')
        this.load.image('historia', './img/sceneHistoria_final.png')
        this.load.spritesheet('skip_sprite', './assets/ui/skip_sprite.png', { frameWidth: 336, frameHeight: 166 });
    }

    create() {
        // FONDO
        this.add.image(0, 0, 'room').setOrigin(0, 0).setScale(1).setDepth(0);
        this.add.image(0, 0, 'historia').setOrigin(0, 0).setScale(1).setDepth(1);

        //DIALOG DIEGUINIO
        this.dialogDieguinio = new dialogBox(this, 300, 40, 460);
        this.dialogDieguinio.setDepth(2);
        this.dialogDieguinio.setFontSize(22);
        this.dialogDieguinio.setColor('FFFFFF');
        this.dialogDieguinio.clearText();
        this.dialogDieguinio.setTextToDisplay('Hola abuelo, estoy aburrido, ¿Qué puedo hacer para pasar el ratiño?');
        this.dialogDieguinio.printText();
        //DIALOG ABUELO
        this.dialogAbuelo = new dialogBox(this, 440, 165, 440);
        this.dialogAbuelo.setDepth(2);
        this.dialogAbuelo.setFontSize(22);
        this.dialogAbuelo.setColor('FFFFFF');
        this.dialogAbuelo.clearText();
        this.dialogAbuelo.setTextToDisplay('Pues vete a buscar gamusinos que estoy leyendo y me estás molestando');
        this.dialogAbuelo.printText();




        // SKIP BUTTON
        this.anims.create({
            key: 'hoverSkip',
            frames: this.anims.generateFrameNumbers('skip_sprite', { start: 0, end: 2 }),
            frameRate: 12,
            repeat: 0
        })

        // const skip_title = this.add.sprite(890, 600, 'skip_title').setScale(0.2);
        // skip_title.setInteractive({cursor: 'pointer'});
        const skip = this.add.sprite(1000, 600, 'skip_sprite').setScale(0.5);
        skip.setInteractive({ cursor: 'pointer' });
        skip.on('pointerover', () => {
            skip.play('hoverSkip');
        });

        skip.on('pointerout', () => {
            skip.playReverse('hoverSkip');
        });

        skip.on('pointerup', () => {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once("camerafadeoutcomplete", function () {
                this.scene.start('instructions');
            }, this);
        });


        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                this.cameras.main.fadeOut(500);
                this.cameras.main.once("camerafadeoutcomplete", function () {
                    this.scene.start('instructions');
                }, this);
            }
        });
    }


}