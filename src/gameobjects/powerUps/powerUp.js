export default class PowerUp extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, key, passive){
        super(scene, x, y, key)
        this.key = key
        this.time = 0
        this.lifespan = 10000
        this.enabled = false
        this.collected = false
        this.passive = passive
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)  
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)
        // console.log("PREUPDATE POWERUP")
    }

    collect(){
        if (!this.collected) {
            this.collected = true
            this.enabled = true
            console.log("Collect POWERUP")
            this.time = -1
            this.scene.powerUpPool.release(this)
        }
    }
    
    getCollected(){
        return this.collected
    }
    
    getKey(){
        return this.key
    }

    isPassive(){
        return this.passive
    }

    disable(){
        console.log("POWERUP DISABLED")
        this.enabled = false
        this.time = 0
    }

    isEnabled(){
        return this.enabled
    }
}