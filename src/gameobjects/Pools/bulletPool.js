import Bullet from "../bullet";

export default class BulletPool {


    constructor (scene, max) {
        this.scene = scene;
        this._group = scene.add.group();
        //
        this.bouncing = false;
        this.freezing = false;
        //
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
          entity.justHit = false
          //
          /* entity.setFreezing(this.freezing)
          entity.setBouncing(this.bouncing) */
          //
          entity.setActive(true);
          entity.setVisible(true);
          entity.body.checkCollision.none = false;
        }
        return entity;
    }


    hasBullets(){
        return this._group.countActive() < this.max;
    }
    
    release(entity) {
        entity.body.checkCollision.none = true;
        this._group.killAndHide(entity);
    }

    fillPool(num){
        let bullets = []

        for (let i = 0; i < num; i++) {
			bullets.push(new Bullet(this.scene, -100, -100, 300, 20));
		}

        this.addMultipleEntity(bullets);
    }

    setFreezing(value){
        this.freezing = value
    }

    setBouncing(value){
        this.bouncing = value
    }
}