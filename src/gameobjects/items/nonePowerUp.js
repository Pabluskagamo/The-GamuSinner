import PowerUp from "./powerUp"

export default class nonePowerUp extends PowerUp{

    constructor(scene, x, y){
        super(scene, x, y, "nonePowerUp");
        this.scene.anims.create({
            key: 'tripleShot_animation',
            frames: this.scene.anims.generateFrameNumbers('fire', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        })
    }

    run(charX,charY,dir){
        if (this.scene.bulletPool.hasBullets()) {
            let bullet = this.scene.bulletPool.spawn(charX,charY);
            bullet.setDireccion(dir.normalize());
        }
    }
}