import EnemyObject from "./enemyObject";

export default class BlackWolf extends EnemyObject {

    constructor(scene, x, y, speed, player) {
        super(scene, x, y, 'blackWolf', speed, 20, 60, 20);
        this.scene.add.existing(this);
        
        //this.setScale(1.5);

        this.speed = speed;
        this.player = player;
        this.attacking = false;

        this.scene.physics.add.existing(this);
        this.body.setImmovable(true)

        this.setCollideWorldBounds();

        this.bodyOffsetWidth = this.body.width / 4.7;
        this.bodyOffsetHeight = this.body.height / 2.7;
        this.bodyWidth = this.body.width / 2.5;
        this.bodyHeight = this.body.height / 1.8;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;


        this.scene.anims.create({
            key: 'down_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', { start: 180, end: 188 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'up_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', { start: 144, end: 152 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'side_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', { start: 162, end: 170 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'static_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', { start: 36, end: 37 }),
            frameRate: 1.5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'died_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', { start: 360, end: 365 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'up_attack_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', {frames: [397, 400, 403, 406, 409, 412]}),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'side_attack_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', {frames: [451, 454, 457, 460, 463, 466]}),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'down_attack_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', {frames: [505, 508, 511, 514, 517, 520]}),
            frameRate: 15,
            repeat: 0
        })

        this.on('animationcomplete', () => {
            if (this.anims.currentAnim.key === 'died_blackWolf') {
                this.toDestroy = true;
            } 

            if (/attack/.test(this.anims.currentAnim.key)){
                this.attacking = false;
            }
        })

        this.play('static_blackWolf');
    }

    preUpdate(t, dt) {
        super.preUpdate(    t, dt)

        if (this.hp > 0 && !this.attacking) {
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.follow();
        }else{
            this.stopVertical();
            this.stopHorizontal();
        }

        if (this.toDestroy) {
            this.destroy();
        }
    }

    attack(enemie){
        super.attack()
        this.attacking = true;

        enemie.getHit(1)
    }
}