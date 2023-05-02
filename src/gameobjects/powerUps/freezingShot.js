import PowerUp from "./powerUp"

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

    run (bullet) {
        bullet.activateFreezing()
    }
}