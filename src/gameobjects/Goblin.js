import EnemyObject from "./enemyObject";

export default class Goblin extends EnemyObject {

    constructor(scene, x, y, speed, player) {
        super(scene, x, y, 'goblin', speed, 20, 20, 10);
        this.scene.add.existing(this);
        this.setScale(1.5);
        this.scene.physics.add.existing(this);

        this.player = player;
        this.speed = speed;

        this.setCollideWorldBounds();
        let f = this.frame;
        this.setSize(24, 48);

        this.scene.anims.create({
            key: 'down_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', { start: 6, end: 8 }),
            frameRate: 5,
            repeat: 0

        })

        this.scene.anims.create({
            key: 'up_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', { start: 42, end: 44 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'side_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', { start: 18, end: 20 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'static_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', { start: 6, end: 6 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'died_goblin',
            frames: this.scene.anims.generateFrameNumbers('muerte', { start: 7, end: 0 }),
            frameRate: 10,
            repeat: 0
        })

        this.on('animationcomplete', () => {
            if (this.anims.currentAnim.key !== 'died_goblin') {
                this.play('static_goblin');
            } else {
                this.toDestroy = true;
            }
        })

        this.play('static_goblin');

        this.g = this.scene.input.keyboard.addKey('G');
        this.j = this.scene.input.keyboard.addKey('J');
        this.k = this.scene.input.keyboard.addKey('K');
        this.l = this.scene.input.keyboard.addKey('L');
        this.i = this.scene.input.keyboard.addKey('I');
        this.cursor = this.scene.input.keyboard.createCursorKeys();
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)
        if (this.g.isDown) {
            this.play('died_goblin', true);
            this.flipX = false;
        }
        if (this.hp > 0) {
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.follow();
        } else {
            this.stopVertical();
            this.stopHorizontal();
        }

        // Si es necesario, la caja la destruimos al final del update para evitar errores
        if (this.toDestroy) {
            this.destroy();
        }

    }
}