import EnemyObject from "./enemyObject";

export default class DemonBoss extends EnemyObject {

    constructor(scene, x, y, speed, player, enemypool) {
        super(scene, x, y, 'demonboss', speed, 20, enemypool, 60, 20);
        this.scene.add.existing(this);
        
        //this.setScale(1.5);

        this.player = player;
        //this.attacking = false;

        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds();

        /* this.bodyOffsetWidth = this.body.width / 4.7;
        this.bodyOffsetHeight = this.body.height / 2.7;
        this.bodyWidth = this.body.width / 2.5;
        this.bodyHeight = this.body.height / 1.8;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight; */


        this.scene.anims.create({
            key: 'down_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 22, end: 33 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'up_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 22, end: 33 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'side_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 22, end: 33 }),
            frameRate: 12,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'static_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 0, end: 5 }),
            frameRate: 1.5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'hit_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 66, end: 70 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'rage_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { frames: [88, 89, 90, 91, 92, 92, 92, 91, 90, 89] }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'died_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 88, end: 109 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'side_attack_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', {start: 44, end: 58}),
            frameRate: 15,
            repeat: 0
        })

        this.on('animationcomplete', () => {
            if (this.anims.currentAnim.key === 'died_demonboss') {
                this.pool.release(this);
            } 

            if (/attack/.test(this.anims.currentAnim.key)){
                this.attacking = false;
            }
        })

        this.play('static_demonboss');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        if (this.hp > 0 && !this.attacking && !this.player.isDead()) {
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.follow();
        }else{
            this.stopVertical();
            this.stopHorizontal();
        }
    }

    attack(enemie){
        if(!this.attacking && !this.isDead() && !this.player.isDead()){
            this.attacking = true;
            super.attack()
            enemie.getHit(1)
        }
    }
}