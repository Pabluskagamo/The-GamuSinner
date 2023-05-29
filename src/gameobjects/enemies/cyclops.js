import EnemyObject from "./enemyObject";

// CLASE DE OLLIPARO

export default class Cyclops extends EnemyObject {

    constructor(scene, x, y, speed, player, enemypool, hp){
        super(scene, x, y, 'cyclops', speed, 20, enemypool, hp, 15)
        this.scene.add.existing(this);
        this.setScale(1.5);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds();

        this.player = player;
        //this.attacking = false;
        
        this.bodyOffsetWidth = this.body.width/5;
        this.bodyOffsetHeight = this.body.height/3.8;
        this.bodyWidth = this.body.width/2.9;
        this.bodyHeight = this.body.height/1.8;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;

        this.lastThrow = 0;

        this.scene.anims.create({
            key: 'up_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 30, end: 36}),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'down_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 30, end: 36}),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'side_cyclops',
            //rames: this.scene.anims.generateFrameNumbers('cyclops', {start: 165, end: 176}),
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 15, end: 26}),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'static_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {frames: [105,106,107,108,108,107,106,105,105,120,121,122,123,124,125,125,124,123,122,121,120,105,105]}),
            frameRate: 15,
            repeat: 0
        })

        /*this.scene.anims.create({
            key: 'freezed_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {frames: [0]}),
            frameRate: 15,
            repeat: 0
        })*/

        this.scene.anims.create({
            key: 'died_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', { start: 91, end: 97 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'attack_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 195, end: 207}),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'throw_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 195, end: 207}),
            frameRate: 15,
            repeat: 0
        })
        

        this.on('animationcomplete',() => {
            if (this.anims.currentAnim.key === 'died_cyclops') {
                this.pool.release(this);
            } 

            if (this.anims.currentAnim.key === 'throw_cyclops') {
                this.attacking = false;
                this.spawnRock()
            } 

            if (/attack/.test(this.anims.currentAnim.key)){
                this.attacking = false;
            }
        })

        this.play('static_cyclops');
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)

        // COMPRUEBA QUE SIEMPRE QUE TENGA VIDA Y NO ESTE ATACANDO, O ESTÉ MUERTO EL PERSONAJE, PERSIGA AL PERSONAJE, SI NO PARA
        if (this.hp > 0 && !this.attacking && !this.player.isDead()) {
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.follow();
        }else{
            this.stopVertical();
            this.stopHorizontal();
        }

        if(t > this.lastThrow && Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y) <= 200){
            this.throwRock()
            this.lastThrow = t + 3000;
        }

    }

    // FUNCION PARA ATACAR AL PERSONAJE
    attack(enemie){
        if(!this.attacking && !this.isDead() && !this.player.isDead()){
            this.attacking = true;
            super.attack()
            enemie.getHit(1)
        }
    }

    throwRock(){
        if(!this.attacking && !this.isDead()){
            this.attacking = true;
            this.flipX = this.body.velocity.x > 0;
            this.play('throw_cyclops')
        }
    }

    spawnRock(){
        let dir = new Phaser.Math.Vector2(this.player.x - this.x, this.player.y - this.y).normalize();
        this.pool.spawnCyBullet(this.x, this.y, dir)
    }

}