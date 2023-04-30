import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('mainScene');
		this.isMuted = false;
	}

	preload() {
		this.load.image('background', './img/fondo_pixelart3.png');
		this.load.image('game_title', './img/titulo.png');
		this.load.spritesheet('game_start', './assets/ui/start_sprite.png', { frameWidth: 750, frameHeight: 355 });
		this.load.spritesheet('sound_button', './assets/ui/SoundButton.png', { frameWidth: 192, frameHeight: 192 });
		this.load.spritesheet('mute_button', './assets/ui/MuteButton.png', { frameWidth: 192, frameHeight: 192 });
		this.load.spritesheet('full_screen', './assets/ui/FullScreenSprite.png', { frameWidth: 192, frameHeight: 192 });
		this.load.audio("musica", "assets/audio/awesomeness.mp3");
	}


	create() {

		let banda = this.sound.add("musica", {
			volume: 0.2,
			loop: true
		});
		banda.play();

		this.anims.create({
			key: 'hoverStart',
			frames: this.anims.generateFrameNumbers('game_start', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		})

		this.anims.create({
			key: 'hoverSound',
			frames: this.anims.generateFrameNumbers('sound_button', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		})

		this.anims.create({
			key: 'hoverMute',
			frames: this.anims.generateFrameNumbers('mute_button', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		})

		this.anims.create({
			key: 'hoverFullScreen',
			frames: this.anims.generateFrameNumbers('full_screen', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		})

		this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.75);
		const title = this.add.image(this.sys.game.canvas.width / 2, 230, 'game_title').setScale(0.65);
		const start = this.add.sprite(this.sys.game.canvas.width / 2, 365, 'game_start').setScale(0.35);
		start.setInteractive({ cursor: 'pointer' });
		start.on('pointerover', () => {
			start.play('hoverStart');
		});

		start.on('pointerout', () => {
			start.playReverse('hoverStart');
		});

		start.on('pointerup', () => {
			this.cameras.main.fadeOut(500);
			this.cameras.main.once("camerafadeoutcomplete", function () {
				this.sound.removeByKey('musica');
				this.scene.start('history');
			}, this);
		});

		this.input.keyboard.on('keydown', (event) => {
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
				this.cameras.main.fadeOut(500);
				this.cameras.main.once("camerafadeoutcomplete", function () {
					this.sound.removeByKey('musica');
					this.scene.start('history');
				}, this);
			}
		});

		const muteButton = this.add.sprite(1060, 630, 'mute_button').setScale(0.35);
		muteButton.visible = false;
		muteButton.setInteractive({ cursor: 'pointer' });
		muteButton.on('pointerover', () => {
			if (this.isMuted) {
				muteButton.play('hoverMute');
			} else {
				muteButton.play('hoverSound');
			}
		});
		muteButton.on('pointerout', () => {
			if (this.isMuted) {
				muteButton.playReverse('hoverMute');
			} else {
				muteButton.playReverse('hoverSound');
			}
		});
		muteButton.on('pointerup', () => {
			if (this.isMuted) {
				this.isMuted = false;
				banda.play();
			}
			this.changeButtonTexture(muteButton);
			muteButton.visible = false;
			soundButton.visible = true;
		});

		const soundButton = this.add.sprite(1060, 630, 'sound_button').setScale(0.35);
		soundButton.setInteractive({ cursor: 'pointer' });
		soundButton.on('pointerover', () => {
			if (!this.isMuted) {
				soundButton.play('hoverSound');
			} else {
				soundButton.play('hoverMute');
			}
		});
		soundButton.on('pointerout', () => {
			if (!this.isMuted) {
				soundButton.playReverse('hoverSound');
			} else {
				soundButton.playReverse('hoverMute');
			}
		});
		soundButton.on('pointerup', () => {
			if (!this.isMuted) {
				this.isMuted = true;
				this.sound.stopAll();
			}
			this.changeButtonTexture(soundButton);
			muteButton.visible = true;
			soundButton.visible = false;
		});

		const fullScreen = this.add.sprite(1120, 627, 'full_screen').setScale(0.25);

		fullScreen.setInteractive({ cursor: 'pointer' });
		fullScreen.on('pointerover', () => {
			fullScreen.play('hoverFullScreen');
		});
		fullScreen.on('pointerout', () => {
			fullScreen.playReverse('hoverFullScreen');
		});
		fullScreen.on('pointerup', () => {
			this.game.canvas.requestFullscreen();
			// if (this.scale.isFullscreen) {
			// 	this.scale.stopFullscreen();
			// } else {
			// 	this.scale.startFullscreen();
			// }
		});
	}

	changeButtonTexture(button) {
		if (this.isMuted) {
			button.setTexture('sound_button');
		} else {
			button.setTexture('mute_button');
		}
		button.play('hover' + (this.isMuted ? 'Mute' : 'Sound'));
	}
}