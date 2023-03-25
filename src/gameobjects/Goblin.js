import EnemyObject from "./enemyObject";

export default class Goblin extends EnemyObject {

    constructor(scene, x, y, speed, player, enemypool) {
        super(scene, x, y, 'goblin', speed, 20, enemypool, 20, 10);
        this.scene.add.existing(this);
        this.setScale(2);
        this.scene.physics.add.existing(this);

        this.player = player;
        this.speed = speed;

        this.setCollideWorldBounds();
        this.bodyOffsetWidth = this.body.width / 6.6;
        this.bodyOffsetHeight = this.body.height / 3.3;
        this.bodyWidth = this.body.width / 2.3;
        this.bodyHeight = this.body.height / 2.5;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;

        this.scene.anims.create({
            key: 'down_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', { start: 0, end: 6 }),
            frameRate: 5,
            repeat: 0

        })

        this.scene.anims.create({
            key: 'up_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', { start: 0, end: 6 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'side_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', { start: 56, end: 63 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'static_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', { start: 0, end: 6 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'died_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', { start: 80, end: 85 }),
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
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)
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