export default class PowerUp extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, key, passive){
        super(scene, x, y, key)
        this.key = key
        this.lifespan = 10000
        this.lastTime = -1
        this.enabled = false
        this.collected = false
        this.passive = passive
        this.timer = null;
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)  
    }

    init(x, y) {
        this.x = x
        this.y = y
        this.collected = false
        this.overlap = false
        this.setActive(true)
        this.setVisible(true)
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)
        
        if(this.timer){
            const remaining = (this.lifespan - this.timer.getElapsed()) / 1000;

            if (this.lastTime != remaining) {
                this.scene.events.emit('updatePowerupCount', this.key, remaining.toFixed(0));
            }

            this.lastTime = remaining
        }
    }

    collect(){
        this.initTimer();
        //this.x = -150;
        //this.y = -150;
        this.visible = false
        this.overlap = true
        if (!this.collected) {
            this.collected = true
            this.enabled = true
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

    disable(reloaded){
        console.log("POWERUP DISABLED")
        this.enabled = false
        this.scene.powerUpPool.release(this)

        if(!reloaded){
            this.scene.events.emit('endPowerUpTime', this.key);
        }else{
            this.timer.remove();
        }
    }

    isEnabled(){
        return this.enabled
    }

    initTimer(){
        this.scene.events.emit('collectPowerUp', this.key);
        this.timer = this.scene.time.addEvent({
			delay: this.lifespan,
			callback: this.finishPowerUp,
			callbackScope: this,
			loop: false
		});
    }

    finishPowerUp(){
		this.disable()
		this.scene.events.emit('UpdatePowerUpTimer', -1);
		this.scene.events.emit('endPowerUpPlayer');
	}
}