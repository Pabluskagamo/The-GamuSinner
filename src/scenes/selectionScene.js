import Phaser from 'phaser'

// ESCENA PARA ELEGIR EL NIVEL DEL MAPA

export default class selectionScene extends Phaser.Scene {
	constructor() {
		super('selecScene');
	}

	preload() {
		this.load.image('mapa', './img/espania.png');
		this.load.image('botonAmarillo', './assets/ui/boton amarillo.png');
		this.load.image('botonRojo', './assets/ui/boton rojo.png');
		this.load.image('game_title', './img/titulo.png');
	}

	// ACTUALMENTE SOLO ESTA EL NIVEL DE GALICIA, SERIA IGUAL PARA EL RESTO PERO DIRIGIENDOSE A SU NIVEL CORRESPONDIENTE
	create(data) {
		this.isTransitioning = false;

		this.isMuted = data.mute;
		this.add.image(0, 0, 'mapa').setOrigin(0, 0).setScale(1);
		this.add.image(170, 60, 'game_title').setScale(0.22);
		const botonGalicia = this.add.image(400, 140, 'botonAmarillo').setScale(0.15);
		const botonAsturias = this.add.image(550, 140, 'botonRojo').setScale(0.15);
		const botonBarcelona = this.add.image(980, 190, 'botonRojo').setScale(0.15);
		const botonMadrid = this.add.image(680, 300, 'botonRojo').setScale(0.15);
		const botonAndalucia = this.add.image(630, 470, 'botonRojo').setScale(0.15);

		botonGalicia.setInteractive({ cursor: 'pointer' });

		botonGalicia.on('pointerup', () => {
			if (this.isTransitioning) {
				return;
			}
			this.isTransitioning = true;
			this.cameras.main.fadeOut(500);
			this.cameras.main.once("camerafadeoutcomplete", function () {
				this.scene.start('level1', { mute: this.isMuted });
				this.sound.removeByKey('musica');
			}, this);
		});

		botonGalicia.on('pointerover', function (pointer) {
			this.setTint(0x856127);
		});

		botonGalicia.on('pointerout', function (pointer) {
			this.clearTint();
		});
	}
}