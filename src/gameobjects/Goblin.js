import MovableObject from "./movableObject";
export default class Goblin extends MovableObject{

    constructor(scene, x, y, speed){
        super(scene, x, y, 'goblin', speed, 20);
        this.scene.add.existing(this);
        this.setScale(1.5);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds();
        this.speed = speed;

        this.scene.anims.create({
			key: 'abajo_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', {start: 6, end: 8}),
            frameRate: 5,
            repeat: 0
		})

        this.scene.anims.create({
			key: 'arriba_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', {start: 42, end: 44}),
            frameRate: 5,
            repeat: 0
		})

        this.scene.anims.create({
			key: 'lado_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', {start: 18, end: 20}),
            frameRate: 10,
            repeat: 0
		})

        this.scene.anims.create({
			key: 'goblin_static',
            frames: this.scene.anims.generateFrameNumbers('goblin', {start: 6, end: 6}),
            frameRate: 5,
            repeat: 0
		})

      /*  this.scene.anims.create({
			key: 'died_goblin',
            frames: this.scene.anims.generateFrameNumbers('goblin', {start: 44, end: 48}),
            frameRate: 5,
            repeat: 0
		})*/

       /* this.on('animationcomplete',() => {
            if(this.anims.currentAnim.key !== 'died_goblin'){
                this.play('goblin_static');
            }
        })*/

        this.play('goblin_static');
        
        this.f = this.scene.input.keyboard.addKey('G')
        this.j = this.scene.input.keyboard.addKey('J');
        this.k = this.scene.input.keyboard.addKey('K');
        this.l = this.scene.input.keyboard.addKey('L');
        this.i = this.scene.input.keyboard.addKey('I');
        this.cursor = this.scene.input.keyboard.createCursorKeys();
	}

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        if (this.j.isDown) {
            this.play('lado_goblin', true);
            this.flipX = false;
            this.moveLeft();
        } else if (this.l.isDown) {
            this.play('lado_goblin', true);
            this.flipX = true;
            this.moveRight();
        }

        if (this.k.isDown) {
            this.play('abajo_goblin', true);
            if (this.j.isDown) {
                this.moveLeftDown();
            } else if (this.l.isDown) {
                this.moveRightDown();
            }
            else {
                this.moveDown();
            }
        } else if (this.i.isDown) {
            this.play('arriba_goblin', true);
            if (this.j.isDown) {
                this.moveLeftUp();
            } else if (this.l.isDown) {
                this.moveRightUp();
            }
            else {
                this.moveUp();
            }
        }

        if (Phaser.Input.Keyboard.JustUp(this.j) || Phaser.Input.Keyboard.JustUp(this.l)) {
            this.stopHorizontal();
        }

        if (Phaser.Input.Keyboard.JustUp(this.k) || Phaser.Input.Keyboard.JustUp(this.i)) {
            this.stopVertical();
        }

    }
}