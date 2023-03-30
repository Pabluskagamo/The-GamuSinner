import MovableObject from "./movableObject";

export default class EnemyObject extends MovableObject {
    
    
    constructor(scene, x, y, key, speed, firstFrame, enemypool, hp, dmg) {
        super(scene, x, y, key, speed, firstFrame);
        this.key = key;
        this.hp = hp;
        this.initialHp = this.hp;
        this.dmg = dmg;
        this.pool = enemypool;
    }

    restoreEnemy(){
       this.hp = this.initialHp;
    }

    follow(){
        this.flipX = false;
        if (this.body.velocity.x > 0 && this.body.velocity.y < 0) {
            // Diagonal abajo-derecha
            this.play('side_' + this.key, true);
            this.flipX = true;
            //this.angle = -0.1;
        } else if (this.body.velocity.x > 0 && this.body.velocity.y > 0) {
            // Diagonal arriba-derecha
            this.play('side_' + this.key, true);
            this.flipX = true;
            //this.angle += 0.1;
        } else if (this.body.velocity.x < 0 && this.body.velocity.y < 0) {
            // Diagonal abajo-izquierda
            this.play('side_' + this.key, true);
            //this.angle += 0.1;
        } else if (this.body.velocity.x < 0 && this.body.velocity.y > 0) {
            // Diagonal arriba-izquierda
            this.play('side_' + this.key, true);
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
            this.flipX = this.body.velocity.x < 0;
        } else {
            // Reproducir la animación estática si no se está moviendo
            this.play('static_' + this.key);
        }
    }

    dieMe(){
        this.hp = 0;
        if (this.scene.coinPool.hasCoins() && Phaser.Math.RND.between(0, 1) < 0.9)
            this.scene.coinPool.spawn(this.x, this.y);
        this.play('died_' + this.key, true);
    }

    hitEnemy(dmg){
        this.hp -= dmg;

        console.log(this.key, this.hp, '/', this.initialHp)

        if(this.hp <= 0){
            this.dieMe();
        }

    }
    
    attack(){
        if (this.anims.currentAnim.key === 'down_' + this.key) {
            // ataque hacia abajo
            this.play('down_attack_' + this.key, true);
        } else if (this.anims.currentAnim.key === 'up_' + this.key) {
            // ataque hacia arriba
            this.play('up_attack_' + this.key, true);
        } else {
            this.flipX = this.body.velocity.x > 0;
            this.play('side_attack_' + this.key);
        }
    }

    isDead(){
        return this.hp === 0;
    }

}