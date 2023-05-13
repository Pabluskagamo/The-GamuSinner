// CLASE QUE GENERA LOS CORAZONES PERTENECIENTES A LA VIDA DEL PERSONAJE

export default class HealthPoint extends Phaser.GameObjects.Sprite{
    constructor(scene,x, y, key){
        super(scene, x, y, key);

        this.scene.add.existing(this);
        this.setScale(1.5)

        this.scene.anims.create({
            key: 'fullheart',
            frames: this.scene.anims.generateFrameNumbers('healthbar', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'halfheart',
            frames: this.scene.anims.generateFrameNumbers('healthbar', { start: 2, end: 2 }),
            frameRate: 1,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'emptyheart',
            frames: this.scene.anims.generateFrameNumbers('healthbar', { start: 4, end: 4 }),
            frameRate: 1,
            repeat: 0
        })

        this.play('fullheart')

    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)
    }

    empty(){
        this.play('emptyheart')
    }

    full(){
        this.play('fullheart')
    }


}