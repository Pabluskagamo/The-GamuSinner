import MovableObject from "../movableObject";

export default class shootCharacter extends MovableObject {

    constructor(scene, x, y, speed, up_key, left_key, down_key, right_key) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);

        this.scene.anims.create({
            key: 'mainChar_controls_shootlado',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 40, end: 43 }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'UP_Press',
            frames: this.anims.generateFrameNumbers('up_key', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'LEFT_Press',
            frames: this.anims.generateFrameNumbers('left_key', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'DOWN_Press',
            frames: this.anims.generateFrameNumbers('down_key', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'RIGHT_Press',
            frames: this.anims.generateFrameNumbers('right_key', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: 0
        });

        this.play('mainChar_controls_shootlado');
        down_key.play('DOWN_Press');

        down_key.on('animationcomplete', (param1, param2, param3) => {
            this.play('mainChar_controls_shootlado');
            right_key.play('RIGHT_Press');
        })
        right_key.on('animationcomplete', (param1, param2, param3) => {
            this.play('mainChar_controls_shootlado');
            up_key.play('UP_Press');
        })
        up_key.on('animationcomplete', (param1, param2, param3) => {
            this.play('mainChar_controls_shootlado');
            left_key.play('LEFT_Press');
        })
        left_key.on('animationcomplete', (param1, param2, param3) => {
            this.play('mainChar_controls_shootlado');
            down_key.play('DOWN_Press');
        })
    }
}