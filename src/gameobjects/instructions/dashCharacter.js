import MovableObject from "../movableObject";

export default class dashCharacter extends MovableObject {

    constructor(scene, x, y, speed, tab_key) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);

        this.scene.anims.create({
            key: 'mainChar_controls_static',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 182, end: 187 }),
            frameRate: 5,
            repeat: 1
        });

        this.scene.anims.create({
            key: 'TAB_Press',
            frames: this.scene.anims.generateFrameNumbers('tab_key', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: 0
        });

        this.play('mainChar_controls_static');
        tab_key.play('TAB_Press');

        this.on('animationcomplete', (param1, param2, param3) => {
            if (this.anims.currentAnim.key == 'mainChar_controls_static') {
                this.play('mainChar_controls_static');
                tab_key.play('TAB_Press');
            }
        });

    }
}