import EnemyObject from "./enemyObject";

// CLASE DEL LOBISOME

export default class BlackWolf extends EnemyObject {

    constructor(scene, x, y, speed, player, enemypool, hp) {
        super(scene, x, y, 'blackWolf', speed, 20, enemypool, hp, 20);
        this.scene.add.existing(this);
        
        //this.setScale(1.5);

        this.player = player;
        //this.attacking = false;

        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds();

        this.bodyOffsetWidth = this.body.width / 4.7;
        this.bodyOffsetHeight = this.body.height / 2.7;
        this.bodyWidth = this.body.width / 2.5;
        this.bodyHeight = this.body.height / 1.8;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;

        this.scene.anims.create({
            key: 'side_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', { start: 198, end: 206 }),
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
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'attack_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', {frames: [451, 454, 457, 460, 463, 466]}),
            frameRate: 15,
            repeat: 0
        })

        this.on('animationcomplete', () => {
            if (this.anims.currentAnim.key === 'died_blackWolf') {
                this.pool.release(this);
            } 

            if (/attack/.test(this.anims.currentAnim.key)){
                this.attacking = false;
            }
        })

        this.play('static_blackWolf');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        // COMPRUEBA QUE SIEMPRE QUE TENGA VIDA Y NO ESTE ATACANDO, O ESTÉ MUERTO EL PERSONAJE, PERSIGA AL PERSONAJE, SI NO PARA
        if (this.hp > 0 && !this.attacking && !this.player.isDead()) {
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.follow();
        }else{
            this.stopVertical();
            this.stopHorizontal();
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
}