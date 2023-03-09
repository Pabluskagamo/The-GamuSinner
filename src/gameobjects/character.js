export default class Character extends Phaser.GameObjects.Sprite{

    constructor(scene, x, y, speed){
        super(scene, x, y, 'character', 20);
        this.scene.add.existing(this);

        this.scene.anims.create({
			key: 'abajo',
            frames: this.scene.anims.generateFrameNumbers('character', {start: 130, end: 138}),
            frameRate: 5,
            repeat: 0
		})

        this.scene.anims.create({
			key: 'arriba',
            frames: this.scene.anims.generateFrameNumbers('character', {start: 104, end: 112}),
            frameRate: 5,
            repeat: 0
		})

        this.scene.anims.create({
			key: 'lado',
            frames: this.scene.anims.generateFrameNumbers('character', {start: 117, end: 125}),
            frameRate: 10,
            repeat: 0
		})

        this.scene.anims.create({
			key: 'static',
            frames: this.scene.anims.generateFrameNumbers('character', {start: 26, end: 32}),
            frameRate: 5,
            repeat: 0
		})

        this.on('animationcomplete',() => {
            console.log("FINALIZA ANIMACION")
            this.play('static');
        })

        this.play('static');
        

        this.a = this.scene.input.keyboard.addKey('A');
        this.s = this.scene.input.keyboard.addKey('S');
        this.d = this.scene.input.keyboard.addKey('D');
        this.w = this.scene.input.keyboard.addKey('W');
	}

    preUpdate(t, dt){
        super.preUpdate(t, dt)

        if(this.a.isDown){
            this.play('lado', true);
            this.flipX = false;
            this.x -= dt/5; 
        }else if(this.d.isDown){
            this.play('lado', true);
            this.flipX = true;
            this.x += dt/5;
        }else if(this.s.isDown){
            this.play('abajo', true);
            this.y += dt/5;  
        }else if(this.w.isDown){
            this.play('arriba', true);
            this.y -= dt/5;  
        }

    }
}