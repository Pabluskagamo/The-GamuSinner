import PowerUp from "./powerUp"
import { Directions } from "../utils/directions"

export default class BouncingShot extends PowerUp{

    constructor(scene, x, y){
        super(scene, x, y, "bouncingShot", true);
        this.setScale(1.5)
        this.scene.anims.create({
            key: 'bouncingShot_animation',
            frames: this.scene.anims.generateFrameNumbers('fire2', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        })
        this.play('bouncingShot_animation')
    }

    runOnCollect(){
        
    }
}