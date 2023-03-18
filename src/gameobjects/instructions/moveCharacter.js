import MovableObject from "../movableObject";

export default class moveCharacter extends MovableObject {

    constructor(scene, x, y, speed, w_key, a_key, s_key, d_key, up_key, left_key, down_key, right_key) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);

        this.scene.anims.create({
            key: 'mainChar_controls_abajo',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 130, end: 138 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'mainChar_controls_arriba',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 104, end: 112 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'mainChar_controls_lado',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 117, end: 125 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'W_Press',
            frames: this.anims.generateFrameNumbers('w_key', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'A_Press',
            frames: this.anims.generateFrameNumbers('a_key', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'S_Press',
            frames: this.anims.generateFrameNumbers('s_key', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'D_Press',
            frames: this.anims.generateFrameNumbers('d_key', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'UP_Press',
            frames: this.anims.generateFrameNumbers('up_key', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'LEFT_Press',
            frames: this.anims.generateFrameNumbers('left_key', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'DOWN_Press',
            frames: this.anims.generateFrameNumbers('down_key', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'RIGHT_Press',
            frames: this.anims.generateFrameNumbers('right_key', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        });

        this.play('mainChar_controls_abajo');
        s_key.play('S_Press');
        down_key.play('DOWN_Press');


        this.on('animationcomplete', (param1, param2, param3) => {
            if (this.anims.currentAnim.key == 'mainChar_controls_abajo') {
                this.play('mainChar_controls_lado');
                this.flipX = true;
                d_key.play('D_Press');
                right_key.play('RIGHT_Press');
            }
            else if (this.anims.currentAnim.key == 'mainChar_controls_lado' && this.flipX) {
                this.play('mainChar_controls_arriba');
                w_key.play('W_Press');
                up_key.play('UP_Press');
            }
            else if (this.anims.currentAnim.key == 'mainChar_controls_arriba') {
                this.play('mainChar_controls_lado');
                this.flipX = false;
                a_key.play('A_Press');
                left_key.play('LEFT_Press');
            }
            else if (this.anims.currentAnim.key == 'mainChar_controls_lado' && !this.flipX) {
                this.play('mainChar_controls_abajo');
                s_key.play('S_Press');
                down_key.play('DOWN_Press');
            }
        })
    }
}