export default class ExplosionBoss extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, dmg){
        super(scene, x, y, "explosion", );

        this.key = "explosion"
        this.dmg = dmg
        this.setScale(4)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this)

        this.createAnimations()
    }

    createAnimations(){
        this.scene.anims.create({
            key: 'hit_explosion',
            frames: this.scene.anims.generateFrameNumbers('explosion', {frames: [3,2,1,0]}),
            duration: 500,
            repeat: 2
        })

        this.scene.anims.create({
            key: 'spawn_explosion',
            frames: this.scene.anims.generateFrameNumbers('explosion', {frames: [3,2,1,0]}),
            duration: 1000,
            repeat: 0
        })

        this.on('animationcomplete',() => {
            if (this.anims.currentAnim.key === 'spawn_explosion') {
                console.log("va a explotaaaaaaaaaaaaaaaaaar")
                this.explode()
            }else {
                console.log("ha explotaaaoooooooooo", this.anims.currentAnim.key)
                this.scene.bossPool.releaseExplosion(this)
            }
        })
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)
    }

    spawn(x, y){
        this.x = x
        this.y = y
        this.body.enable = false
        this.overlap = false
        //SONIDO DE SPWAN?
        this.play('spawn_explosion')
    }

    explode(){
        //play de sonido de esplosion
        this.overlap = true
        this.body.enable = true
        this.playReverse('hit_explosion')
    }

    hide(){
        this.x = -150
        this.y = -150
    }

    hit(enemy){
        enemy.getHit(this.dmg)
    }
}