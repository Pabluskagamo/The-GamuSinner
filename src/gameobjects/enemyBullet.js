import Bullet from "./bullet";

// CLASS DE LA BALA DEL BOSS, QUE EXTIENDE DE LA BALA DEL PERSONAJE

export default class EnemyBullet extends Bullet {

    constructor (scene, x, y, speed, dmg) {
        super(scene, x, y, speed, dmg)
        this.setScale(2)
        this.originalWidth = this.body.width
        this.originalHeight = this.body.height
        this.body.setSize(this.originalWidth/2.8, this.originalHeight/2.8, true);
    }

    init (x, y) {
        this.x = x
        this.y = y
        this.justHit = false
        this.play('bossBullet_animation')
    }

    // FUNCION PARA CREAR LAS ANIMACIONES DE LA BALA
    createAnimations () {
        this.scene.anims.create ({
            key: 'bossBullet_animation',
            frames: this.scene.anims.generateFrameNumbers('projectilesboss', { start: 0, end: 2 }),
            frameRate: 9,
            repeat: -1
        })
    }

    // FUNCION PARA CUANDO RECIBE DAÑO
    hit (enemy) {
        if (!this.justHit) {
            this.justHit = true;
            enemy.getHit(this.dmg);
            this.release()
        }
    }

    // FUNCION PARA LIBERAR LA BALA DE LA POOL
    release(){
        this.scene.bossPool.releaseBullet(this);
    }
}