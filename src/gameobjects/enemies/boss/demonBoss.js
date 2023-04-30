import EnemyObject from "../enemies/enemyObject";

export default class DemonBoss extends EnemyObject {

    constructor(scene, x, y, speed, player, enemypool) {
        super(scene, x, y, 'demonboss', speed, 20, enemypool, 100, 20);
        this.scene.add.existing(this);
        this.key = 'slime'
        
        this.setScale(2);

        this.player = player;
        //this.attacking = false;
        this.transformation = false
        this.onTransformation = false
        this.following = true
        //this.body.immovable = true;

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

        this.hit = this.scene.load.spritesheet({
            key: 'hit',
            url: './assets/enemies/boss/boss_demon_slime/spritesheets/proyectiles.png',
            frameConfig: {
                frameWidth: 32,
                frameHeight: 32,
                startFrame: 13,
                endFrame: 15
            }
        });

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
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'static_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 128, end: 133 }),
            frameRate: 8,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'hit_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 320, end: 324 }),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'rage_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { frames: [352, 353, 354, 355, 356, 356, 356, 355, 354, 353, 192, 160] }),
            frameRate: 7,
            repeat: 0
        })
//32x12 13,14,15

        this.scene.anims.create({
            key: 'jumpSmash_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 224, end: 241 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'fireBlast_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 256, end: 276 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'spell_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 288, end: 293 }),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'transformation_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 96, end: 127 }),
            frameRate: 15,
            repeat: 0
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
            key: 'died_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 352, end: 373 }),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'attack_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', {start: 192, end: 206}),
            frameRate: 8,
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
            
            if (this.anims.currentAnim.key === 'transformation_demonboss') {
                this.onTransformation = false
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
            this.play('hit_' + this.key, true);
        } else if (this.body.velocity.x > 0 && this.body.velocity.y < 0) {
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
        } else {
            // Reproducir la animación estática si no se está moviendo
            this.play('static' + this.key);
        }
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        if (this.hp > 0 && !this.attacking && !this.onTransformation && !this.player.isDead()) {
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.follow();
        } else {
            this.stopVertical();
            this.stopHorizontal();
        }
    }

    attack(enemie){
        if (!this.attacking && !this.onTransformation && !this.isDead() && !this.player.isDead()) {
            this.attacking = true;
            this.flipX = (this.body.velocity.x < 0 && this.key !== 'slime') || (this.body.velocity.x > 0 && this.key === 'slime');
            this.play('attack_' + this.key);
            enemie.getHit(1)
        }
    }

    hitEnemy(dmg){
        if (!this.onTransformation) {
            this.tweenhit = this.scene.tweens.add({
                targets: this.hit,
                x: this.x,
                y: this.y,
                duration: 200,
            });

            this.hp -= dmg;

            console.log(this.key, this.hp, '/', this.initialHp)

            if(this.hp <= 0){
                this.dieMe();
            }
            
            this.isHitting = true
            this.scene.events.emit("bossHit" , dmg);
        }
    }

    dieMe(){
        if (!this.transformation) {
            this.key = 'demonboss'
            this.hp = 1000;
            this.transformation = true;
            this.onTransformation = true
            this.play('transformation_demonboss', true);
        } else {
            this.hp = 0;
            this.drop()
            this.play('died_' + this.key, true);
        }
    }

}