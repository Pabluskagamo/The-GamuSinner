import Phaser from 'phaser'

export default class GameOverScene extends Phaser.Scene {
	constructor() {
		super('game_overr')

	}

	preload() {
		this.load.image('background', '/img/fondo_pixelart3.png')
		this.load.image('game_over', '/img/game_over')
		//this.load.spritesheet('game_start', '/assets/start_sprite.png', {frameWidth: 750 , frameHeight: 355});
		//this.load.image('game_start', '/img/start_blanco.png')
	}

	create() {

		/*this.anims.create({
			key: 'hover_game_over',
			frames: this.anims.generateFrameNumbers('game_over', {start: 0, end: 2}),
			frameRate: 10,
			repeat: 0
		})*/                          

		this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.75);
		const title = this.add.image(this.sys.game.canvas.width/2, 230, 'game_over').setScale(0.65);
		/*const start = this.add.sprite(this.sys.game.canvas.width/2, 365, 'game_start').setScale(0.35);
		start.setInteractive({cursor: 'pointer'});
		start.on('pointerover', () => {
			start.play('hoverStart');
		});
	
		start.on('pointerout', () => {
			start.playReverse('hoverStart');
		});	

		start.on('pointerup', ()=>{
			this.scene.start('instructions');
		});

		this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                this.scene.start('instructions');
            }
        });*/
		
	}
}
