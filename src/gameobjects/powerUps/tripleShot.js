import PowerUp from "./powerUp"

// CLASE DEL POWER-UP DE DISPARO TRIPLE

export default class TripleShot extends PowerUp{

    constructor(scene, x, y){
        super(scene, x, y, "tripleShot", false)

        this.scene.anims.create({
            key: 'tripleShot_animation',
            frames: this.scene.anims.generateFrameNumbers('tripleshot', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        })
        this.play('tripleShot_animation')
    }

    // FUNCION PARA GENERAR LAS 3 DIRECCIONES EN LAS QUE DISPARAR
    run (charX, charY, passives, dir){
        if (this.scene.bulletPool.hasBullets()) {
            let bullet = this.scene.bulletPool.spawn(charX, charY, passives);
            let bullet2 = this.scene.bulletPool.spawn(charX, charY, passives);
            let bullet3 = this.scene.bulletPool.spawn(charX, charY, passives);
            if(dir.x === 0) {
                bullet.setDireccion(dir);
                bullet2.setDireccion(new Phaser.Math.Vector2(dir.x+0.3, dir.y).normalize());
                bullet3.setDireccion(new Phaser.Math.Vector2(dir.x-0.3, dir.y).normalize());
            }
            else if(dir.y === 0) {
                bullet.setDireccion(dir);
                bullet2.setDireccion(new Phaser.Math.Vector2(dir.x, dir.y+0.3).normalize());
                bullet3.setDireccion(new Phaser.Math.Vector2(dir.x, dir.y-0.3).normalize());
            }
            else {
                bullet.setDireccion(dir.normalize());
                bullet2.setDireccion(new Phaser.Math.Vector2(dir.x+0.3, dir.y).normalize());
                bullet3.setDireccion(new Phaser.Math.Vector2(dir.x-0.3, dir.y).normalize());
            }
        }
    }
}