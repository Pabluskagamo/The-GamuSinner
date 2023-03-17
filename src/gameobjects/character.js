import MovableObject from "./movableObject";

export default class Character extends MovableObject {

    constructor(scene, x, y, speed) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds();
        let f = this.frame;
        this.setSize(f.realWidth / 2, f.realHeight, true);

        this.scene.anims.create({
            key: 'mainChar_abajo',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 130, end: 138 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_arriba',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 104, end: 112 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_lado',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 117, end: 125 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_static',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 182, end: 187 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_shootarriba',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 52, end: 59 }),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_shootabajo',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 78, end: 85 }),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_shootlado',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 65, end: 72 }),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_die',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 260, end: 265 }),
            frameRate: 5,
            repeat: 0
        })


        // this.on('animationcomplete',() => {
        //     console.log("FINALIZA ANIMACION")
        //     this.play('mainChar_static');
        // })

        this.play('mainChar_static');


        this.a = this.scene.input.keyboard.addKey('A');
        this.s = this.scene.input.keyboard.addKey('S');
        this.d = this.scene.input.keyboard.addKey('D');
        this.w = this.scene.input.keyboard.addKey('W');
        this.spacebar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        if (this.a.isDown) {
            this.play('mainChar_lado', true);
            this.flipX = false;
            this.moveLeft()
        } else if (this.d.isDown) {
            this.play('mainChar_lado', true);
            this.flipX = true;
            this.moveRight();
        }

        if (this.s.isDown) {
            this.play('mainChar_abajo', true);
            if (this.a.isDown) {
                this.moveLeftDown()
            } else if (this.d.isDown) {
                this.moveRightDown();
            }
            else {
                this.moveDown();
            }
        } else if (this.w.isDown) {
            this.play('mainChar_arriba', true);

            if (this.a.isDown) {
                this.moveLeftUp();
            } else if (this.d.isDown) {
                this.moveRightUp();
            }
            else {
                this.moveUp();
            }
        }

        if (Phaser.Input.Keyboard.JustUp(this.a) || Phaser.Input.Keyboard.JustUp(this.d)) {
            this.stopHorizontal()
        }

        if (Phaser.Input.Keyboard.JustUp(this.w) || Phaser.Input.Keyboard.JustUp(this.s)) {
            this.stopVertical();
        }

        if (this.spacebar.isDown) {
            this.attack();
        }

    }

    attack() {
        const lastAnim = this.anims.currentAnim.key;

        if (lastAnim == 'mainChar_lado') {
            this.play('mainChar_shootlado');
        } else if (lastAnim == 'mainChar_abajo') {
            this.play('mainChar_shootabajo');
        } else if (lastAnim == 'mainChar_arriba') {
            this.play('mainChar_shootarriba');
        } else {
            this.play(lastAnim);
        }
    }
}