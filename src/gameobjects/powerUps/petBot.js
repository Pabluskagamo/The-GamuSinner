import PowerUp from "./powerUp"

export default class PetBot extends PowerUp{

    constructor(scene, x, y){
        super(scene, x, y, "petbot", true)
        
        this.scene.anims.create({
            key: 'petbot_animation',
            frames: this.scene.anims.generateFrameNumbers('freezingshot', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        })
        this.play('petbot_animation')
    }

    run () {
    }
}