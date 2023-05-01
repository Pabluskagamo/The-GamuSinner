export default class JellyfishPet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y){
        super(scene, x, y, "jellyfish");

        this.key = "jellyfish"
        this.speed = 20
        this.path = new Phaser.Curves.Path();
        this.path.add(new Phaser.Curves.Ellipse(this.x, this.y, 100));
        this.jelly = this.scene.add.follower(this.path, 0, 0, 'jelly');

        this.jelly.startFollow({
            positionOnPath: true,
            duration: 3000,
            repeat: -1,
            rotateToPath: true
        });

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
        this.jelly.x= this.x
        this.jelly.y=this.y
    }

    hide(){
        this.x = -150
        this.y = -150
    }

    attack(powerUp, passives, dir){
        powerUp.run(this.x, this.y, passives, dir)
    }

    follow(x, y){
        //this.path.moveTo(x, y);
        //this.path.getPoint(this.t, this.follower.vec);
        this.x = x
        this.y = y
    }
}