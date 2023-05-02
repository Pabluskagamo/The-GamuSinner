import Bullet from "./bullet";

export default class EnemyBullet extends Bullet {

    constructor (scene, x, y, speed, dmg) {
        super(scene, x, y, speed, dmg)
        this.setScale(2)
        this.setSize(12, 12)
    }

    init (x, y) {
        this.x = x
        this.y = y
        this.justHit = false
        this.play('bossBullet_animation')
    }

    createAnimations () {
        this.scene.anims.create ({
            key: 'bossBullet_animation',
            frames: this.scene.anims.generateFrameNumbers('projectilesboss', { start: 0, end: 2 }),
            frameRate: 9,
            repeat: -1
        })
    }

    hit (enemy) {
        if (!this.justHit) {
            this.justHit = true;
            enemy.getHit(this.dmg);
            this.release()
        }
    }

    release(){
        this.scene.bossPool.releaseBullet(this);
    }
}