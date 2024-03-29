import { Directions } from "./utils/directions"

// CLASE DE LAS BALAS

export default class Bullet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, speed, dmg) {
        super(scene, x, y, 'bullet', 0)
        this.speed = speed
        this.dmg = dmg
        
        this.setScale(1.5)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);  

        this.createAnimations()
        this.init(x, y)
    }

    // INCICIALIZACION DE SUS CARACTERISTICAS
    init(x, y) {
        this.x = x
        this.y = y
        this.bouncingCount = 0
        this.reboundmg = 0
        this.icedmg = 0
        this.slow = false
        this.justHit = false
        this.play('bullet_animation')
    }

    // FUNCION PARA CREAR LAS ANIMACIONES DE LA BALA
    createAnimations() {
        this.scene.anims.create({
            key: 'bullet_animation',
            frames: this.scene.anims.generateFrameNumbers('bullet', { start: 106, end: 109 }),
            frameRate: 10,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'iceBullet_animation',
            frames: this.scene.anims.generateFrameNumbers('icebullet', { start: 30, end: 35 }),
            frameRate: 10,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'bouncigBullet_animation',
            frames: this.scene.anims.generateFrameNumbers('bouncigbullet', { start: 343, end: 346 }),
            frameRate: 9,
            repeat: -1
        })
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)

        // COMPROBACION DEL MOVIMIENTO DE LA BALA
        this.setRotation(0);
        if (this.body.velocity.x > 0 && this.body.velocity.y > 0) {
            // Diagonal abajo-derecha
            this.setRotation(0.785398)
        } else if (this.body.velocity.x > 0 && this.body.velocity.y < 0) {
            // Diagonal arriba-derecha
            this.setRotation(-0.785398)
        } else if (this.body.velocity.x < 0 && this.body.velocity.y > 0) {
            // Diagonal abajo-izquierda
            this.setRotation(2.35619)
        } else if (this.body.velocity.x < 0 && this.body.velocity.y < 0) {
            // Diagonal arriba-izquierda
            this.setRotation(-2.35619)
        } else if (this.body.velocity.y > 0 && this.body.velocity.x === 0) {
            // Movimiento hacia abajo
            this.setRotation(1.5708)
        } else if (this.body.velocity.y < 0 && this.body.velocity.x === 0) {
            // Movimiento hacia arriba
            this.setRotation(-1.5708)
        }else if (this.body.velocity.x !== 0 && this.body.velocity.y < 5) {
            // Movimiento hacia los lados
            this.setRotation(0)
            this.flipX = this.body.velocity.x < 0
        }

        if (this.y > this.scene.getGameHeight() || this.y < 0 || this.x < 0 || this.x > this.scene.getGameWidth()) {
            //this.scene.bulletPool.release(this);
            this.reboundOrRelease()
        }
    }

    // INDICAR UNA DIRECCION A LA BALA
    setDireccion(dir){
        this.setVelocityX(dir.x*this.speed)
        this.setVelocityY(dir.y*this.speed)
    }

    // FUNCION AL IMPACTAR A UN ENEMIGO
    hit(enemy){
        if(!this.justHit){
            this.justHit = true
            enemy.hitEnemy(this.dmg + this.icedmg + this.reboundmg);
            //
            //if (this.icedmg > 0) enemy.slow(20)
            if (this.slow) enemy.slow(20)
            this.reboundOrRelease()
            //this.scene.bulletPool.release(this);
        }
    }

    // FUNCION PARA ACTIVAR EL POWER-UP DE COGELACION
    activateFreezing() {
        this.icedmg = 10
        this.slow = true
        this.play('iceBullet_animation')
    }

    // FUNCION PARA ACTIVAR EL POWER-UP DE REBOTE
    activateBouncing() {
        this.bouncingCount = 2
        this.play('bouncigBullet_animation')
    }

    // FUNCION PAA REUTILIZAR LA BALA O NO EN LA POOL (EN FUNCION DE SI ES REBOTANTE O NO)
    reboundOrRelease(){
        if (this.bouncingCount > 0) {
            let arrayDirections = Object.values(Directions)
            this.bouncingCount--
            this.reboundmg += 3
            this.justHit = false
            this.setDireccion(arrayDirections[Phaser.Math.Between(0, 7)])
        }
        else {
            this.scene.bulletPool.release(this);
        }
    }

    // FUNCION PARA INDICAR DAÑO QUE REALIZA LA BALA
    setDmg(dmg){
        this.dmg = dmg;
    }
}