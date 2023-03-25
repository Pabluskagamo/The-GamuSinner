import Phaser from 'phaser'

export default class GameOverScene extends Phaser.Scene {
	constructor() {
		super('game_overr');
	}

	preload() {
		this.load.image('background2', '/img/fondo_pixelart3.png');
		this.load.image('game_over', '/img/game_over.png');
		}

	create() {
		this.add.image(0, 0, 'background2').setOrigin(0, 0).setScale(0.75);
		const title = this.add.image(this.sys.game.canvas.width/2, this.sys.game.canvas.height/2, 'game_over').setScale(0.65);
	}
}
