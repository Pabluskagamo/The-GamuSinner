import dialogBox from "../dialogs/dialogBox";
export default class historyScene extends Phaser.Scene {

    constructor() {
        super({ key: 'history' });
    }

    init() {

    }
    preload() {
        this.load.spritesheet('skip_sprite', './assets/ui/skip_sprite.png', { frameWidth: 336, frameHeight: 166 });

    }

    create() {
        this.label = this.add.text(100, 100, '', { fontSize: '25px', fontFamily: 'Arial', lineSpacing: 20 })
        this.textList = "Un día Dieguiño estaba aburrido, no sabía que hacer en el verano.\nSe aburría tanto, que decidió preguntarle a su abuelo que podía hacer.\nEl abuelo cansado de oir a Dieguiño protestar y quejarse\ndecidió mandarle una misión imposible.\nIr a cazar un Gamusino\nDieguiño sin pensárselo dos veces,\ncogió su mochila y el arma de su abuelo a escondidas.\nY emprendió el viaje que cambiaría su vida por completo.\n¿Con qué aventuras se encontrará Dieguiño?";

        this.typewriteText(this.textList);

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

    typewriteText(text) {
        const length = text.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.label.text += text[i]
                ++i
            },
            repeat: length - 1,
            delay: 50
        })
    }

}