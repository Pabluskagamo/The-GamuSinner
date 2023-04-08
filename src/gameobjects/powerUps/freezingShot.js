import PowerUp from "./powerUp"
import { Directions } from "../utils/directions"

export default class freezingShot extends PowerUp{

    constructor(scene, x, y){
        super(scene, x, y, "multipleDirfreezingShotectionShot", true);
        this.scene.anims.create({
            key: 'freezingShot_animation',
            frames: this.scene.anims.generateFrameNumbers('fire', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        })
        this.play('freezingShot_animation')
    }

    runOnCollect(){
        this.scene.bulletPool.setFreezing(true)
    }

    runOnDisable(){
        this.scene.bulletPool.setFreezing(false)
    }
}