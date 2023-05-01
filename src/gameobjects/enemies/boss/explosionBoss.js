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
            frames: this.scene.anims.generateFrameNumbers('explosion', {start: 0, end: 3}),
            //frameRate: 10,
            duration: 5000,
            repeat: 5
        })

        this.scene.anims.create({
            key: 'spawn_explosion',
            frames: this.scene.anims.generateFrameNumbers('explosion', {frames: [3,2,1,0]}),
            duration: 10000,
            repeat: 0
        })

        this.on('animationcomplete',() => {
            if (this.anims.currentAnim.key === 'spawn_explosion') {
                console.log("va a explotaaaaaaaaaaaaaaaaaar")
                this.play('hit_explosion')
                this.explode()
            }
            if (this.anims.currentAnim.key === 'hit_explosion') {
                console.log("ha explotaaaoooooooooo")
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
        this.overlap = false
        //SONIDO DE SPWAN?
        this.play('spawn_explosion')
    }

    explode(){
        //play de sonido de esplosion
        this.overlap = false
    }

    hide(){
        this.x = -150
        this.y = -150
    }

    hit(enemy){
        enemy.getHit(this.dmg)
    }
}