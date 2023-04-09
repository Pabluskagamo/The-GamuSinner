import PowerUp from "./powerUp"
import { Directions } from "../utils/directions"

export default class MultipleDirectionShot extends PowerUp{

    constructor(scene, x, y){
        super(scene, x, y, "multipleDirectionShot", false);
        this.numDirections = 8;
        this.bulletMultiplier = 3;
        this.bulletSpread = 0.3;
        this.setScale(1.5)
        this.scene.anims.create({
            key: 'multipleDirectionShot_animation',
            frames: this.scene.anims.generateFrameNumbers('multishot', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        })
       /*  this.play('multipleDirectionShot_animation') */
    }

    run(charX, charY) {
        if (this.scene.bulletPool.hasBullets()) {
            let offsetSign = [1,-1]
            let arrayDirections = Object.values(Directions)
            for(let i = 0; i < this.numDirections; i++){
                for(let j = 0; j < this.bulletMultiplier; j++){
                    let offsetFactor = Math.ceil(j/2)
                    let dirSpread = arrayDirections[i].y === 0 ? 2 : 1
                    let bulletDir = new Phaser.Math.Vector2(
                        arrayDirections[i].x+((dirSpread%2)*offsetSign[j%2]*offsetFactor*this.bulletSpread),
                        arrayDirections[i].y+((dirSpread/2)*offsetSign[j%2]*offsetFactor*this.bulletSpread)
                    ).normalize()
                    let tempBullet = this.scene.bulletPool.spawn(charX, charY)
                    tempBullet.setDireccion(bulletDir)
                }
            }
        }
    }

    static isCombo(power1, power2) {
        let combo = ["tripleShot", "eightDirShot", "multipleDirectionShot"]
        return power1.getKey() !== power2.getKey() && combo.includes(power1.getKey()) && combo.includes(power2.getKey())
    }
}