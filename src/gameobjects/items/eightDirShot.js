import PowerUp from "./powerUp"
import { Directions } from "../utils/directions"

export default class EightDirShot extends PowerUp{

    constructor(scene, x, y) {
        super(scene, x, y, "eigthDirShot");
        this.numDirections = 8;
        this.scene.anims.create({
            key: 'eightDirShot_animation',
            frames: this.scene.anims.generateFrameNumbers('multishoot', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        })
        this.play('eightDirShot_animation')
    }

    run(charX, charY) {
        if (this.scene.bulletPool.hasBullets()) {
            let arrayDirections = Object.values(Directions)
            for(let i = 0; i < this.numDirections; i++) {
                let tempBullet = this.scene.bulletPool.spawn(charX, charY)
                tempBullet.setDireccion(arrayDirections[i].normalize())
            }
        }
    }
}