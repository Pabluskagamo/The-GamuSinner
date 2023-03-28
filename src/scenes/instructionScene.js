import moveCharacter from "../gameobjects/instructions/moveCharacter"
import shootCharacter from "../gameobjects/instructions/shootCharacter"
import dashCharacter from "../gameobjects/instructions/dashCharacter"

export default class LevelScene extends Phaser.Scene {
    constructor() {
        super('instructions')
    }

    init() {
        this.cameras.main.fadeIn(500);
    }

    preload() {
        this.load.image('background_instructions', '/img/pergamino.png')
        this.load.image('controls', '/assets/ui/controls.png');
        this.load.spritesheet('a_key', '/assets/keyboards/A.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('b_key', '/assets/keyboards/B.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('d_key', '/assets/keyboards/D.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('down_key', '/assets/keyboards/ARROWDOWN.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('g_key', '/assets/keyboards/G.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('left_key', '/assets/keyboards/ARROWLEFT.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('right_key', '/assets/keyboards/ARROWRIGHT.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('s_key', '/assets/keyboards/S.png', { frameWidth: 19, frameHeight: 21 });
        // this.load.spritesheet('spacebar_key', '/assets/keyboards/SPACEBAR.png', { frameWidth: 98, frameHeight: 21 });
        this.load.spritesheet('tab_key', '/assets/keyboards/TAB.png', { frameWidth: 33, frameHeight: 21 });
        this.load.spritesheet('up_key', '/assets/keyboards/ARROWUP.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('w_key', '/assets/keyboards/W.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('potion', '/assets/items/potions.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('granade', '/assets/items/granade.png');
        this.load.spritesheet('character', '/assets/character/character.png', { frameWidth: 64, frameHeight: 32 });
        this.load.image('skip_title', '/assets/ui/skip_title.png');
        this.load.image('skip', '/assets/ui/skip.png');
        this.load.spritesheet('skip_sprite', '/assets/ui/skip_sprite.png', { frameWidth: 336, frameHeight: 166 });
    }

    create() {
        // FONDO
        this.add.image(0, 0, 'background_instructions').setOrigin(0, 0).setScale(0.91);

        // TITULO
        const controls = this.add.sprite(290, 100, 'controls').setScale(0.3);

        // WASD
        const a_key = this.add.sprite(225, 275, 'a_key').setScale(3.2);
        const w_key = this.add.sprite(295, 205, 'w_key').setScale(3.2);
        const s_key = this.add.sprite(295, 275, 's_key').setScale(3.2);
        const d_key = this.add.sprite(365, 275, 'd_key').setScale(3.2);

        // CURSOR
        const left_key = this.add.sprite(225, 430, 'left_key').setScale(3.2);
        const up_key = this.add.sprite(295, 360, 'up_key').setScale(3.2);
        const down_key = this.add.sprite(295, 430, 'down_key').setScale(3.2);
        const right_key = this.add.sprite(365, 430, 'right_key').setScale(3.2);

        // DASH
        const tab_key = this.add.sprite(290, 550, 'tab_key').setScale(3.2);

        // GUARDAR MODIFICADOR
        const g_key = this.add.sprite(800, 275, 'g_key').setScale(3.2);
        const powerUp = this.add.sprite(920, 275, 'potion', 71).setScale(3.5);

        // USO DE GRANADA
        const b_key = this.add.sprite(800, 390, 'b_key').setScale(3.2);
        const granade = this.add.sprite(920, 390, 'granade').setScale(0.7);

        // CHARACTER
        new moveCharacter(this, 600, 220, 0, w_key, a_key, s_key, d_key).setScale(3.5);
        new shootCharacter(this, 600, 380, 0, up_key, left_key, down_key, right_key).setScale(3.5);
        new dashCharacter(this, 600, 540, 0, tab_key).setScale(3.5);

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
                this.scene.start('level');
            }, this);
        });


        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                this.cameras.main.fadeOut(500);
                this.cameras.main.once("camerafadeoutcomplete", function () {
                    this.scene.start('level');
                }, this);
            }
        });
    }
}