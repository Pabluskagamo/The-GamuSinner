import PowerUp from "./powerUp"
import { Directions } from "../utils/directions"

// CLASE DEL POWER-UP DE DISPARO EN 8 DIRECCIONES

export default class EightDirShot extends PowerUp{

    constructor(scene, x, y) {
        super(scene, x, y, "eightDirShot", false)
        this.numDirections = 8

        this.scene.anims.create({
            key: 'eightDirShot_animation',
            frames: this.scene.anims.generateFrameNumbers('multishot', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        })
        this.play('eightDirShot_animation')
    }

    // FUNCION PARA GENERAR LAS 8 DIRECCIONES EN LAS QUE DISPARAR
    run(charX, charY, passives) {
        if (this.scene.bulletPool.hasBullets()) {
            let arrayDirections = Object.values(Directions)
            for(let i = 0; i < this.numDirections; i++) {
                let tempBullet = this.scene.bulletPool.spawn(charX, charY, passives)
                tempBullet.setDireccion(arrayDirections[i].normalize())
            }
        }
    }
}