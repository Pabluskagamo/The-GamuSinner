import MovableObject from "../movableObject";

export default class EnemyObject extends MovableObject {
    
    
    constructor(scene, x, y, key, speed, firstFrame, enemypool, hp, dmg) {
        super(scene, x, y, key, speed, firstFrame)
        this.key = key
        this.initialHp = hp
        this.initialSpeed = speed
        this.hp = hp
        this.speed = speed
        this.dmg = dmg
        this.pool = enemypool
        this.attacking = false
    }

    restoreEnemy(){
       this.hp = this.initialHp
       this.speed = this.initialSpeed
       this.attacking = false
    }

    // Por como funciona el flip con los side walk hay que cargar siempre sprites andando hacia la derecha
    follow(){
        this.flipX = false;
        
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
            this.flipX = true;
            //this.angle += 0.1;
        } else if (this.body.velocity.x < 0 && this.body.velocity.y > 0) {
            // Diagonal arriba-izquierda
            this.play('side_' + this.key, true);
            this.flipX = true;
            //this.angle += -0.1;
        } else if (this.body.velocity.y > 0 && this.body.velocity.x === 0) {
            // Movimiento hacia abajo
            this.play('down_' + this.key, true);
        } else if (this.body.velocity.y < 0 && this.body.velocity.x === 0) {
            // Movimiento hacia arriba
            this.play('up_' + this.key, true);
        }else if (this.body.velocity.x !== 0 && this.body.velocity.y < 5) {
            // Movimiento hacia los lados
            this.play('side_' + this.key, true);
            this.flipX = this.body.velocity.x > 0;
        } else {
            // Reproducir la animación estática si no se está moviendo
            this.play('static_' + this.key);
        }
    }

    dieMe(){
        this.scene.sound.add(this.key + "_die", {
            volume: 0.2,
            loop: false
        }).play();
        this.hp = 0;
        this.drop()
        this.play('died_' + this.key, true);
    }

    drop(){
        
        if (this.scene.coinPool.hasCoins() && Phaser.Math.FloatBetween(0, 1) < 0.7){
            this.scene.coinPool.spawn(this.x, this.y);
        }
        
        if(this.scene.foodPool.hasFood() && Phaser.Math.FloatBetween(0, 1) < 0.1){
            this.scene.foodPool.spawn(this.x, this.y);
        }

        if(this.scene.powerUpPool.hasPowerUps() && Phaser.Math.FloatBetween(0, 1) < 0.25){
            this.scene.powerUpPool.spawn(this.x, this.y);
        }

    }

    hitEnemy(dmg){
        this.hp -= dmg;

        console.log(this.key, this.hp, '/', this.initialHp)

        if(this.hp <= 0){
            this.dieMe();
        }
    }

    slow(slow){
        this.speed -= slow;
        if (this.speed <= 0) {
            this.speed = 0
        }
    }
    
    attack() {
        this.flipX = this.body.velocity.x > 0;
        this.play('attack_' + this.key);
    }

    isDead(){
        return this.hp === 0;
    }
}
/*this.play('freezed_' + this.key, true).clearTint();
if (this.freezed && this.speed === 0) {
    this.play('freezed_' + this.key, true).setTint(0x4fb3ec)
}else*/