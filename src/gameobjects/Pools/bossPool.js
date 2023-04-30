import EnemyBullet from "../enemyBullet"
import Goblin from "../enemies/goblin"

export default class BossPool {


    constructor (scene, maxBullets, maxEnemies, dmg) {
        this.scene = scene
        this._bossBulletGroup = scene.add.group();
        this._bossEnemiesGroup = scene.add.group();
        this.maxBullets = maxBullets;
        this.maxEnemies = maxEnemies;
        this.dmg = dmg;
    }

    addMultipleEntityToGroup(entities, group) {
		group.addMultiple(entities);
		group.children.iterate(c => {
			group.killAndHide(c);
			c.body.checkCollision.none = true;
		});
	}

    spawnBullet(x, y) {
        if(this._bossEnemiesGroup.countActive(false) > 0){
            let bullet = this._bossBulletGroup.getFirstDead()

            if (bullet) {
                bullet.init(x, y)
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.body.checkCollision.none = false
            }
            return bullet;
        }
    }

    spawnEnemy(x,y){
		if(this._bossEnemiesGroup.countActive(false) > 0){
			let entity = this._bossEnemiesGroup.getFirstDead();
			
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

    release(entity, group) {
        entity.body.checkCollision.none = true
        group.killAndHide(entity)
    }

    hasBullets() {
        return this._bossBulletGroup.countActive() < this.maxBullets
    }

    hasEnemies() {
        return this._bossEnemiesGroup.countActive() < this.maxEnemies
    }

    fillPool(num) {
        let bullets = []
        let enemies = []

        for (let i = 0; i < num; i++) {
            bullets.push(new EnemyBullet(this.scene, -100, -100, 300, this.dmg));
        }

        for (let i = 0; i < num; i++) {
            const gob = new Goblin(this.scene, -50, -50, 80, player, this)
			enemies.push(gob);
        }

        this.addMultipleEntityToGroup(bullets, this._bossBulletGroup);
        this.addMultipleEntityToGroup(enemies, this._bossEnemiesGroup);
    }

    getDmg() {
        return this.dmg;
    }

    changeDmg(dmg) {
        this._bossBulletGroup.children.iterate(child => {
            child.setDmg(dmg);
        });
    }
}