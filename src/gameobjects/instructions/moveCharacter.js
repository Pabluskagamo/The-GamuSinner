import MovableObject from "../movableObject";

export default class moveCharacter extends MovableObject {

    constructor(scene, x, y, speed, w_key, a_key, s_key, d_key) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);

        this.scene.anims.create({
            key: 'mainChar_controls_lado',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 8, end: 15 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'W_Press',
            frames: this.anims.generateFrameNumbers('w_key', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'A_Press',
            frames: this.anims.generateFrameNumbers('a_key', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'S_Press',
            frames: this.anims.generateFrameNumbers('s_key', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'D_Press',
            frames: this.anims.generateFrameNumbers('d_key', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: 0
        });

        this.play('mainChar_controls_lado');
        s_key.play('S_Press');

        s_key.on('animationcomplete', (param1, param2, param3) => {
            this.play('mainChar_controls_lado');
            d_key.play('D_Press');
        })
        d_key.on('animationcomplete', (param1, param2, param3) => {
            this.play('mainChar_controls_lado');
                w_key.play('W_Press');
        })
        w_key.on('animationcomplete', (param1, param2, param3) => {
            this.play('mainChar_controls_lado');
                a_key.play('A_Press');
        })
        a_key.on('animationcomplete', (param1, param2, param3) => {
            this.play('mainChar_controls_lado');
                s_key.play('S_Press');
        })
    }
}