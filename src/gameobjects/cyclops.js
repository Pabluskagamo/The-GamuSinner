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
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 40, end: 46}),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'down_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 40, end: 46}),
            frameRate: 5,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'side_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 15, end: 26}),
            frameRate: 15,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'static_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', {start: 0, end: 14}),
            frameRate: 10,
            repeat: 0
        })

        this.scene.anims.create({
            key: 'died_cyclops',
            frames: this.scene.anims.generateFrameNumbers('cyclops', { start: 120, end: 128 }),
            frameRate: 5,
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