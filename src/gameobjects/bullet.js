export default class Bullet extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, speed, dmg){
        super(scene, x, y, 'bullet', 0);
        this.speed = speed
        this.dmg = dmg

        this.justHit = false;

        this.setScale(1.5)


        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);  

        this.scene.anims.create({
            key: 'bullet_animation',
            frames: this.scene.anims.generateFrameNumbers('bullet', { start: 106, end: 109 }),
            frameRate: 10,
            repeat: -1
        })

        this.play('bullet_animation')

    }


    preUpdate(t, dt){
        super.preUpdate(t, dt)

        this.setRotation(0);
        if (this.body.velocity.x > 0 && this.body.velocity.y > 0) {
            // Diagonal abajo-derecha
            this.setRotation(0.785398);
        } else if (this.body.velocity.x > 0 && this.body.velocity.y < 0) {
            // Diagonal arriba-derecha
            this.setRotation(-0.785398);
        } else if (this.body.velocity.x < 0 && this.body.velocity.y > 0) {
            // Diagonal abajo-izquierda
            this.setRotation(2.35619);
        } else if (this.body.velocity.x < 0 && this.body.velocity.y < 0) {
            // Diagonal arriba-izquierda
            this.setRotation(-2.35619);
        } else if (this.body.velocity.y > 0 && this.body.velocity.x === 0) {
            // Movimiento hacia abajo
            this.setRotation(1.5708);
        } else if (this.body.velocity.y < 0 && this.body.velocity.x === 0) {
            // Movimiento hacia arriba
            this.setRotation(-1.5708);
        }else if (this.body.velocity.x !== 0 && this.body.velocity.y < 5) {
            // Movimiento hacia los lados
            this.setRotation(0);
            this.flipX = this.body.velocity.x < 0;
        }

        if (this.y > this.scene.game.config.height || this.y < 0 || this.x < 0 || this.x > this.scene.game.config.width) {
            this.scene.bulletPool.release(this);
        }
    }

    setDireccion(dir){
        this.setVelocityX(dir.x*this.speed)
        this.setVelocityY(dir.y*this.speed)
    }

    hit(enemie){
        if(!this.justHit){
            this.justHit = true;
            enemie.hitEnemy(this.dmg);
            this.scene.bulletPool.release(this);
        }
    }

}