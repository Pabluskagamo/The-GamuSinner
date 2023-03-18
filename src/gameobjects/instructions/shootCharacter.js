import MovableObject from "../movableObject";

export default class shootCharacter extends MovableObject {

    constructor(scene, x, y, speed, spacebar_key) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);

        this.scene.anims.create({
            key: 'mainChar_controls_shootarriba',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 52, end: 59 }),
            frameRate: 5.3,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'mainChar_controls_shootabajo',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 78, end: 85 }),
            frameRate: 5.3,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'mainChar_controls_shootlado',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 65, end: 72 }),
            frameRate: 5.3,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'SPACEBAR_Press',
            frames: this.anims.generateFrameNumbers('spacebar_key', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        });

        this.play('mainChar_controls_shootabajo');
        spacebar_key.play('SPACEBAR_Press');

        this.on('animationcomplete', (param1, param2, param3) => {
            if (this.anims.currentAnim.key == 'mainChar_controls_shootabajo') {
                this.play('mainChar_controls_shootlado');
                this.flipX = true;
                spacebar_key.play('SPACEBAR_Press');
            }
            else if (this.anims.currentAnim.key == 'mainChar_controls_shootlado' && this.flipX) {
                this.play('mainChar_controls_shootarriba');
                spacebar_key.play('SPACEBAR_Press');
            }
            else if (this.anims.currentAnim.key == 'mainChar_controls_shootarriba') {
                this.play('mainChar_controls_shootlado');
                this.flipX = false;
                spacebar_key.play('SPACEBAR_Press');
            }
            else if (this.anims.currentAnim.key == 'mainChar_controls_shootlado' && !this.flipX) {
                this.play('mainChar_controls_shootabajo');
                spacebar_key.play('SPACEBAR_Press');
            }
        })
    }
}