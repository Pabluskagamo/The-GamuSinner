export default class BlackWolf extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, speed) {
        super(scene, x, y, 'blackWolf', 20);
        this.scene.add.existing(this);
        this.setScale(1.5);

        this.speed = speed;

        this.scene.physics.add.existing(this);

        this.setCollideWorldBounds();

        // this.bodyOffset = this.width / 4;
        // this.body.width = this.width/ 1.3;

        // this.body.height = this.height/ 1.3;
        let f = this.frame;
        this.setSize(f.realWidth / 2, f.realHeight, true);
        // this.setOffset(this.bodyOffset, 0);

        this.scene.anims.create({
            key: 'abajo_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', { start: 180, end: 188 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'arriba_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', { start: 144, end: 152 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'lado_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', { start: 162, end: 170 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'static_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', { start: 36, end: 37 }),
            frameRate: 1.5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'died_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', { start: 360, end: 365 }),
            frameRate: 5,
            repeat: 0
        })

        this.on('animationcomplete', () => {
            if (this.anims.currentAnim.key !== 'died_blackWolf') {
                this.play('static_blackWolf');
            }
        })

        this.play('static_blackWolf');

        this.f = this.scene.input.keyboard.addKey('F')
        this.cursor = this.scene.input.keyboard.createCursorKeys();
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        if (this.cursor.left.isDown) {
            this.play('lado_blackWolf', true);
            this.flipX = false;
            this.setVelocityX(-this.speed);
        } else if (this.cursor.right.isDown) {
            this.play('lado_blackWolf', true);
            this.flipX = true;
            this.setVelocityX(this.speed);
        }

        if (this.cursor.down.isDown) {
            this.play('abajo_blackWolf', true);
            if (this.cursor.left.isDown) {
                let vel = new Phaser.Math.Vector2(-this.speed, this.speed);
                vel = vel.normalize();
                this.setVelocity(this.speed * vel.x, this.speed * vel.y);
            } else if (this.cursor.right.isDown) {
                let vel = new Phaser.Math.Vector2(this.speed, this.speed);
                vel = vel.normalize();
                this.setVelocity(this.speed * vel.x, this.speed * vel.y);
            }
            else {
                this.setVelocityY(this.speed);
            }
        } else if (this.cursor.up.isDown) {
            this.play('arriba_blackWolf', true);

            if (this.cursor.left.isDown) {
                let vel = new Phaser.Math.Vector2(-this.speed, -this.speed);
                vel = vel.normalize();
                this.setVelocity(this.speed * vel.x, this.speed * vel.y);
            } else if (this.cursor.right.isDown) {
                let vel = new Phaser.Math.Vector2(this.speed, -this.speed);
                vel = vel.normalize();
                this.setVelocity(this.speed * vel.x, this.speed * vel.y);
            }
            else {
                this.setVelocityY(-this.speed);
            }
        }

        if (Phaser.Input.Keyboard.JustUp(this.cursor.left) || Phaser.Input.Keyboard.JustUp(this.cursor.right)) {
            this.setVelocityX(0);
        }

        if (Phaser.Input.Keyboard.JustUp(this.cursor.down) || Phaser.Input.Keyboard.JustUp(this.cursor.up)) {
            this.setVelocityY(0);
        }

    }
}