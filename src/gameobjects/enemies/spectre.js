import EnemyObject from "./enemyObject";

export default class Spectre extends EnemyObject{

    constructor(scene, x, y, speed, player, enemypool){
        super(scene, x, y, 'spectre', speed, 20, enemypool, 70, 15)
        this.scene.add.existing(this)
        this.setScale(1.5)
        this.scene.physics.add.existing(this)
        this.setCollideWorldBounds()

        this.player = player
        //this.attacking = false
        
        this.bodyOffsetWidth = this.body.width/5
        this.bodyOffsetHeight = this.body.height/3.8
        this.bodyWidth = this.body.width/2.9
        this.bodyHeight = this.body.height/1.8

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight)
        this.body.width = this.bodyWidth
        this.body.height = this.bodyHeight

        this.scene.anims.create({
            key: 'side_spectre',
            frames: this.scene.anims.generateFrameNumbers('spectre2', { start: 14, end: 17 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'static_spectre',
            frames: this.scene.anims.generateFrameNumbers('spectre2', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'died_spectre',
            frames: this.scene.anims.generateFrameNumbers('spectre2', { start: 21, end: 27 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'attack_spectre',
            frames: this.scene.anims.generateFrameNumbers('spectre2', { start: 7, end: 10 }),
            frameRate: 10,
            repeat: 0
        })

        this.on('animationcomplete',() => {
            if (this.anims.currentAnim.key === 'died_spectre') {
                this.pool.release(this);
            } 

            if (/attack/.test(this.anims.currentAnim.key)){
                this.attacking = false;
            }
        })

        this.play('static_spectre');
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)

        if (this.hp > 0 && !this.attacking && !this.player.isDead()) {
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
        if(!this.attacking && !this.isDead() && !this.player.isDead()){
            this.attacking = true;
            super.attack()
            enemie.getHit(1)
        }
    }

}