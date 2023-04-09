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
        console.log("PREUPDATE")
        if (this.time === -1) {
            this.time = t
            console.log("collect time: " + this.time)
        }
        else if (this.time > 0 && (t - this.time) >= this.lifespan) {
            console.log("time: " + this.time + " t: " + t + " resta : "+ (t - this.time))
            this.disable()
        }
    }

    collect(){
        if (!this.collected) {
            this.collected = true
            this.enabled = true
            console.log("Collect POWERUP")
            this.time = -1
            this.runOnCollect()
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
        this.enabled = false
        this.time = 0
        this.runOnDisable()
    }

    isEnabled(){
        return this.enabled
    }
    
    run(){}
    
    runOnCollect(){}

    runOnDisable(){}
}