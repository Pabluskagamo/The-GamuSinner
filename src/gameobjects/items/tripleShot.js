import PowerUp from "./powerUp"

export default class TripleShot extends PowerUp{

    constructor(scene, x, y){
        super(scene, x, y, "tripleShot");

        this.scene.anims.create({
            key: 'tripleShot_animation',
            frames: this.scene.anims.generateFrameNumbers('fire', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        })
        this.play('tripleShot_animation')
    }
}