import EnemyObject from "./enemyObject";

export default class DemonBoss extends EnemyObject {

    constructor(scene, x, y, speed, player, enemypool) {
        super(scene, x, y, 'demonboss', speed, 20, enemypool, 60, 20);
        this.scene.add.existing(this);
        //this.key = 'demonboss'
        
        this.setScale(1.5);

        this.player = player;
        //this.attacking = false;
        this.following = true

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
            key: 'down_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 22, end: 33 }),
            frameRate: 12,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'up_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 22, end: 33 }),
            frameRate: 12,
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
            frameRate: 8,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'hit_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 66, end: 70 }),
            frameRate: 8,
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
            frameRate: 15,
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
                this.setVisible(false)
                this.body.enable = false;
            }

            if (this.anims.currentAnim.key === 'hit_demonboss') {
                this.following = true
            }

            if (/attack/.test(this.anims.currentAnim.key)){
                this.attacking = false;
            }
        })


        this.play('static_demonboss');
    }

    follow(){
        this.flipX = true;

        if (this.body.velocity.x > 0 && this.body.velocity.y < 0) {
            // Diagonal abajo-derecha
            this.play('side_' + this.key, true);
            //this.angle = -0.1;
        } else if (this.body.velocity.x > 0 && this.body.velocity.y > 0) {
            // Diagonal arriba-derecha
            this.play('side_' + this.key, true);
            //this.angle += 0.1;
        } else if (this.body.velocity.x < 0 && this.body.velocity.y < 0) {
            // Diagonal abajo-izquierda
            this.play('side_' + this.key, true);
            this.flipX = false;
            //this.angle += 0.1;
        } else if (this.body.velocity.x < 0 && this.body.velocity.y > 0) {
            // Diagonal arriba-izquierda
            this.play('side_' + this.key, true);
            this.flipX = false;
            //this.angle += -0.1;
        } else if (this.body.velocity.y > 0 && this.body.velocity.x === 0) {
            // Movimiento hacia abajo
            this.play('down' + this.key, true);
        } else if (this.body.velocity.y < 0 && this.body.velocity.x === 0) {
            // Movimiento hacia arriba
            this.play('up' + this.key, true);
        }else if (this.body.velocity.x !== 0 && this.body.velocity.y < 5) {
            // Movimiento hacia los lados
            this.play('side_' + this.key, true);
            this.flipX = this.body.velocity.x > 0;
        } else {
            // Reproducir la animación estática si no se está moviendo
            this.play('static' + this.key);
        }
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        if (this.hp > 0 && !this.attacking && !this.player.isDead() && this.following) {
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

    hitEnemy(dmg){
        this.play('hit_demonboss')
        this.hp -= dmg;

        console.log(this.key, this.hp, '/', this.initialHp)

        if(this.hp <= 0){
            this.dieMe();
        }
        
        //this.following = false
    }
}