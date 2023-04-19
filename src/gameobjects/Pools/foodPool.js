import Food from "../items/food";

export default class foodPool {

    constructor (scene, max) {
        this.scene = scene;
        this._group = scene.add.group();
        this.max = max;
        //this.fillPull();
    }

    addMultipleEntity(entities) {
		this._group.addMultiple(entities);
		this._group.children.iterate(c => {
			this._group.killAndHide(c);
			c.body.overlap = true;
		});
	}

    spawn(x, y) {
        let entity = this._group.getFirstDead();

        if (entity) {
          entity.x = x;
          entity.y = y;
          entity.initItem()
          entity.setActive(true);
          entity.setVisible(true);
          entity.body.overlap = false;
        }
        return entity;
    }


    hasFood(){
        return this._group.countActive() < this.max;
    }
    
    release(entity) {
        entity.body.overlap = true;
        this._group.killAndHide(entity);
    }

    fillPull(num){
        let foods = []

        for (let i = 0; i < num; i++) {
			foods.push(new Food(this.scene, -150, -150, 1));
        }
        this.addMultipleEntity(foods);
    }
}