import Food from "../items/food";

// POOL DE LOS MUSLITOS

export default class foodPool {

    constructor (scene, max) {
        this.scene = scene;
        this._group = scene.add.group();
        this.max = max;
    }

    // AÑADIR LOS MUSLITOS
    addMultipleEntity(entities) {
		this._group.addMultiple(entities);
		this._group.children.iterate(c => {
			this._group.killAndHide(c);
			c.body.overlap = true;
            c.body.enable = false;
		});
	}

    // SPAWNEO DE LOS MUSLITOS
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

    // FUNCION PARA SABER SI HAY COMIDA
    hasFood(){
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
        let foods = []

        for (let i = 0; i < num; i++) {
			foods.push(new Food(this.scene, -150, -150, 1));
        }
        this.addMultipleEntity(foods);
    }
}