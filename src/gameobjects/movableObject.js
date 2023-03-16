export default class MovableObject extends Phaser.Physics.Arcade.Sprite {
    
    
    constructor(scene, x, y, key, speed, firstFrame) {
        super(scene, x, y, key, firstFrame);
        this.speed = speed
    }

    moveDown(){
        this.setVelocityY(this.speed);
    }

    moveUp(){
        this.setVelocityY(-this.speed);
    }

    moveLeft(){
        this.setVelocityX(-this.speed);
    }

    moveRight(){
        this.setVelocityX(this.speed);
    }

    moveRightUp(){
        const vec = new Phaser.Math.Vector2(this.speed,-this.speed).normalize();
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    moveLeftUp(){
        const vec = new Phaser.Math.Vector2(-this.speed,-this.speed).normalize();
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    moveRightDown(){
        const vec = new Phaser.Math.Vector2(this.speed,this.speed).normalize();
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    moveLeftDown(){
        const vec = new Phaser.Math.Vector2(-this.speed,this.speed).normalize();
        this.setVelocity(this.speed*vec.x, this.speed*vec.y);
    }

    stopHorizontal(){
        this.setVelocityX(0);
    }

    stopVertical(){
        this.setVelocityY(0);
    }

}