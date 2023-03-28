import MovableObject from "./movableObject";

export default class Character extends MovableObject {

    constructor(scene, x, y, speed) {
        super(scene, x, y, 'character', speed, 20);

        this.speed = speed;
        this.isAttacking = false;
        this.isDashing = false;
        let f = this.frame;
        this.hp = 6
        this.lastFired = 0;
        this.setScale(1.7);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds();

        this.bodyOffsetWidth = this.body.width / 4.6;
        this.bodyOffsetHeight = this.body.height / 5;
        this.bodyWidth = this.body.width / 4;
        this.bodyHeight = this.body.height / 1.5;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;

        this.scene.anims.create({
            key: 'mainChar_static',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 0, end: 7 }),
            frameRate: 5,
            repeat: -1
        })
        
        this.scene.anims.create({
            key: 'mainChar_lado',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_dash',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 16, end: 22 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_shootlado',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 40, end: 43 }),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_shootlado_izq',
            frames: this.scene.anims.generateFrameNumbers('character_shot', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_die',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 48, end: 52 }),
            frameRate: 5,
            repeat: 0
        })


        this.on('animationcomplete', end => {
            if (/^mainChar_shoot\w+/.test(this.anims.currentAnim.key)) {
                this.stopAttack()
            }

            if (this.anims.currentAnim.key === 'mainChar_die') {
                this.scene.gameOver();
            }

            if (this.anims.currentAnim.key === 'mainChar_dash') {
                this.isDashing = false;
            }
        })

        this.play('mainChar_static', true);

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.a = this.scene.input.keyboard.addKey('A');
        this.s = this.scene.input.keyboard.addKey('S');
        this.d = this.scene.input.keyboard.addKey('D');
        this.w = this.scene.input.keyboard.addKey('W');
        this.spacebar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.tab = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        this.flipX = false;

        if(!this.isDashing && !this.isDead()){
            if (this.s.isDown && this.d.isDown) {
                // Diagonal abajo-derecha
                this.play('mainChar_lado', true);
                this.moveRightDown();
            } else if (this.w.isDown && this.d.isDown) {
                // Diagonal arriba-derecha
                this.play('mainChar_lado', true);
                this.moveRightUp();
            } else if (this.s.isDown && this.a.isDown) {
                // Diagonal abajo-izquierda
                this.play('mainChar_lado', true);
                this.flipX = true;
                this.moveLeftDown();
            } else if (this.w.isDown && this.a.isDown) {
                // Diagonal arriba-izquierda
                this.play('mainChar_lado', true);
                this.flipX = true;
                this.moveLeftUp();
            } else if (this.s.isDown) {
                // Movimiento hacia abajo
                this.play('mainChar_lado', true);
                this.moveDown();
            } else if (this.w.isDown) {
                // Movimiento hacia arriba
                this.play('mainChar_lado', true);
                this.moveUp();
            } else if (this.a.isDown) {
                // Movimiento hacia izq
                this.play('mainChar_lado', true);
                this.flipX = true;
                this.moveLeft();
            } else if (this.d.isDown) {
                this.play('mainChar_lado', true);
                this.moveRight();
            } else {
                this.frictionEffect();
            }
        }

        if(this.tab.isDown){
            this.dash();
        }

        if (Phaser.Input.Keyboard.JustUp(this.a) || Phaser.Input.Keyboard.JustUp(this.d)) {
            this.stopHorizontal();
        }

        if (Phaser.Input.Keyboard.JustUp(this.w) || Phaser.Input.Keyboard.JustUp(this.s)) {
            this.stopVertical();
        }

        if ((this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown) && t > this.lastFired) {
            this.flipX = true;
            if(!this.isDead()){
                this.attack();
                this.lastFired = t + 400;
            }
        }
        
        // if(this.isStatic()){
        //     this.play('mainChar_static', true);
        // }

    }

    attack() {

        let dir = new Phaser.Math.Vector2(0, 1);

        

        if (this.cursors.down.isDown && this.cursors.right.isDown) {
            // Diagonal abajo-derecha
            this.play('mainChar_shootlado', true);
            dir = new Phaser.Math.Vector2(1, 1).normalize();
        } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
            // Diagonal arriba-derecha
            this.play('mainChar_shootlado', true);
            dir = new Phaser.Math.Vector2(1, -1).normalize();
        } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
            // Diagonal abajo-izquierda
            this.play('mainChar_shootlado_izq', true);
            // this.flipX = true;
            dir = new Phaser.Math.Vector2(-1, 1).normalize();
        } else if (this.cursors.up.isDown && this.cursors.left.isDown) {
            // Diagonal arriba-izquierda
            this.play('mainChar_shootlado_izq', true);
            // this.flipX = true;
            dir = new Phaser.Math.Vector2(-1, -1).normalize();
        } else if (this.cursors.down.isDown) {
            // Movimiento hacia abajo
            this.play('mainChar_shootlado', true);
            dir.x = 0;
            dir.y = 1;
        } else if (this.cursors.up.isDown) {
            // Movimiento hacia arriba
            this.play('mainChar_shootlado', true);
            dir.x = 0;
            dir.y = -1;
        } else if (this.cursors.left.isDown) {
            // Movimiento hacia izq
            this.play('mainChar_shootlado_izq', true);
            this.flipX = true;
            dir.x = -1
            dir.y = 0
        } else if (this.cursors.right.isDown) {
            this.play('mainChar_shootlado', true);
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
        console.log('Animacion de morir Personaje')
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
        
        console.log('Player HP:', this.hp, 'Is Dead??', this.isDead())

        if(this.hp <= 0){
            this.hp = 0;
            this.dieMe();
        }
    }

    isDead(){
        return this.hp === 0;
    }

    dash(){
        this.flipX = this.body.velocity.x < 0;
        let speed = this.speed; 

        if(!this.isDead()){
            this.speed *= 1.3;
            this.isDashing = true;
            this.play('mainChar_dash', true);
            this.applyLastDir();
            this.speed = speed;
        }
    }
}


