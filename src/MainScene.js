import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('background', '/img/fondo_pixelart3.png')
		this.load.image('game_title', '/img/titulo.png')
		// this.load.spritesheet('game_start', '/img/start_sprite.png', 750 , 355, 3);
		this.load.image('game_start', '/img/start_blanco.png')
	}

	create() {
		this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.75);
		const title = this.add.image(this.sys.game.canvas.width/2, 230, 'game_title').setScale(0.65);
		const start = this.add.image(this.sys.game.canvas.width/2, 365, 'game_start').setScale(0.35);
		
	}
}
