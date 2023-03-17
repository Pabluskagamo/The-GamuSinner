import MovableObject from "../movableObject";

export default class shootCharacter extends MovableObject {

    constructor(scene, x, y, speed) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);

        this.scene.anims.create({
            key: 'mainChar_shootarriba',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 52, end: 59 }),
            frameRate: 6,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_shootabajo',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 78, end: 85 }),
            frameRate: 6,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_shootlado',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 65, end: 72 }),
            frameRate: 6,
            repeat: 0
        })

        this.play('mainChar_shootabajo');


        this.on('animationcomplete', (param1, param2, param3) => {
            if (this.anims.currentAnim.key == 'mainChar_shootabajo') {
                this.play('mainChar_shootlado')
                this.flipX = true;
            }
            else if (this.anims.currentAnim.key == 'mainChar_shootlado' && this.flipX) {
                this.play('mainChar_shootarriba')
            }
            else if (this.anims.currentAnim.key == 'mainChar_shootarriba') {
                this.play('mainChar_shootlado')
                this.flipX = false;
            }
            else if (this.anims.currentAnim.key == 'mainChar_shootlado' && !this.flipX) {
                this.play('mainChar_shootabajo')
            }
        })
    }
}