import Phaser from 'phaser'

export default class selectionScene extends Phaser.Scene {
	constructor() {
		super('selecScene');
		this.isMuted = false;
	}

	preload() {
		this.load.image('mapa', './img/espania.png');
		this.load.image('botonAmarillo', './assets/ui/boton amarillo.png');
		this.load.image('botonRojo', './assets/ui/boton rojo.png');
		this.load.image('game_settings', '/assets/ui/settings.png');
		this.load.audio("fightSong", "assets/audio/Dream Raid Full Version (Mock Up).mp3");
	}


	create() {

		let banda = this.sound.add("fightSong", {
			volume: 0.1,
			loop: true
		});
		banda.play();

		this.add.image(0, 0, 'mapa').setOrigin(0, 0).setScale(1);
		const settings = this.add.image(90, 90, 'game_settings').setScale(0.3);
		const botonGalicia = this.add.image(400, 140, 'botonAmarillo').setScale(0.15);
		const botonAsturias = this.add.image(550, 140, 'botonRojo').setScale(0.15);
		const botonBarcelona = this.add.image(980, 190, 'botonRojo').setScale(0.15);
		const botonMadrid = this.add.image(680, 300, 'botonRojo').setScale(0.15);
		const botonAndalucia = this.add.image(630, 470, 'botonRojo').setScale(0.15);
	

		settings.setInteractive({ cursor: 'pointer' });

		settings.on('pointerover', function (pointer) {
			this.setTint(0xffc800);
		});

		settings.on('pointerout', function (pointer) {
			this.clearTint();
		});
		settings.on('pointerup', () => {
			this.scene.launch('settings', {music: banda});
		});

		this.input.keyboard.on('keydown', (event) => {
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.CTRL) {
				this.scene.launch('settings', {music: banda});
			}
		});
		botonGalicia.setInteractive({ cursor: 'pointer' });

		botonGalicia.on('pointerup', () => {
			this.cameras.main.fadeOut(500);
			this.cameras.main.once("camerafadeoutcomplete", function () {
				this.scene.start('level');
			}, this);
		});
	}
}