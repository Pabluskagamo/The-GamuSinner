import MovableObject from "./movableObject";

export default class enemyObject extends MovableObject {
    
    
    constructor(scene, x, y, key, speed, firstFrame) {
        super(scene, x, y, key, speed, firstFrame);
        this.key = key;
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



}