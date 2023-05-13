// CLASE DE LAS EXPLOSIONES DEL BOSS

export default class ExplosionBoss extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, dmg){
        super(scene, x, y, "explosion", );

        this.key = "explosion"
        this.dmg = dmg
        this.setScale(4)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this)
        this.createAnimations()

        this.explotionSound = this.scene.sound.add("bossExplotion", {
            volume: 0.1,
            loop: false
        });
    }

    // FUNCION PARA CREAR LAS ANIMACIONES
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
                this.explode()
            }else {
                this.scene.bossPool.releaseExplosion(this)
            }
        })
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)
    }

    // FUNCION PARA SPAWNEAR LAS EXPLOSIONES
    spawn(x, y){
        this.x = x
        this.y = y
        this.body.enable = false
        this.overlap = false
        
        //SONIDO DE SPWAN?
        this.play('spawn_explosion')
    }

    // FUNCION PARA CUANDO EXPLOTA
    explode(){
        //play de sonido de esplosion
        this.overlap = true
        this.body.enable = true
        this.playReverse('hit_explosion')
        this.explotionSound.play()
    }

    // FUNCION PARA OCULTARLAS
    hide(){
        this.x = -150
        this.y = -150
    }

    // FUNCION PARA QUITARLE VIDA AL PERSONAJE SI LE GOLPEA
    hit(enemy){
        enemy.getHit(this.dmg)
    }
}