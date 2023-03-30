export default class PowerUp extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, key){
        super(scene, x, y, key);
        this.dmg = dmg
        this.collected = false;

        //this.setScale(1.5)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);  

        this.scene.anims.create({
            key: 'coin_animation',
            frames: this.scene.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        })

        this.play(key + '_animation')

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

    collect(character){
        if(!this.collected){
            this.collected = true;
            collected.hitEnemy();
            this.scene.bulletPool.release(this);
        }
    }

}