// CLASE DE OBJETOS CON MOVIMIENTO

export default class MovableObject extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, key, speed, firstFrame) {
        super(scene, x, y, key, firstFrame);
        this.speed = speed
        this.dir = new Phaser.Math.Vector2(0,1);
    }

    // FUNCION PARA MOVER HACIA ABAJO
    moveDown(){
        this.setVelocityX(0);
        this.setVelocityY(this.speed);
        this.dir.x = 0
        this.dir.y = 1
    }

    // FUNCION PARA MOVER HACIA ARRIBA
    moveUp(){
        this.setVelocityX(0);
        this.setVelocityY(-this.speed);
        this.dir.x = 0
        this.dir.y = -1
    }

    // FUNCION PARA MOVER HACIA LA IZQUIERDA
    moveLeft(){
        this.setVelocityX(-this.speed);
        this.setVelocityY(0);
        this.dir.x = -1
        this.dir.y = 0
    }

    // FUNCION PARA MOVER HACIA LA DERECHA
    moveRight(){
        this.setVelocityX(this.speed);
        this.setVelocityY(0);
        this.dir.x = 1
        this.dir.y = 0
    }

    // FUNCION PARA MOVER HACIA LA DIAGONAL SUPERIOR DERECHA
    moveRightUp(){
        const vec = new Phaser.Math.Vector2(this.speed,-this.speed).normalize();
        this.dir = vec.clone()
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    // FUNCION PARA MOVER HACIA LA DIAGONAL SUPERIOR IZQUIERDA
    moveLeftUp(){
        const vec = new Phaser.Math.Vector2(-this.speed,-this.speed).normalize();
        this.dir = vec.clone()
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    // FUNCION PARA MOVER HACIA LA DIAGONAL INFERIOR DERECHA
    moveRightDown(){
        const vec = new Phaser.Math.Vector2(this.speed,this.speed).normalize();
        this.dir = vec.clone()
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    // FUNCION PARA MOVER HACIA LA DIAGONAL INFERIOR IZQUIERDA
    moveLeftDown(){
        const vec = new Phaser.Math.Vector2(-this.speed,this.speed).normalize();
        this.dir = vec.clone()
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    // FUNCION PARA PARAR LA VELOCIDAD HORIZONTAL
    stopHorizontal(){
        this.setVelocityX(0);
    }

    // FUNCION PARA PARAR LA VELOCIDAD VERTICAL
    stopVertical(){
        this.setVelocityY(0);
    }

    // FUNCION PARA GENERAR FRICCION EN EL OBJETO
    frictionEffect(){
        if(this.body.velocity.x > 5){
            this.body.velocity.x -= 1;
        } else if(this.body.velocity.x < -5){
            this.body.velocity.x += 1;
        }

        if(this.body.velocity.x <= 5 && this.body.velocity.x > 0 || this.body.velocity.x >= -5 && this.body.velocity.x < 0){
             this.body.velocity.x = 0;
        }

        if(this.body.velocity.y > 5){
            this.body.velocity.y -= 1;
        } else if(this.body.velocity.y < -5){
            this.body.velocity.y += 1;
        }

        if(this.body.velocity.y <= 5 && this.body.velocity.y > 0 || this.body.velocity.y >= -5 && this.body.velocity.y < 0){
             this.body.velocity.y = 0;
        }
    }

    // FUNCION PARA PONER AL OBJETO QUIETO
    isStatic(){
        return this.body.velocity.x === 0 && this.body.velocity.y === 0;
    }

    // FUNCION PARA AÑADIRLE LA ULTIMA DIRECCION AL OBJETO
    applyLastDir(){
        this.setVelocity(this.speed*this.dir.x, this.speed*this.dir.y);
    }

}