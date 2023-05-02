import { Directions } from "../../utils/directions";
import EnemyObject from "../enemyObject";

export default class DemonBoss extends EnemyObject {

    constructor(scene, x, y, speed, player, bossPool, enemyPool) {
        super(scene, x, y, 'demonboss', speed, 20, bossPool, 100, 20);
        this.scene.add.existing(this);
        this.key = 'slime'
        
        this.setScale(2);
        this.enemyPool = enemyPool;
        this.player = player;
        this.attacking = false;
        this.transformation = false
        this.onTransformation = false
        this.rageMode = false
        this.following = true
        //this.body.immovable = true;
        

        this.specialAttacks = [this.jumpSmash]

        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds();
        this.originalWidth = this.body.width
        this.originalHeight = this.body.height
        this.hitBoxSlime()
        
        this.hpForDrop = 0;
        this.dmgAcum = 0;
        this.startHp = 2000
        this.nExplotions = 4
        this.numDirections = 4
        this.bulletMultiplier = 3
        this.bulletSpread = 0.6
        this.nSpawnEnmies = 3

        this.createAnimations();
    }

    hitBoxSlime(){
        this.bodyOffsetWidth = this.originalWidth /4.27;
        this.bodyOffsetHeight = this.originalHeight / 2.35;
        this.bodyWidth = this.originalWidth / 12;
        this.bodyHeight = this.originalHeight / 6.5;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;
    }

    hitBoxDemon(){
        this.bodyOffsetWidth = this.originalWidth /5;
        this.bodyOffsetHeight = this.originalHeight / 4;
        this.bodyWidth = this.originalWidth / 5.3;
        this.bodyHeight = this.originalHeight / 2;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;
    }
   /*  this.bodyOffsetWidth = this.originalWidth /4;
    this.bodyOffsetHeight = this.originalHeight / 4;
    this.bodyWidth = this.originalWidth / 4;
    this.bodyHeight = this.originalHeight / 2;

    this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
    this.body.width = this.bodyWidth;
    this.body.height = this.bodyHeight; */

    hitBoxBlastLeft(){
        this.bodyOffsetWidth = this.originalWidth /26;
        this.bodyOffsetHeight = this.originalHeight / 12;
        this.bodyWidth = this.originalWidth /1.9;
        this.bodyHeight = this.originalHeight / 1.2;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;
    }

    hitBoxBlastRight(){
        this.bodyOffsetWidth = this.originalWidth /5;
        this.bodyOffsetHeight = this.originalHeight / 14;
        this.bodyWidth = this.originalWidth /1.9;
        this.bodyHeight = this.originalHeight / 1.2;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;
    }

    hitBoxJump(){
        this.bodyOffsetWidth = this.originalWidth /14;
        this.bodyOffsetHeight = this.originalHeight / 4;
        this.bodyWidth = this.originalWidth / 1.4;
        this.bodyHeight = this.originalHeight / 2;

        this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
        this.body.width = this.bodyWidth;
        this.body.height = this.bodyHeight;
    }

