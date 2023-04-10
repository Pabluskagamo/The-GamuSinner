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
		});
	}

    spawn(x, y) {
        //cambiar politica y añadir que no s epueda spawnear si enable de powerUp es true
        let entity = this._group.getFirstDead();

        if (entity) {
          entity.x = x;
          entity.y = y;
          entity.collected = false
          entity.setActive(true);
          entity.setVisible(true);
          entity.body.overlap = false;
        }
        return entity;
    }


    hasPowerUps(){
        return this._group.countActive() < this.max;
    }
    
    release(entity) {
        entity.body.overlap = true;
        this._group.killAndHide(entity);
    }

    fillPool(){
        let powerUps = []

        for (let i = 0; i < 20; i++){
            powerUps.push(new TripleShot(this.scene, -125, -125));
            powerUps.push(new EightDirShot(this.scene, -125, -125));
        }
        this.addMultipleEntity(powerUps);
    }
}