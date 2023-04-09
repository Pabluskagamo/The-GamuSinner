import Phaser from 'phaser'

export default class selectionScene extends Phaser.Scene {
	constructor() {
		super('selecScene');
		this.isMuted = false;
	}

	preload() {
		this.load.image('mapa', './img/espania.png');
	}


	create() {
		this.add.image(0, 0, 'mapa').setOrigin(0, 0).setScale(1);
	}
}