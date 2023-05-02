import BlackWolf from "../enemies/blackWolf"
import Goblin from "../enemies/goblin"
import Spectre from "../enemies/spectre"
import Cyclops from "../enemies/cyclops"


export default class EnemyPool {

	

	constructor (scene, max) {
		this.scene = scene;
		this._group = scene.add.group()	
		this._gobsgroup = scene.add.group()
		this._wolfsgroup = scene.add.group()
		this._spectresgroup = scene.add.group()
		this._cyclopsgroup = scene.add.group()	
		this.max = max
		//this.scene = scene;
		//this.reuse = reuse;

		this.hpPerLevel ={
			level1: {
				goblin: 20,
				blackWolf: 60,
				cyclops: 100,
				spectre: 70
			},
			level2: {
				goblin: 20,
				blackWolf: 60,
				cyclops: 100,
				spectre: 70
			},
			level3: {
				goblin: 30,
				blackWolf: 70,
				cyclops: 110,
				spectre: 80
			},
			level4: {
				goblin: 40,
				blackWolf: 80,
				cyclops: 120,
				spectre: 90
			}
		}
	}
	
	/**
	 * Método para añadir nuevos objetos a la pool.
	 * Nos servirá para crear una pool inicial si no lo hemos hecho en el constructor.
	 * Todos los elementos añadidos los activamos como disponibles para reutilizar
	 * @param {Array} entities - array de objetos que añadir a la pool
	 */
	addMultipleEntity(entities) {
		this._group.addMultiple(entities)
		this._group.children.iterate(c => {
			this._group.killAndHide(c)
			c.body.checkCollision.none = true
		})
	}

	addMultipleEntityToGroup(entities, group) {
		group.addMultiple(entities);
		group.children.iterate(c => {
			group.killAndHide(c);
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

	spawnGob(x,y){
		if(!this.emptyPool()){
			let entity = this._gobsgroup.getFirstDead();
			
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
	}

	spawnWolf(x,y){
		if(!this.emptyPool()){
			let entity = this._wolfsgroup.getFirstDead();
			
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
	}

	spawnSpectre(x,y){
		if(!this.emptyPool()){
			let entity = this._spectresgroup.getFirstDead();
			
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
	}

	spawnCyclops(x,y){
		if(!this.emptyPool()){
			let entity = this._cyclopsgroup.getFirstDead();
			
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
        return this._group.countActive() === this.max
    }

	fullPool(){
        return this._group.countActive() === 0;
    }

	fillPool(num, player, level){
        let enemies = []
		let gobs = []
		let wolfs = []
		let spectres = []
		let cyclops = []

		let randNum = 0

		for (let i = 0; i < 50; i++) {
			const gob = new Goblin(this.scene, -50, -50, 80, player, this, this.hpPerLevel[level].goblin)
			enemies.push(gob);
			gobs.push(gob);
		}

		for (let i = 0; i < 25; i++) {
			const wolf = new BlackWolf(this.scene, -50, -50, 60, player, this, this.hpPerLevel[level].blackWolf)
			enemies.push(wolf)
			wolfs.push(wolf)
		}

		for (let i = 0; i < 15; i++) {
			const spectre = new Spectre(this.scene, -50, -50, 100, player, this, this.hpPerLevel[level].spectre)
			enemies.push(spectre)
			spectres.push(spectre)
		}

		for (let i = 0; i < 10; i++) {
			const cycl = new Cyclops(this.scene, -50, -50, 45, player, this, this.hpPerLevel[level].cyclops)
			enemies.push(cycl)
			cyclops.push(cycl)
		}

        this.addMultipleEntity(enemies)
		this.addMultipleEntityToGroup(gobs, this._gobsgroup)
		this.addMultipleEntityToGroup(wolfs, this._wolfsgroup)
		this.addMultipleEntityToGroup(spectres, this._spectresgroup)
		this.addMultipleEntityToGroup(cyclops, this._cyclopsgroup)
		this.max = 100
    }
}