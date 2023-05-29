import Item from "../items/item"

// PADRE DE LOS POWER-UPS

export default class PowerUp extends Item{

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

    // INICIALIZACION DE SUS CARACTERISTICAS
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
        
        // COMPROBAR EL TIEMPO DEL EFECTO
        if(this.timer){
            const remaining = (this.lifespan - this.timer.getElapsed()) / 1000;

            if (this.lastTime != remaining) {
                this.scene.events.emit('updatePowerupCount', this.key, remaining.toFixed(0));
            }

            this.lastTime = remaining
        }
    }

    // FUNCION PARA CUANDO SE RECOLECTA EL POWER-UP
    collect(){

        this.visible = false
        this.overlap = true
        if (!this.collected) {
            this.scene.sound.add("powerup_audio", {
                volume: 0.15,
                loop: false
            }).play();
            super.collect();
            this.collected = true
            this.enabled = true
        }
    }
    
    // SETTER Y GETTER PARA SU RECOLECCION
    getCollected(){
        return this.collected
    }

    setCollected(value){
        this.collected = value
    }
    
    // OBTENER LA KEY DEL POWER-UP PARA SABER CUAL ES
    getKey(){
        return this.key
    }

    // FUNCION PARA SABER SI ES PASIVO
    isPassive(){
        return this.passive
    }

    // FUNCION PARA DESHABILITAR EL POWER-UP
    disable(reloaded){
        this.enabled = false
        this.scene.powerUpPool.release(this)

        if(!reloaded){
            this.scene.events.emit('endPowerUpTime', this.key);
        } else {
            this.timer.remove();
        }
    }

    // FUNCION PARA SABER SI ESTA ACTIVA
    isEnabled(){
        return this.enabled
    }

    // FUNCION PARA INICIAR EL TEMPORIZADOR
    initTimer(){
        this.scene.events.emit('collectPowerUp', this.key);
        this.timer = this.scene.time.addEvent({
			delay: this.lifespan,
			callback: this.finishPowerUp,
			callbackScope: this,
			loop: false
		});
    }

    // FUNCION PARA CUANDO SE TERMINA EL POWER-UP
    finishPowerUp(){
		this.disable()
		this.scene.events.emit('UpdatePowerUpTimer', -1);
		this.scene.events.emit('endPowerUpPlayer');
	}

    // FUNCION PARA VOLVER A METERLO EN SU POOL
    deSpawn(){
        this.scene.powerUpPool.release(this);
    }

    // FUNCION PARA SABER SI ES EL POWER-UP DE LA MASCOTA
    isPet() {
        return false;
    }
}