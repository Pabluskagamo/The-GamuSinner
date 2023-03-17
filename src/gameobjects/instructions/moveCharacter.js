import MovableObject from "../movableObject";

export default class moveCharacter extends MovableObject {

    constructor(scene, x, y, speed) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);

        this.scene.anims.create({
            key: 'mainChar_abajo',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 130, end: 138 }),
            frameRate: 6,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_arriba',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 104, end: 112 }),
            frameRate: 6,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'mainChar_lado',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 117, end: 125 }),
            frameRate: 6,
            repeat: 0
        })

        // this.on('animationcomplete',() => {
        //     console.log("FINALIZA ANIMACION")
        //     this.play('mainChar_static');
        // })

        this.play('mainChar_abajo');


        this.on('animationcomplete', (param1, param2, param3) => {
            if (this.anims.currentAnim.key == 'mainChar_abajo') {
                this.play('mainChar_lado')
                this.flipX = true;
            }
            else if (this.anims.currentAnim.key == 'mainChar_lado' && this.flipX) {
                this.play('mainChar_arriba')
            }
            else if (this.anims.currentAnim.key == 'mainChar_arriba') {
                this.play('mainChar_lado')
                this.flipX = false;
            }
            else if (this.anims.currentAnim.key == 'mainChar_lado' && !this.flipX) {
                this.play('mainChar_abajo')
            }
        })
    }
}