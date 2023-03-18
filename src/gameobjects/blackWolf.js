import MovableObject from "./movableObject";

export default class BlackWolf extends MovableObject {

    constructor(scene, x, y, speed, player) {
        super(scene, x, y, 'blackWolf', 20);
        this.scene.add.existing(this);
        this.setScale(1.5);

        this.speed = speed;
        this.player = player;

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
        console.log(this.body)

    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        this.scene.physics.moveToObject(this, this.player, this.speed);
        console.log(this.body.velocity);
        if (this.body.velocity.x !== 0 && this.body.velocity.y < 5) {
            // Movimiento hacia los lados
            this.play('lado_blackWolf', true);
            this.flipX = this.body.velocity.x > 0;
        } else if (this.body.velocity.x > 0 && this.body.velocity.y > 0) {
            // Diagonal abajo-derecha
            this.play('abajo_blackWolf', true);
        } else if (this.body.velocity.x > 0 && this.body.velocity.y < 0) {
            // Diagonal arriba-derecha
            this.play('arriba_blackWolf', true);
        } else if (this.body.velocity.x < 0 && this.body.velocity.y > 0) {
            // Diagonal abajo-izquierda
            this.play('abajo_blackWolf', true);
        } else if (this.body.velocity.x < 0 && this.body.velocity.y < 0) {
            // Diagonal arriba-izquierda
            this.play('arriba_blackWolf', true);
        } else if (this.body.velocity.y > 0 && this.body.velocity.x === 0) {
            // Movimiento hacia abajo
            this.play('abajo_blackWolf', true);
        } else if (this.body.velocity.y < 0 && this.body.velocity.x === 0) {
            // Movimiento hacia arriba
            this.play('arriba_blackWolf', true);
        } else {
            // Reproducir la animación estática si no se está moviendo
            this.play('static_blackWolf');
        }

    }

    dieMe(){
		this.play('died_blackWolf');
	}
}