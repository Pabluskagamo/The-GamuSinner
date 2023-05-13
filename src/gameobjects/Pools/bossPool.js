import EnemyBullet from "../enemyBullet"
import Slime from "../enemies/slime"
import ExplosionBoss from "../enemies/boss/explosionBoss";

// POOL DE LAS BALAS DEL BOSS

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

    // AÑADIR LAS BALAS
    addMultipleEntityToGroup(entities, group) {
		group.addMultiple(entities);
		group.children.iterate(c => {
			group.killAndHide(c);
			c.body.checkCollision.none = true;
		});
	}

    // SPAWNEO DE LAS BALAS
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

    // SPAWNEO DE LOS ESBIRROS
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

    // SPAWNEO DE LAS EXPLOSIONES
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

    // LIMPIEZA DE ENEMIGOS
    releaseEnemy(entity) {
        entity.body.checkCollision.none = true
        this._bossEnemiesGroup.killAndHide(entity)
    }

    // LIMPIEZA DE EXPLOSIONES
    releaseExplosion(entity) {
        entity.hide()
        entity.body.checkCollision.none = true
        this._bossEnemiesGroup.killAndHide(entity)
    }

    // LIMPIEZA DE BALAS
    releaseBullet(entity) {
        entity.body.checkCollision.none = true
        this._bossBulletGroup.killAndHide(entity)
    }

    // COMPRUEBA SI TIENE BALAS
    hasBullets() {
        return this._bossBulletGroup.countActive() < this.maxBullets
    }

    // COMPRUEBA SI TIENE ENEMIGOS
    hasEnemies() {
        return this._bossEnemiesGroup.countActive() < this.maxEnemies
    }

    // FUNCION PARA LLENAR LA POOL
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

    // SETTER Y GETTER DEL DAÑO
    getDmg() {
        return this.dmg;
    }

    changeDmg(dmg) {
        this._bossBulletGroup.children.iterate(child => {
            child.setDmg(dmg);
        });
    }
}