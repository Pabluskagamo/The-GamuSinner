import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('background', '/img/menu_background.png')
		this.load.image('game_title', '/img/titulo.png')
	}

	create() {
		this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.75);
		const title = this.add.image(this.sys.game.canvas.width/2, 250, 'game_title').setScale(0.5);
		
	}
}
