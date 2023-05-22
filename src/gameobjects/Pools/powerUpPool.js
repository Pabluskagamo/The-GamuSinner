import BouncingShot from "../powerUps/bouncingShot";
import EightDirShot from "../powerUps/eightDirShot";
import FreezingShot from "../powerUps/freezingShot";
import PetBot from "../powerUps/petBot";
import TripleShot from "../powerUps/tripleShot";

// POOL DE LOS POWER-UPS

export default class PowerUpPool {


    constructor (scene, max) {
        this.scene = scene;
        this._group = scene.add.group();
        this.max = max;
    }

    // AÑADIR LOS POWER-UPS
    addMultipleEntity(entities) {
		this._group.addMultiple(entities);
		this._group.children.iterate(c => {
			this._group.killAndHide(c);
			c.body.overlap = true;
            c.body.enable = false;
		});
        this._group.shuffle()
	}

    // SPAWNEO DE LOS POWER-UPS
    spawn(x, y) {
        //cambiar politica y añadir que no s epueda spawnear si enable de powerUp es true
        //usa false para el active por defecto ver si hacemos esto o hacemos el shuffle cada x tiempo
        if(this.hasPowerUps()){
            this._group.shuffle()
            let entity = this._group.getLast()
            
            for(let i = 0; i < Phaser.Math.Between(0,3); i++){
                
                this.release(entity)
                entity = this._group.getLast();
            }
            if (entity) {
                entity.init(x, y)
                entity.initItem()
                entity.body.enable = true;
            }
            return entity
        }
    }

    // FUNCION PARA SABER SI TIENE POWER-UPS
    hasPowerUps(){
        return this._group.countActive() < this.max;
    }
    
    // FUNCION PARA LIMPIAR POWER-UPS
    release(entity) {
        entity.body.overlap = false;
        entity.body.enable = false;
        this._group.killAndHide(entity)
    }

    // FUNCION PARA LLENAR LAS POOL
    fillPool(){
        let powerUps = []

		for (let i = 0; i < 6; i++) {
			powerUps.push(new FreezingShot(this, -125, -125));
			powerUps.push(new BouncingShot(this, -125, -125));
			powerUps.push(new TripleShot(this, -125, -125));
			powerUps.push(new EightDirShot(this, -125, -125));
			powerUps.push(new PetBot(this, -125, -125));
		}
		this.addMultipleEntity(powerUps);
    }
}