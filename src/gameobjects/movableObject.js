export default class MovableObject extends Phaser.Physics.Arcade.Sprite {
    
    
    constructor(scene, x, y, key, speed, firstFrame) {
        super(scene, x, y, key, firstFrame);
        this.speed = speed
        this.dir = new Phaser.Math.Vector2(0,1);
    }

    moveDown(){
        this.setVelocityX(0);
        this.setVelocityY(this.speed);
        this.dir.x = 0
        this.dir.y = 1
    }

    moveUp(){
        this.setVelocityX(0);
        this.setVelocityY(-this.speed);
        this.dir.x = 0
        this.dir.y = -1
    }

    moveLeft(){
        this.setVelocityX(-this.speed);
        this.setVelocityY(0);
        this.dir.x = -1
        this.dir.y = 0
    }

    moveRight(){
        this.setVelocityX(this.speed);
        this.setVelocityY(0);
        this.dir.x = 1
        this.dir.y = 0
    }

    moveRightUp(){
        const vec = new Phaser.Math.Vector2(this.speed,-this.speed).normalize();
        this.dir = vec.clone()
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    moveLeftUp(){
        const vec = new Phaser.Math.Vector2(-this.speed,-this.speed).normalize();
        this.dir = vec.clone()
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    moveRightDown(){
        const vec = new Phaser.Math.Vector2(this.speed,this.speed).normalize();
        this.dir = vec.clone()
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    moveLeftDown(){
        const vec = new Phaser.Math.Vector2(-this.speed,this.speed).normalize();
        this.dir = vec.clone()
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    stopHorizontal(){
        this.setVelocityX(0);
    }

    stopVertical(){
        this.setVelocityY(0);
    }

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

    isStatic(){
        return this.body.velocity.x === 0 && this.body.velocity.y === 0;
    }

    applyLastDir(){
        this.setVelocity(this.speed*this.dir.x, this.speed*this.dir.y);
    }

}