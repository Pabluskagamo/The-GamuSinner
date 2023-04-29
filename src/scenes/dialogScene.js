import Phaser from 'phaser'
export default class dialogScene extends Phaser.Scene {
    constructor() {
        super('dialog')
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
        this.add.image(0, 0, 'room').setOrigin(0, 0).setScale(1);
        this.add.image(0, 0, 'historia').setOrigin(0, 0).setScale(1);

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