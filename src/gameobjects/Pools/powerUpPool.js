import EightDirShot from "../powerUps/eightDirShot";
import TripleShot from "../powerUps/tripleShot";

export default class PowerUpPool {


    constructor (scene, max) {
        this.scene = scene;
        this._group = scene.add.group();
        this.max = max;
        //this.fillPull()
    }

    addMultipleEntity(entities) {
		this._group.addMultiple(entities);
		this._group.children.iterate(c => {
			this._group.killAndHide(c);
			c.body.overlap = true;
            c.body.enable = false;
		});
        this._group.shuffle()
	}

    spawn(x, y) {
        //cambiar politica y añadir que no s epueda spawnear si enable de powerUp es true
        //usa false para el active por defecto ver si hacemos esto o hacemos el shuffle cada x tiempo
        if(this.hasPowerUps()){
            let entity = this._group.getLast()
            console.log("selecciono la 0 ")
            for(let i = 0; i < Phaser.Math.Between(0,3); i++){
                console.log("selecciono la " + (i+1))
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


    hasPowerUps(){
        return this._group.countActive() < this.max;
    }
    
    release(entity) {
        entity.body.overlap = false;
        entity.body.enable = false;
        this._group.killAndHide(entity)
    }

    fillPool(){
        let powerUps = []

        for (let i = 0; i < 20; i++){
            powerUps.push(new TripleShot(this.scene, -125, -125));
            powerUps.push(new EightDirShot(this.scene, -125, -125));
        }
        this.addMultipleEntity(powerUps)
    }
}