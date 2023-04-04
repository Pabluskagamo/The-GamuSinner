export default class PowerUp extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, key){
        super(scene, x, y, key);
        this.key = key
        this.collected = false;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);  
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)
    }

    

    collect(){
        if(!this.collected){
            this.collected = true;
            this.scene.powerUpPool.release(this);
        }
    }
    
    getCollected(){
        return this.collected
    }
    
    getKey(){
        return this.key
    }
}