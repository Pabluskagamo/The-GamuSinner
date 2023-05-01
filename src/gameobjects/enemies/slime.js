import EnemyObject from "./enemyObject";

export default class Slime extends EnemyObject {

    constructor(scene, x, y, speed, player, bossPool){
        super(scene, x, y, 'slime', speed, 20, bossPool, 10, 40)
        this.scene.add.existing(this);
        this.setScale(1);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds();

        this.player = player;
        //this.attacking = false;
        
        this.bodyOffsetWidth = this.body.width;
        this.bodyOffsetHeight = this.body.height;
        this.bodyWidth = this.body.width;
        this.bodyHeight = this.body.height;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;
        this.createAnimations()
    }

    createAnimations(){
        this.scene.anims.create({
            key: 'static_slime',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'side_slime',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'attack_slime',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 32, end: 39 }),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'hit_slime',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 64, end: 69 }),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'died_slime',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 96, end: 101 }),
            frameRate: 15,
            repeat: 0
        })

        this.on('animationcomplete', () => {
            if (this.anims.currentAnim.key === 'died_slime') {
                this.pool.releaseEnemy(this);
            }

            if (/attack/.test(this.anims.currentAnim.key)){
                this.attacking = false;
            }
        })

        this.play('static_slime');
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

    follow(){
        this.flipX = true;

        if (this.body.velocity.x >= 0 && this.body.velocity.y <= 0) {
            // Diagonal abajo-derecha
            this.play('side_' + this.key, true);
            //this.angle = -0.1;
        } else if (this.body.velocity.x >= 0 && this.body.velocity.y >= 0) {
            // Diagonal arriba-derecha
            this.play('side_' + this.key, true);
            //this.angle += 0.1;
        } else if (this.body.velocity.x <= 0 && this.body.velocity.y <= 0) {
            // Diagonal abajo-izquierda
            this.play('side_' + this.key, true);
            this.flipX = false;
            //this.angle += 0.1;
        } else if (this.body.velocity.x <= 0 && this.body.velocity.y >= 0) {
            // Diagonal arriba-izquierda
            this.play('side_' + this.key, true);
            this.flipX = false;
            //this.angle += -0.1;
        } else {
            // Reproducir la animación estática si no se está moviendo
            this.play('static' + this.key);
        }
    }

    attack(enemie){
        if(!this.attacking && !this.isDead() && !this.player.isDead()){
            this.attacking = true;
            super.attack()
            enemie.getHit(1)
        }
    }

    dieMe(){
        this.hp = 0;
        this.drop()
        this.play('died_' + this.key, true);
    }
}