import EnemyBullet from "../enemyBullet"
import Slime from "../enemies/slime"
import ExplosionBoss from "../enemies/boss/explosionBoss";

export default class BossPool {


    constructor (scene, maxBullets, maxEnemies, dmg) {
        this.scene = scene
        this._bossBulletGroup = scene.add.group();
        this._bossEnemiesGroup = scene.add.group();
        this._bossExplosionGroup = scene.add.group();
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

    spawnEnemy(x, y) {
        let entity = this._bossEnemiesGroup.getFirstDead();
        
        if (entity) {
            entity.x = x;
            entity.y = y;
            entity.justHit = false
            entity.setActive(true);
            entity.setVisible(true);
            entity.body.checkCollision.none = false;
            entity.restoreEnemy()
            return entity;
	    }
    }

    spawnExplosion(x, y) {
        let entity = this._bossExplosionGroup.getFirstDead();
        if (entity) {
            entity.spawn(x, y)
            entity.setActive(true);
            entity.setVisible(true);
            entity.body.checkCollision.none = false;
            return entity;
        }
    }

    releaseEnemy(entity) {
        entity.body.checkCollision.none = true
        this._bossEnemiesGroup.killAndHide(entity)
    }

    releaseExplosion(entity) {
        entity.hide()
        entity.body.checkCollision.none = true
        this._bossEnemiesGroup.killAndHide(entity)
    }

    releaseBullet(entity) {
        entity.body.checkCollision.none = true
        this._bossBulletGroup.killAndHide(entity)
    }

    hasBullets() {
        return this._bossBulletGroup.countActive() < this.maxBullets
    }

    hasEnemies() {
        return this._bossEnemiesGroup.countActive() < this.maxEnemies
    }

    fillPool(nBullet, nEnemies, nExplosion, player) {
        let bullets = []
        let enemies = []
        let explosions = []

        for (let i = 0; i < nBullet; i++) {
            bullets.push(new EnemyBullet(this.scene, -100, -100, 120, this.dmg));
        }

        for (let i = 0; i < nEnemies; i++) {
            enemies.push(new Slime(this.scene, -50, -20, 80, player, this))
        }

        for (let i = 0; i < nExplosion; i++) {
            explosions.push(new ExplosionBoss(this.scene, -50, -120, this.dmg))
        }

        this.addMultipleEntityToGroup(bullets, this._bossBulletGroup);
        this.addMultipleEntityToGroup(enemies, this._bossEnemiesGroup);
        this.addMultipleEntityToGroup(explosions, this._bossExplosionGroup);
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