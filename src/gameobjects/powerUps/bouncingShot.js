import PowerUp from "./powerUp"

// CLASE DEL POWER-UP DE DISPARO REBOTANTE

export default class BouncingShot extends PowerUp{

    constructor(scene, x, y){
        super(scene, x, y, "bouncingShot", true)
        
        this.scene.anims.create({
            key: 'bouncingShot_animation',
            frames: this.scene.anims.generateFrameNumbers('bouncingshot', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        })
        this.play('bouncingShot_animation')
    }

    // FUNCION PARA ACTIVAR EL REBOTE
    run (bullet) {
        bullet.activateBouncing()
    }
}