/*import MovableObject from "./movableObject";

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
        this.f = this.scene.input.keyboard.addKey('F');
        this.spacebar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        this.flipX = false;

        if (this.s.isDown && this.d.isDown) {
            // Diagonal abajo-derecha
            this.play('mainChar_lado', true);
            this.flipX = true;
            this.moveRightDown();
        } else if (this.w.isDown && this.d.isDown) {
            // Diagonal arriba-derecha
            this.play('mainChar_lado', true);
            this.flipX = true;
            this.moveRightUp();
        } else if (this.s.isDown && this.a.isDown) {
            // Diagonal abajo-izquierda
            this.play('mainChar_lado', true);
            this.moveLeftDown();
        } else if (this.w.isDown && this.a.isDown) {
            // Diagonal arriba-izquierda
            this.play('mainChar_lado', true);
            this.moveLeftUp();
        } else if (this.s.isDown) {
            // Movimiento hacia abajo
            this.play('mainChar_abajo', true);
            this.moveDown();
        } else if (this.w.isDown) {
            // Movimiento hacia arriba
            this.play('mainChar_arriba', true);
            this.moveUp();
        } else if (this.a.isDown) {
            // Movimiento hacia izq
            this.play('mainChar_lado', true);
            this.moveLeft();
        } else if (this.d.isDown) {
            this.play('mainChar_lado', true);
            this.flipX = true;
            this.moveRight();
        } else if (this.f.isDown) {
            this.dieMe();
        } else {
            this.frictionEffect();
        }

        if (Phaser.Input.Keyboard.JustUp(this.a) || Phaser.Input.Keyboard.JustUp(this.d)) {
            this.stopHorizontal();
        }

        if (Phaser.Input.Keyboard.JustUp(this.w) || Phaser.Input.Keyboard.JustUp(this.s)) {
            this.stopVertical();
        }

        if ((this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown) && t > this.lastFired) {
            this.attack();
            this.lastFired = t + 400;
        }

    }

    attack() {
        // const lastAnim = this.anims.currentAnim.key;

        // if (lastAnim == 'mainChar_lado') {
        //     this.play('mainChar_shootlado');
        // } else if (lastAnim == 'mainChar_abajo') {
        //     this.play('mainChar_shootabajo');
        // } else if (lastAnim == 'mainChar_arriba') {
        //     this.play('mainChar_shootarriba');
        // } else {
        //     this.play(lastAnim);
        // }
        let dir = new Phaser.Math.Vector2(0, 1);

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
        } else if (this.cursors.left.isDown) {
            // Movimiento hacia izq
            this.play('mainChar_shootlado');
            dir.x = -1
            dir.y = 0
        } else if (this.cursors.right.isDown) {
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
        if (this.getHp() === 0) {
            this.play('mainChar_die');
        }

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
*/