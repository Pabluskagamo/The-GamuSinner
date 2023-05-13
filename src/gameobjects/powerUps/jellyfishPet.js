// CLASE DE LA MASCOTA

export default class JellyfishPet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y){
        super(scene, x, y, "jellyfish");

        this.key = "jellyfish"
        this.speed = 20

        this.setScale(1.5)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this)

        this.scene.anims.create({
            key: 'move_jellyfish',
            frames: this.scene.anims.generateFrameNumbers('jellyfishpet', {start: 14, end: 18}),
            frameRate: 7,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'hide_jellyfish',
            frames: this.scene.anims.generateFrameNumbers('jellyfishpet', { start: 21, end: 27 }),
            frameRate: 7,
            repeat: 0
        })
        

        this.on('animationcomplete',() => {
            if (this.anims.currentAnim.key === 'hide_jellyfish') {
                this.x = -100
            } 
        })

        this.play('move_jellyfish')
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)
    }

    move(){
    }

    // FUNCION PARA OCULTARLA
    hide(){
        this.x = -150
        this.y = -150
    }

    // FUNCION PARA ATACAR
    attack(powerUp, passives, dir){
        powerUp.run(this.x, this.y, passives, dir)
    }

    // FUNCION PARA SEGUIR
    follow(x, y){
        this.x = x
        this.y = y
    }
}