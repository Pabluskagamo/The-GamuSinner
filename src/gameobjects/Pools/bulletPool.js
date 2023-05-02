import Bullet from "../bullet";

export default class BulletPool {


    constructor(scene, max, dmg) {
        this.scene = scene
        this._group = scene.add.group();
        this.max = max;
        this.dmg = dmg;
    }

    addMultipleEntity(entities) {
        this._group.addMultiple(entities);
        this._group.children.iterate(c => {
            this._group.killAndHide(c);
            c.body.checkCollision.none = true;
        });
    }

    spawn(x, y, passives) {
        let bullet = this._group.getFirstDead()

        if (bullet) {
            /* bullet.x = x
            bullet.y = y
            bullet.justHit = false */
            bullet.init(x, y)
            passives.forEach(e => {
                e.run(bullet)
            })
            //
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.checkCollision.none = false
        }
        return bullet;
    }

    release(bullet) {
        bullet.body.checkCollision.none = true
        this._group.killAndHide(bullet)
    }

    hasBullets() {
        return this._group.countActive() < this.max
    }

    fillPool(num) {
        let bullets = []

        for (let i = 0; i < num; i++) {
            bullets.push(new Bullet(this.scene, -100, -100, 300, this.dmg));
        }

        this.addMultipleEntity(bullets);
    }

    getDmg() {
        return this.dmg;
    }

    changeDmg(dmg) {
        this.dmg = dmg;
        this._group.children.iterate(child => {
            console.log(child)
            // child.setDmg(this.dmg);
        });
    }
}