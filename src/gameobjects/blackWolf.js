export default class BlackWolf extends Phaser.GameObjects.Sprite{

    constructor(scene, x, y, speed){
        super(scene, x, y, 'blackWolf', 20);
        this.scene.add.existing(this);
        this.setScale(1.5);

        this.scene.anims.create({
			key: 'abajo_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', {start: 180, end: 188}),
            frameRate: 5,
            repeat: 0
		})

        this.scene.anims.create({
			key: 'arriba_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', {start: 144, end: 152}),
            frameRate: 5,
            repeat: 0
		})

        this.scene.anims.create({
			key: 'lado_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', {start: 162, end: 170}),
            frameRate: 10,
            repeat: 0
		})

        this.scene.anims.create({
			key: 'static_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', {start: 36, end: 42}),
            frameRate: 5,
            repeat: 0
		})

        this.scene.anims.create({
			key: 'died_blackWolf',
            frames: this.scene.anims.generateFrameNumbers('blackWolf', {start: 360, end: 365}),
            frameRate: 5,
            repeat: 0
		})

        this.on('animationcomplete',() => {
            if(this.anims.currentAnim.key !== 'died_blackWolf'){
                this.play('static_blackWolf');
            }
        })

        this.play('static_blackWolf');
        
        this.f = this.scene.input.keyboard.addKey('F')
        this.cursor = this.scene.input.keyboard.createCursorKeys();
	}

    preUpdate(t, dt){
        super.preUpdate(t, dt)

        if(this.cursor.left.isDown){
            this.play('lado_blackWolf', true);
            this.flipX = false;
            this.x -= dt/5; 
        }else if(this.cursor.right.isDown){
            this.play('lado_blackWolf', true);
            this.flipX = true;
            this.x += dt/5;
        }else if(this.cursor.down.isDown){
            this.play('abajo_blackWolf', true);
            this.y += dt/5;  
        }else if(this.cursor.up.isDown){
            this.play('arriba_blackWolf', true);
            this.y -= dt/5;  
        }else if(this.f.isDown){
            this.play('died_blackWolf', true);
        }

    }
}