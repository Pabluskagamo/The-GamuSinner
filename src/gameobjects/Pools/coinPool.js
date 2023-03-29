import Coin from "../bullet";

export default class CoinPool {


    constructor (scene, max) {
        this.scene = scene;
        this._group = scene.add.group();
        this.max = max;
        this.fillPull();
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
          entity.collected = false;
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
        let coins = []

        for (let i = 0; i < 20; i++) 
			coins.push(new Coin(this.scene, -150, -150, 1));
        this.addMultipleEntity(coins);
    }
}