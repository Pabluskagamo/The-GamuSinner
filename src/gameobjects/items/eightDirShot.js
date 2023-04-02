import PowerUp from "./powerUp"

export default class EightDirShot extends PowerUp{

    constructor(scene, x, y){
        super(scene, x, y, "eightDirShot");
        this.setScale(1.5)
        this.scene.anims.create({
            key: 'eightDirShot_animation',
            frames: this.scene.anims.generateFrameNumbers('fire2', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        })
        this.play('eightDirShot_animation')
    }
}