export default class JellyfishPet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y){
        super(scene, x, y, "jellyfish");

        this.key = "jellyfish"
        this.speed = 20
        this.angularSpeed = 40
        this.path = new Phaser.Curves.Path(400, 300);

        this.setScale(1.5)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this)

        this.scene.anims.create({
            key: 'move_jellyfish',
            frames: this.scene.anims.generateFrameNumbers('jellyfishpet', {start: 14, end: 18}),
            frameRate: 7,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'hide_jellyfish',
            frames: this.scene.anims.generateFrameNumbers('jellyfishpet', { start: 21, end: 27 }),
            frameRate: 7,
            repeat: 0
        })
        

        this.on('animationcomplete',() => {
            if (this.anims.currentAnim.key === 'hide_jellyfish') {
                this.x = -100
            } 
        })

        this.play('move_jellyfish')
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)
        //this.move()
    }

    move(){
        //this.scene.physics.velocityFromRotation(Phaser.Math.DegToRad(this.rotation), this.speed, this.body.velocity);
        
        this.path.circleTo(100);
        this.path.moveTo(400, 300);
        this.path
    }

    attack(powerUp, passives, dir){
        powerUp.run(this.x, this.y, passives, dir)
    }

    follow(x, y){
        this.x = x
        this.y = y
    }
}

/* 
function update ()
{
    this.physics.velocityFromRotation(Phaser.Math.DegToRad(this.body.rotation), SPEED, this.body.velocity);
    //this.physics.world.wrap(this, 32);
} */