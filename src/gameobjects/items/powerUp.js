export default class PowerUp extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, key){
        super(scene, x, y, key);
        this.collected = false;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);  

       /*  this.scene.anims.create({
            key: this.key +'_animation',
            frames: this.scene.anims.generateFrameNumbers('tripleShot', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        })

        this.play(key + '_animation') */
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)
    }

    collect(character){
        if(!this.collected){
            this.collected = true;
            character.collectPowerUp();
            this.scene.powerUpPool.release(this);
        }
    }
}