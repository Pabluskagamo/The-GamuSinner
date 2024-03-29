import EnemyObject from "./enemyObject";

// CLASE DEL GOBLIN

export default class Goblin extends EnemyObject {

    constructor(scene, x, y, speed, player, enemypool, hp) {
        super(scene, x, y, 'goblin', speed, 20, enemypool, hp, 10);
        this.scene.add.existing(this);
        this.setScale(2);
        this.scene.physics.add.existing(this);

        this.player = player;

        this.setCollideWorldBounds();
        this.bodyOffsetWidth = this.body.width / 6.6;
        this.bodyOffsetHeight = this.body.height / 3.3;
        this.bodyWidth = this.body.width / 2.3;
        this.bodyHeight = this.body.height / 2.5;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;

        this.scene.anims.create({
            key: 'side_goblin',
            //frames: this.scene.anims.generateFrameNumbers('goblin', { start: 56, end: 63 }),
            frames: this.scene.anims.generateFrameNumbers('goblin', { start: 8, end: 15 }),
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

        this.scene.anims.create({
            key: 'attack_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', { start: 64, end: 69 }),
            frameRate: 10,
            repeat: 0
        })

        this.on('animationcomplete', () => {
            if (this.anims.currentAnim.key === 'died_goblin') {
                this.pool.release(this);
            } 

            if (/attack/.test(this.anims.currentAnim.key)){
                this.attacking = false;
            }
        })

        this.play('static_goblin');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        // COMPRUEBA QUE SIEMPRE QUE TENGA VIDA Y NO ESTE ATACANDO, O ESTÉ MUERTO EL PERSONAJE, PERSIGA AL PERSONAJE, SI NO PARA
        if (this.hp > 0 && !this.attacking && !this.player.isDead()) {
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.follow();
        } else {
            this.stopVertical();
            this.stopHorizontal();
        }
    }

    // FUNCION PARA ATACAR AL PERSONAJE
    attack(enemie){
        if(!this.attacking && !this.isDead() && !this.player.isDead()){
            this.attacking = true;
            this.flipX = this.body.velocity.x > 0;
            this.play('attack_goblin');
            enemie.getHit(1)
        }
    }

}