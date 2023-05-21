import EnemyObject from "./enemyObject";

export default class Rock extends EnemyObject{

    constructor(scene, x, y, speed, pool){
        super(scene, x, y, 'rock', 0);
        this.speed = speed;
        this.justHit = false;
        this.pool = pool

        this.setScale(1.5)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);  
        this.body.setSize(10, 10, true);
        this.createAnimations();

        this.play('rock_animation')

        this.setVelocity(speed, 0)

        // this.on('animationcomplete', () => {
        //     console.log(this.anims.currentAnim.key)
        //     if (this.anims.currentAnim.key === 'rock_breaks') {
        //         console.log("SE ROMPE PIEDRA")
        //         this.pool.release(this);
        //     } 
        // })

    }

    preUpdate(t,dt){
        if(!this.justHit){
            this.setRotation(this.rotation + Phaser.Math.DegToRad(3))
        }
    }


    createAnimations() {
        this.scene.anims.create({
            key: 'rock_animation',
            frames: this.scene.anims.generateFrameNumbers('cyclops_rock', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'rock_breaks',
            frames: this.scene.anims.generateFrameNumbers('cyclops_rock', { start: 1, end: 1 }),
            frameRate: 1,
            repeat: 0
        })

    }

    hit(){
        this.setRotation(0)
        this.justHit = true;
        this.play('rock_breaks')
        this.pool.release(this);
    }

    attack(enemie){
        enemie.getHit(1)
        this.justHit = true;
        this.pool.release(this);
    }

    setDirection(dir){
        this.setVelocity(dir.x*this.speed, dir.y*this.speed);
    }

    restoreEnemy(){
        this.play('rock_animation')
    }

    hitEnemy(dmg){
        this.pool.release(this);
    }

}