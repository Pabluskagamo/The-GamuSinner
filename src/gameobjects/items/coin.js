export default class Coin extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, value){
        super(scene, x, y, 'coin');
        this.value = value
        this.collected = false;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);  

        this.scene.anims.create({
            key: 'coin_animation',
            frames: this.scene.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        })

        this.play('coin_animation')
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)
    }

    collect(character){
        if(!this.collected){
            this.collected = true;
            character.collectCoin(this.value);
            this.scene.coinPool.release(this);
        }
    }

}