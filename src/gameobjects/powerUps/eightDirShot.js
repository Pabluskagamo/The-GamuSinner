import PowerUp from "./powerUp"
import { Directions } from "../utils/directions"

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