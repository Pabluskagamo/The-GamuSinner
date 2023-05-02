import PowerUp from "./powerUp"

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

    run (bullet) {
        bullet.activateBouncing()
    }
}