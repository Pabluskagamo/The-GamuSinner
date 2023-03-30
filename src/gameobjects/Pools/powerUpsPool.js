import PowerUps from "../bullet";

export default class powerUpPool {


    constructor (scene, max) {
        this.scene = scene;
        this._group = scene.add.group();
        this.max = max;
    }

    addMultipleEntity(entities) {
		this._group.addMultiple(entities);
		this._group.children.iterate(c => {
			this._group.killAndHide(c);
			c.body.checkCollision.none = true;
		});
	}

    spawn(x, y) {
        let entity = this._group.getFirstDead();

        if (entity) {
          entity.x = x;
          entity.y = y;
          entity.collected = false
          entity.setActive(true);
          entity.setVisible(true);
          entity.body.checkCollision.none = false;
        }
        return entity;
    }


    hasCoins(){
        return this._group.countActive() < this.max;
    }
    
    release(entity) {
        entity.body.checkCollision.none = true;
        this._group.killAndHide(entity);
    }

    fillPull(){
        let powerUps = []

        for (let i = 0; i < 20; i++) 
        powerUps.push(new tripleShot(this.scene, -125, -125));
        this.addMultipleEntity(powerUps);
    }
}