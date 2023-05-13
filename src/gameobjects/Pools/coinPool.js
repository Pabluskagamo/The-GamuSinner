import Coin from "../items/coin";

// POOL DE LAS MONEDAS

export default class CoinPool {

    constructor (scene, max) {
        this.scene = scene;
        this._group = scene.add.group();
        this.max = max;
    }

    // AÑADIR LAS MONEDAS
    addMultipleEntity(entities) {
		this._group.addMultiple(entities);
		this._group.children.iterate(c => {
			this._group.killAndHide(c);
			c.body.overlap = true;
            c.body.enable = false;
		});
	}

    // SPAWNEO DE LAS MONEDAS
    spawn(x, y) {
        let entity = this._group.getFirstDead();

        if (entity) {
          entity.x = x;
          entity.y = y;
          entity.initItem()
          entity.setActive(true);
          entity.setVisible(true);
          entity.body.overlap = false;
          entity.body.enable = true;
        }
        return entity;
    }

    // FUNCION PARA SABER SI HAY MONEDAS
    hasCoins(){
        return this._group.countActive() < this.max;
    }
    
    // FUNCION PARA HACER LIMPIEZA
    release(entity) {
        entity.body.overlap = true;
        entity.body.enable = false;
        this._group.killAndHide(entity);
    }

    // FUNCION PARA RELLENAR LA POOL
    fillPull(num){
        let coins = []

        for (let i = 0; i < num; i++) {
			coins.push(new Coin(this.scene, -150, -150, 1));
        }
        this.addMultipleEntity(coins);
    }
}