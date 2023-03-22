import MovableObject from "./movableObject";

export default class enemyObject extends MovableObject {
    
    
    constructor(scene, x, y, key, speed, firstFrame, hp, dmg) {
        super(scene, x, y, key, speed, firstFrame);
        this.key = key;
        this.hp = hp;
        this.dmg = dmg;
    }

    follow(){
        if (this.body.velocity.x !== 0 && this.body.velocity.y < 5) {
            // Movimiento hacia los lados
            this.play('side_' + this.key, true);
            this.flipX = this.body.velocity.x > 0;
        } else if (this.body.velocity.x > 0 && this.body.velocity.y > 0) {
            // Diagonal abajo-derecha
            this.play('down_' + this.key, true);
        } else if (this.body.velocity.x > 0 && this.body.velocity.y < 0) {
            // Diagonal arriba-derecha
            this.play('up_' + this.key, true);
        } else if (this.body.velocity.x < 0 && this.body.velocity.y > 0) {
            // Diagonal abajo-izquierda
            this.play('down_' + this.key, true);
        } else if (this.body.velocity.x < 0 && this.body.velocity.y < 0) {
            // Diagonal arriba-izquierda
            this.play('up_' + this.key, true);
        } else if (this.body.velocity.y > 0 && this.body.velocity.x === 0) {
            // Movimiento hacia abajo
            this.play('down_' + this.key, true);
        } else if (this.body.velocity.y < 0 && this.body.velocity.x === 0) {
            // Movimiento hacia arriba
            this.play('up_' + this.key, true);
        } else {
            // Reproducir la animación estática si no se está moviendo
            this.play('static_' + this.key);
        }
    }

    dieMe(){
        this.hp = 0;
        this.play('died_' + this.key);
    }

    hitEnemy(dmg){
        this.hp -= dmg;

        console.log(this.hp)

        if(this.hp <= 0){
            this.dieMe();
        }

    }
    
    attack(){
        // AQUI IRIA LA ANIMACION
        return this.dmg;
    }

    isDead(){
        return this.hp === 0;
    }


}