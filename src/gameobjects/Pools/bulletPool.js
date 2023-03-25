export default class BulletPool {


    constructor (scene, entities, max) {
        this._group = scene.add.group();
        this.max = max;

        this._group.addMultiple(entities);
        this._group.children.iterate(c => {
             c.setActive(false);
             c.setVisible(false);
             c.body.checkCollision.none = true;
        });
    }

    spawn (x, y) {
        let entity = this._group.getFirstDead();

        if (entity) {
          entity.x = x;
          entity.y = y;
          entity.justHit = false
          entity.setActive(true);
          entity.setVisible(true);
          entity.body.checkCollision.none = false;
        }
        return entity;
    }


    hasBullets(){
        return this._group.countActive() < this.max;
    }
    
    release (entity) {
        entity.body.checkCollision.none = true;
        this._group.killAndHide(entity);
    }
}