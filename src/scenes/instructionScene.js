import Character from "../gameobjects/character"

// ESCENA DE LOS CONTROLES DEL JUEGO

export default class instructionScene extends Phaser.Scene {
    constructor() {
        super('instructions');
    }

    init() {
        this.cameras.main.fadeIn(500);
    }

    preload() {
        this.load.image('background_instructions', './img/pergamino.png')
        this.load.image('controls', './assets/ui/controls.png');
        this.load.spritesheet('a_key', './assets/keyboards/A.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('b_key', './assets/keyboards/B.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('d_key', './assets/keyboards/D.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('e_key', './assets/keyboards/E.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('down_key', './assets/keyboards/ARROWDOWN.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('left_key', './assets/keyboards/ARROWLEFT.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('right_key', './assets/keyboards/ARROWRIGHT.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('s_key', './assets/keyboards/S.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('v_key', './assets/keyboards/V.png', { frameWidth: 19, frameHeight: 21 });
        this.load.image('pwpanel', './assets/ui/powerUpPanel.png');
        this.load.spritesheet('shift_key', './assets/keyboards/SHIFTALTERNATIVE.png', { frameWidth: 49, frameHeight: 21 });
        this.load.spritesheet('up_key', './assets/keyboards/ARROWUP.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('w_key', './assets/keyboards/W.png', { frameWidth: 19, frameHeight: 21 });
        this.load.spritesheet('powerup', './assets/powerups/FreezeArrow.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('character', './assets/character/character.png', { frameWidth: 64, frameHeight: 32 });
        this.load.image('speech', './assets/ui/speech.png');
        this.load.spritesheet('skip_sprite', './assets/ui/skip_sprite.png', { frameWidth: 336, frameHeight: 166 });
    }

    create(data) {
        this.isTransitioning = false;

        // ELIMINA LA MUSICA ANTIGUA Y AÑADE LA NUEVA
        this.isMuted = data.mute;
        this.sound.removeByKey('chatTyping');
        this.sound.removeByKey('chat');
        this.sound.removeByKey('rise');
        if(!this.isMuted){
            this.sound.add("musica", {
                volume: 0.2,
                loop: true
            }).play();
        }

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
        const shift_key = this.add.sprite(290, 550, 'shift_key').setScale(3.2);

        // GUARDAR MODIFICADOR
        const v_key = this.add.sprite(800, 275, 'v_key').setScale(3.2);
        const pwpanel = this.add.sprite(920, 275, 'pwpanel').setScale(3.2);
        const powerUp = this.add.sprite(920, 275, 'powerup', 71).setScale(3.5);

        // INTERACTION
        
        const e_key = this.add.sprite(800, 420, 'e_key').setScale(3.2);
        const speech = this.add.sprite(920, 420, 'speech').setScale(3.5);

        //MOVE CHARACTER
        const moveCharacter = new Character(this, 600, 220, "move").setScale(3.5);
        s_key.play('S_Press');

        s_key.on('animationcomplete', (param1, param2, param3) => {
            moveCharacter.play('mainChar_controls_lado');
            d_key.play('D_Press');
        })
        d_key.on('animationcomplete', (param1, param2, param3) => {
            moveCharacter.play('mainChar_controls_lado');
            w_key.play('W_Press');
        })
        w_key.on('animationcomplete', (param1, param2, param3) => {
            moveCharacter.play('mainChar_controls_lado');
            a_key.play('A_Press');
        })
        a_key.on('animationcomplete', (param1, param2, param3) => {
            moveCharacter.play('mainChar_controls_lado');
            s_key.play('S_Press');
        })

        // SHOOT CHARACTER
        const shootCharacter = new Character(this, 600, 380, "shoot").setScale(3.5);
        down_key.play('DOWN_Press');

        down_key.on('animationcomplete', (param1, param2, param3) => {
            shootCharacter.play('mainChar_controls_shootlado');
            right_key.play('RIGHT_Press');
        })
        right_key.on('animationcomplete', (param1, param2, param3) => {
            shootCharacter.play('mainChar_controls_shootlado');
            up_key.play('UP_Press');
        })
        up_key.on('animationcomplete', (param1, param2, param3) => {
            shootCharacter.play('mainChar_controls_shootlado');
            left_key.play('LEFT_Press');
        })
        left_key.on('animationcomplete', (param1, param2, param3) => {
            shootCharacter.play('mainChar_controls_shootlado');
            down_key.play('DOWN_Press');
        })

        // DASH CHARACTER
        const dashCharacter = new Character(this, 600, 540, "dash").setScale(3.5);
        shift_key.play('SHIFT_Press');

        dashCharacter.on('animationcomplete', (param1, param2, param3) => {
            if (dashCharacter.anims.currentAnim.key == 'mainChar_controls_dash') {
                dashCharacter.play('mainChar_controls_dash');
                shift_key.play('SHIFT_Press');
            }
        });

        // SKIP BUTTON
        this.anims.create({
            key: 'hoverSkip',
            frames: this.anims.generateFrameNumbers('skip_sprite', { start: 0, end: 2 }),
            frameRate: 12,
            repeat: 0
        })

        const skip = this.add.sprite(1000, 600, 'skip_sprite').setScale(0.5);
        skip.setInteractive({ cursor: 'pointer' });
        skip.on('pointerover', () => {
            skip.play('hoverSkip');
        });

        skip.on('pointerout', () => {
            skip.playReverse('hoverSkip');
        });

        skip.on('pointerup', () => {
            if (this.isTransitioning) {
				return;
			}
			this.isTransitioning = true;
            this.cameras.main.fadeOut(500);
            this.cameras.main.once("camerafadeoutcomplete", function () {
                this.scene.start('selecScene', { mute: this.isMuted });
            }, this);
        });


        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                if (this.isTransitioning) {
                    return;
                }
                this.isTransitioning = true;
                this.cameras.main.fadeOut(500);
                this.cameras.main.once("camerafadeoutcomplete", function () {
                    this.scene.start('selecScene', { mute: this.isMuted });
                }, this);
            }
        });
    }
}