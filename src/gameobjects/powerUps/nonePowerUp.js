import PowerUp from "./powerUp"

// CLASE PARA CUANDO NO TIENE NINGUN POWER-UP

export default class nonePowerUp extends PowerUp{

    constructor(scene, x, y){
        super(scene, x, y, "nonePowerUp", false)
        
        this.scene.anims.create({
            key: 'tripleShot_animation',
            frames: this.scene.anims.generateFrameNumbers('tripleshot', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        })
    }

    run (charX, charY, passives, dir){
        if (this.scene.bulletPool.hasBullets()) {
            let bullet = this.scene.bulletPool.spawn(charX, charY, passives);
            bullet.setDireccion(dir.normalize());
        }
    }
}