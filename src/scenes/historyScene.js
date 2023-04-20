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