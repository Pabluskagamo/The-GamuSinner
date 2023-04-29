import EnemyObject from "../enemies/enemyObject";

export default class DemonBoss extends EnemyObject {

    constructor(scene, x, y, speed, player, enemypool) {
        super(scene, x, y, 'demonboss', speed, 20, enemypool, 1000, 20);
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
        this.dmgAcum = 0;


        this.scene.anims.create({
            key: 'down_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 160, end: 171 }),
            frameRate: 12,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'up_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 160, end: 171 }),
            frameRate: 12,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'side_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 160, end: 171 }),
            frameRate: 12,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'static_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 128, end: 133 }),
            frameRate: 8,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'hit_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 320, end: 324 }),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'rage_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { frames: [88, 89, 90, 91, 92, 92, 92, 91, 90, 89] }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'cast_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 288, end: 293 }),
            frameRate: 10,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'died_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 352, end: 373 }),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'side_attack_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', {start: 192, end: 206}),
            frameRate: 15,
            repeat: 0
        })

        this.on('animationcomplete', () => {
            if (this.anims.currentAnim.key === 'died_demonboss') {
                this.setVisible(false)
                this.body.enable = false;
            }

            if (this.anims.currentAnim.key === 'hit_demonboss') {
                this.isHitting = false
            }

            if (/attack/.test(this.anims.currentAnim.key)){
                this.attacking = false;
            }
        })

        this.isCasting = false;


        this.play('static_demonboss');
    }

    follow(){
        this.flipX = true;

        if(this.isHitting && !this.attacking){
            this.play('hit_demonboss', true);
        }else if (this.body.velocity.x > 0 && this.body.velocity.y < 0) {
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

        if (this.hp > 0 && !this.attacking && !this.player.isDead() && !this.isCasting) {
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
        if(!this.isCasting){
            if(!this.attacking){
                this.play('hit_demonboss')
            }
            this.hp -= dmg;
    
            console.log(this.key, this.hp, '/', this.initialHp)
    
            if(this.hp <= 0){
                this.dieMe();
            }
            
            this.isHitting = true
            this.scene.events.emit("bossHit" , dmg);
            this.dmgAcum += dmg;
    
            if(this.dmgAcum >= 300){
                this.isCasting = true;
                this.play('cast_demonboss')
                this.dmgAcum = 0;
                //cast

                this.bossCast()
                this.castTimer = this.scene.time.addEvent({
                    delay: 5000,
                    callback: ()=>{this.isCasting = false;},
                    callbackScope: this,
                    loop: false
                });
            }
        }
    }

    bossCast(){
        console.log("CASTEANDO", this.x, this.y)
        for(let i = 0; i< 10; i++) {
            const randX = Phaser.Math.RND.between(-100, 100);
            const randY = Phaser.Math.RND.between(-100, 100);

            this.pool.spawnGob(this.x + randX, this.y + randY)
        }
    }


}