    createAnimations(){
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
            //frameRate: 7,
            duration: 2000,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'jumpSmash_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 224, end: 241 }),
            frameRate: 10,
            repeat: 1
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
            frameRate: 15,
            duration: 1000,
            repeat: 2,
            repeatDelay: 500
        })

        this.scene.anims.create({
            key: 'invokeEnemies_demonboss',
            frames: this.scene.anims.generateFrameNumbers('demonboss', { start: 288, end: 293 }),
            frameRate: 15,
            // duration: 5000,
            repeat: 15,
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

            if (this.anims.currentAnim.key === 'hit_slime') {
                this.isHitting = false
            }

            if (this.anims.currentAnim.key === 'jumpSmash_demonboss') {
                this.hitBoxDemon()
                this.attacking = false;
                this.addAttackTimer(3000)
            }
            
            if (this.anims.currentAnim.key === 'transformation_demonboss') {
                this.hitBoxDemon();
                this.onTransformation = false
                this.addAttackTimer(3000)
            }
            if (this.anims.currentAnim.key === 'spell_demonboss') {
                this.attacking = false;
                this.addAttackTimer(5000)
            }

            if (this.anims.currentAnim.key === 'invokeEnemies_demonboss') {
                this.attacking = false;
                this.addAttackTimer(5000)
            }

            if (this.anims.currentAnim.key === 'fireBlast_demonboss') {
                this.hitBoxDemon()
                this.addAttackTimer(4000)
                this.attacking = false;
            }

            if (this.anims.currentAnim.key === 'rage_demonboss') {
                this.addAttackTimer(3000)
                this.attacking = false;
                console.log("he dejado de atacar despues del rage"+this.attacking)
            }
            
            if (/attack/.test(this.anims.currentAnim.key)){
                this.attacking = false;
            }
        })

        this.on('animationrepeat', () => {
            if (this.anims.currentAnim.key === 'spell_demonboss') {
                this.bulletSpell()
            }
            if (this.anims.currentAnim.key === 'jumpSmash_demonboss') {
                this.spawnExplosions()
                this.hitBoxJump()
            }
        })

        this.on('animationstart', () => {
            if (this.anims.currentAnim.key === 'spell_demonboss') {
                this.bulletSpell()
            }
        })

        this.play('static_demonboss');
    }

    follow(){
        this.flipX = true;

        if(this.isHitting && !this.attacking){
            this.play('hit_' + this.key, true);
            this.flipX = (this.body.velocity.x > 0 && this.key === 'demonboss') || (this.body.velocity.x > 0 && this.key === 'slime');
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
        }else if (this.body.velocity.y > 0 && this.body.velocity.x === 0) {
            // Movimiento hacia abajo
            this.play('side_' + this.key, true);
        } else if (this.body.velocity.y < 0 && this.body.velocity.x === 0) {
            // Movimiento hacia arriba
            this.play('side_' + this.key, true);
        } else if (this.body.velocity.x !== 0 && this.body.velocity.y < 5) {
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
        
        if (this.hp > 0 && !this.attacking && !this.onTransformation && !this.player.isDead()) {
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.follow();
        } else {
            this.stopVertical();
            this.stopHorizontal();
        }
    }

    attack(enemie) {
        if (!this.attacking && !this.onTransformation && !this.isDead() && !this.player.isDead()) {
            this.attacking = true;
            //this.play('fireBlast_demonboss');
            //this.flipX = (this.body.velocity.x > 0 && this.key === 'demonboss') || (this.body.velocity.x > 0 && this.key === 'slime');
            this.flipX = this.body.velocity.x > 0
            this.play('jumpSmash_demonboss');
            /* this.play('attack_' + this.key);
            enemie.getHit(1) */
        }
    }

    hitEnemy(dmg) {
        if (!this.onTransformation) {
            console.log(this.key, this.hp, '/', this.startHp)

            this.isHitting = true

            //REVISAR
            if (!this.attacking) {
            }

            this.hp -= dmg;
            this.scene.events.emit("bossHit" , dmg);

            this.hpForDrop += dmg
            if (this.hpForDrop >= (this.startHp*0.2) && this.transformation) {
                this.drop()
                this.hpForDrop = 0
            }

            if(this.hp <= 0){
                this.dieMe();
            }

            this.lvlUp()
        }
    }

    dieMe() {
        if (!this.transformation) {
            this.transform()
        } else {
            this.attackTimer.remove()
            this.hp = 0;
            this.drop()
            this.play('died_' + this.key, true);
        }
    }

    transform(){
        this.scene.events.emit("bossStart", this.startHp)
        this.key = 'demonboss'
        this.hpForDrop = 0
        this.hp = this.startHp;
        this.transformation = true;
        this.onTransformation = true;
        this.isHitting = false
        this.attacking = false
        this.play('transformation_demonboss', true);
    }

    drop(){
        if(this.scene.foodPool.hasFood() && Phaser.Math.FloatBetween(0, 1) < 0.1){
            this.scene.foodPool.spawn(this.x, this.y);
        }
        this.scene.powerUpPool.spawn(this.x, this.y);
    }

    runSpecialAttack(){
        this.attacking = true;
        
        switch (Phaser.Math.Between(0, 2)) {
            case 0: this.jumpSmash();
                break;
            case 1: this.play("spell_demonboss")
                break;
            case 2: this.fireBlast()
                break;
            default: this.play("spell_demonboss")
                break;
        }
    }

    fireBlast() {
        this.hitBoxBlastRight()
        this.spawnEnemies()
        this.play("fireBlast_demonboss")
    }

    spawnEnemies() {
        let offsetSign = [1,-1]
        let enemy
        for (let i = 0; i < this.nSpawnEnmies; i++) {
            enemy = this.enemyPool.spawnGob(Phaser.Math.Between(this.x, this.x+(offsetSign[i%2]*80)), Phaser.Math.Between(this.y, this.y+(offsetSign[i%2]*80)))
            enemy.slow(20)
        }
        //this.scene.spawnsBoss(this.nSpawnEnmies, this.x, this.y)
    }

    jumpSmash() {
        //this.hitBoxJump()
        this.play('jumpSmash_demonboss')
    }

    spawnExplosions(){
        for(let i = 0; i < this.nExplotions; i++){
            //this.pool.spawnExplosion(Phaser.Math.Between(0, this.scene.game.canvas.width), Phaser.Math.Between(0, this.scene.game.canvas.height))
            this.pool.spawnExplosion(Phaser.Math.Between(80, this.scene.game.canvas.width-80), Phaser.Math.Between(60, this.scene.game.canvas.height-60))
        }
    }

    bulletSpell() {
        if (this.pool.hasBullets()) {
            let offsetSign = [1,-1]
            let arrayDirections = Object.values(Directions)
            for(let i = 0; i < this.numDirections; i++){
                for(let j = 0; j < this.bulletMultiplier; j++){
                    let offsetFactor = Math.ceil(j/2)
                    let dirSpread = arrayDirections[i].y === 0 ? 2 : 1
                    let bulletDir = new Phaser.Math.Vector2(
                        arrayDirections[i].x+((dirSpread%2)*offsetSign[j%2]*offsetFactor*this.bulletSpread),
                        arrayDirections[i].y+((dirSpread/2)*offsetSign[j%2]*offsetFactor*this.bulletSpread)
                    ).normalize()
                    let tempBullet = this.pool.spawnBullet(this.x, this.y)
                    tempBullet.setDireccion(bulletDir)
                }
            }
        }
    }


    invokeEnemies(){
        this.play('invokeEnemies_demonboss')
        for(let i = 0; i < 10; i++) {
            const randX = Phaser.Math.RND.between(-100, 100);
            const randY = Phaser.Math.RND.between(-100, 100);

            this.pool.spawnEnemy(this.x + randX, this.y + randY)
        }
    }


    addAttackTimer(t){
        this.attackTimer = this.scene.time.addEvent({
            delay: t,
            callback: this.runSpecialAttack,
            callbackScope: this,
            loop: false
        });
    }

    lvlUp() {
        if(this.hp <= this.startHp/2 && this.key === 'demonboss' && !this.rageMode){
            this.rageMode = true
            /* this.attacking = true
            this.play('rage_demonboss') */
            this.nExplotions = 7
            this.numDirections = 8
            this.bulletMultiplier = 6
            this.bulletSpread = 0.3
            this.nSpawnEnmies = 5
        }
    }

    slow(slow){
    }
}