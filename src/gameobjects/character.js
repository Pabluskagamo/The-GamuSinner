import MovableObject from "./movableObject";

export default class Character extends MovableObject {

    constructor(scene, x, y, speed) {
        super(scene, x, y, 'character', speed, 20);

        this.speed = speed;
        this.isAttacking = false;
        let f = this.frame;
        this.hp = 5
        this.lastFired = 0;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds();

        this.bodyOffsetWidth = this.body.width / 3;
        this.bodyOffsetHeight = this.body.height / 1.8;
        this.bodyWidth = this.body.width / 2.7;
        this.bodyHeight = this.body.height / 2.5;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;


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


        this.on('animationcomplete', end => {
            if (/^mainChar_shoot\w+/.test(this.anims.currentAnim.key)) {
                this.stopAttack()
            }
        })

        this.play('mainChar_static');

        this.cursors = this.scene.input.keyboard.createCursorKeys();
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
                this.moveLeftDown();
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
            this.stopHorizontal();
        }

        if (Phaser.Input.Keyboard.JustUp(this.w) || Phaser.Input.Keyboard.JustUp(this.s)) {
            this.stopVertical();
        }

        if ((this.cursors.up.isDown || this.cursors.down.isDown|| this.cursors.left.isDown||this.cursors.right.isDown) && t > this.lastFired) {
            this.attack();
            this.lastFired = t + 300;
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
        let dir = new Phaser.Math.Vector2(0,1);

        this.flipX = false;
        
        if (this.cursors.down.isDown && this.cursors.right.isDown) {
            // Diagonal abajo-derecha
            this.flipX = true;
            this.play('mainChar_shootlado');
            dir = new Phaser.Math.Vector2(1, 1).normalize();
        } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
            // Diagonal arriba-derecha
            this.flipX = true;
            this.play('mainChar_shootlado');
            dir = new Phaser.Math.Vector2(1, -1).normalize();
        } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
            // Diagonal abajo-izquierda
            this.play('mainChar_shootlado');
            dir = new Phaser.Math.Vector2(-1, 1).normalize();
        } else if (this.cursors.up.isDown && this.cursors.left.isDown) {
            // Diagonal arriba-izquierda
            this.play('mainChar_shootlado');
            dir = new Phaser.Math.Vector2(-1, -1).normalize();
        } else if (this.cursors.down.isDown) {
            // Movimiento hacia abajo
            this.play('mainChar_shootabajo');
            dir.x = 0;
            dir.y = 1;
        } else if (this.cursors.up.isDown) {
            // Movimiento hacia arriba
            this.play('mainChar_shootarriba');
            dir.x = 0;
            dir.y = -1;
        }else if (this.cursors.left.isDown) {
            // Movimiento hacia izq
            this.play('mainChar_shootlado');
            dir.x = -1
            dir.y = 0
        } else if(this.cursors.right.isDown){
            this.flipX = true;
            this.play('mainChar_shootlado');
            dir.x = 1
            dir.y = 0
        }
        //Comprobar si hay balas.
        if (this.scene.bulletPool.hasBullets()) {
            let bullet = this.scene.bulletPool.spawn(this.x, this.y);
            bullet.setDireccion(dir);
        }

    }

    stopAttack() {
        //this.isAttacking = false;
    }

    isAttackInProcess() {
        return this.isAttacking;
    }

    dieMe() {
        this.play('mainChar_die');
    }

    getHp() {
        return this.hp;
    }

    setHp(health) {
        this.hp = health;
    }

    getHit(dmg) {
        this.hp -= dmg;
    }
}