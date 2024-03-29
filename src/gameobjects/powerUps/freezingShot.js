import PowerUp from "./powerUp"

// CLASE DEL POWER-UP DE DISPARO COGELANTE

export default class FreezingShot extends PowerUp{

    constructor(scene, x, y){
        super(scene, x, y, "multipleDirfreezingShotectionShot", true)
        
        this.scene.anims.create({
            key: 'freezingShot_animation',
            frames: this.scene.anims.generateFrameNumbers('freezingshot', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        })
        this.play('freezingShot_animation')
    }

    // FUNCION PARA ACTIVAR LA CONGELACION
    run (bullet) {
        bullet.activateFreezing()
    }
}