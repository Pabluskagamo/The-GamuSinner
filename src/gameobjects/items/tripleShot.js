export default class TripleShot extends powerUP{

    constructor(scene, x, y){
        super(scene, x, y, "tripleShot");
        this.justHit = false;

        //this.setScale(1.5)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);  

        this.scene.anims.create({
            key: 'coin_animation',
            frames: this.scene.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        })
    }


    preUpdate(t, dt){
        super.preUpdate(t, dt)

        if (this.y > this.scene.game.config.height || this.y < 0 || this.x < 0 || this.x > this.scene.game.config.width) {
            this.scene.bulletPool.release(this);
        }
    }

    hit(enemie){
        if(!this.justHit){
            this.justHit = true;
            enemie.hitEnemy(this.dmg);
            this.scene.powerUpPool.release(this);
        }
    }

}