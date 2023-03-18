import MovableObject from "../movableObject";

export default class dashCharacter extends MovableObject {

    constructor(scene, x, y, speed) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);

        this.scene.anims.create({
            key: 'mainChar_controls_static',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 182, end: 187 }),
            frameRate: 5,
            repeat: 1
        })

        this.play('mainChar_controls_static');


    }
}