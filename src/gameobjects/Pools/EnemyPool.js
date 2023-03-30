import BlackWolf from "../blackWolf"
import Goblin from "../goblin"
import Cyclops from "../cyclops"


export default class EnemyPool {
	constructor (scene, max) {
		this.scene = scene;
		this._group = scene.add.group();		
		this.max = max;
		//this.scene = scene;
		//this.reuse = reuse;
	}
	
	/**
	 * Método para añadir nuevos objetos a la pool.
	 * Nos servirá para crear una pool inicial si no lo hemos hecho en el constructor.
	 * Todos los elementos añadidos los activamos como disponibles para reutilizar
	 * @param {Array} entities - array de objetos que añadir a la pool
	 */
	addMultipleEntity(entities) {
		this._group.addMultiple(entities);
		this._group.children.iterate(c => {
			this._group.killAndHide(c);
			c.body.checkCollision.none = true;
		});
	}
	
	spawn (x, y) {

		if(!this.emptyPool()){
			let entity = this._group.getFirstDead();
			
			if (entity) {
				entity.x = x;
				entity.y = y;
				entity.justHit = false
				entity.setActive(true);
				entity.setVisible(true);
				entity.body.checkCollision.none = false;
				entity.restoreEnemy()
			}
			return entity;
		}

		return null;
    }
	
	/**
	 * Método para liberar una entidad
	 * @param {Object} entity - entidad de la pool que queremos marcar como libre
	 */
	release (entity) {
		entity.body.checkCollision.none = true;
		this._group.killAndHide(entity);
	}


	getPhaserGroup(){
		return this._group;
	}

	emptyPool(){
        return this._group.countActive() === this.max;
    }

	fillPull(num, player){
        let enemies = []

		let randNum = 0;

        for (let i = 0; i < num; i++) {
			randNum = Phaser.Math.RND.between(1, 10);

			if(randNum < 8){
				enemies.push(new Goblin(this.scene, -50, -50, 80, player, this))
			}else if(randNum >= 7 && randNum < 10){
				enemies.push(new BlackWolf(this.scene, -50, -50, 60, player, this));
			}else{
				enemies.push(new Cyclops(this.scene, -50, -50, 45, player, this));
			}

		}

		// for (let i = 0; i < 10; i++) {
		// 	enemies.push(new Goblin(this.scene, -50, -50, 80, player, this))
		// }

        this.addMultipleEntity(enemies);
		this.max = num;
    }
}