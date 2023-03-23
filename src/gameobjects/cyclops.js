import EnemyObject from "./enemyObject";

export default class Cyclops extends EnemyObject{

    constructor(scene, x, y, speed, player){
        super(scene, x, y, 'cyclops', 20, 100, 15);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds();
        this.setScale(1.5);

        this.speed = speed;
        this.player = player;
        this.attacking = false;

        let f = this.frame;
        this.setSize(f.realWidth / 2, f.realHeight, true);

        this.scene.anims.create({
            key: 'up_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 30, end: 36}),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'down_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 30, end: 36}),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'side_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 165, end: 176}),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'static_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {frames: [105,106,107,108,108,107,106,105,105,120,121,122,123,124,125,125,124,123,122,121,120,105,105]}),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'died_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', { start: 91, end: 97 }),
            frameRate: 10,
            repeat: 0
        })

        this.on('animationcomplete',() => {
            if (this.anims.currentAnim.key === 'died_cyclops') 
                this.toDestroy = true;
            
        })

        this.play('cyclops_static');
        
        this.spacebar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)

        if (this.hp > 0 && !this.attacking) {
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.follow();
        }else{
            this.stopVertical();
            this.stopHorizontal();
        }

        if (this.toDestroy) {
            this.destroy();
        }
        // if(this.spacebar.isDown){
        //     const lastAnim = this.anims.currentAnim.key;

        //     if(lastAnim == 'cyclops_side'){
        //         this.play('mainChar_shootlado');
        //     }else if(lastAnim == 'cyclops_down'){
        //         this.play('mainChar_shootabajo');
        //     }else if(lastAnim == 'cyclops_up'){
        //         this.play('mainChar_shootarriba');
        //     }else{
        //         this.play(lastAnim);
        //     }
        // }

    }
}