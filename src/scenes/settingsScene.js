import Phaser from 'phaser'
import LevelScene from './levelScene';

// ESCENA DE LA CONFIGURACION

export default class SettingScene extends Phaser.Scene {
	constructor() {
		super('settings');
	}

	init(data) {
		this.cameras.main.fadeIn(500);
		this.level = data.level;
		this.isMuted = data.mute;
		this.music = data.music;
	}

	preload() {
		this.load.image('background_settings', './img/pergamino.png');
		this.load.image('game_title', './img/titulo.png');
		this.load.spritesheet('game_resume', './assets/ui/resume_sprite.png', { frameWidth: 480, frameHeight: 170 });
		this.load.spritesheet('game_restart', './assets/ui/restart_sprite.png', { frameWidth: 480, frameHeight: 170 });
		this.load.spritesheet('main_menu', './assets/ui/MainMenu_sprite.png', { frameWidth: 480, frameHeight: 170 });
		this.load.spritesheet('sound_button', './assets/ui/SoundButton.png', { frameWidth: 192, frameHeight: 192 });
		this.load.spritesheet('mute_button', './assets/ui/MuteButton.png', { frameWidth: 192, frameHeight: 192 });
		this.load.spritesheet('full_screen', './assets/ui/FullScreenSprite.png', { frameWidth: 192, frameHeight: 192 });
	}

	create(data) {
		// BACKGROUND
		this.add.image(0, 0, 'background_settings').setOrigin(0, 0).setScale(0.91);
		// TITLE
		const title = this.add.image(this.sys.game.canvas.width / 2, 150, 'game_title').setScale(0.4);

		// RESUME BUTTON
		const resume = this.add.sprite(this.sys.game.canvas.width / 2, 300, 'game_resume').setScale(0.7);
		this.anims.create({
			key: 'hoverResume',
			frames: this.anims.generateFrameNumbers('game_resume', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		});
		resume.setInteractive({ cursor: 'pointer' });
		resume.on('pointerover', () => {
			resume.play('hoverResume');
		});
		resume.on('pointerout', () => {
			resume.playReverse('hoverResume');
		});
		resume.on('pointerdown', () => {
			this.scene.resume(this.level, { mute: this.isMuted });
			this.scene.resume('UIScene');
			this.scene.stop('settings');
		});
		this.input.keyboard.on('keydown', (event) => {
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.CTRL) {
				this.scene.resume(this.level, { mute: this.isMuted });
				this.scene.resume('UIScene');
				this.scene.stop('settings');
			}
		});


		// RESTART BUTTON
		const restart = this.add.sprite(this.sys.game.canvas.width / 2, 410, 'game_restart').setScale(0.6);
		this.anims.create({
			key: 'hoverRestart',
			frames: this.anims.generateFrameNumbers('game_restart', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		});
		restart.setInteractive({ cursor: 'pointer' });
		restart.on('pointerover', () => {
			restart.play('hoverRestart');
		});
		restart.on('pointerout', () => {
			restart.playReverse('hoverRestart');
		});
		restart.on('pointerup', () => {
			this.sound.removeByKey('explorationSong');
			this.sound.removeByKey('fightSong');
			this.sound.removeByKey('fightSong2');
			this.sound.removeByKey('fightSong3');
			this.sound.removeByKey('losse');
			this.scene.stop('settings');
			this.scene.stop('UIScene');
			this.scene.stop(this.level);
			this.scene.start('level1', { mute: this.isMuted });
			LevelScene.progress =  {
				level1: false,
				level2: true,
				level3: false,
				level4: false,
				levelBoss: true
			}
			
			LevelScene2.firstTalkMeiga = false
		});

		// MENU BUTTON
		const menu = this.add.sprite(this.sys.game.canvas.width / 2, 510, 'main_menu').setScale(0.6);
		this.anims.create({
			key: 'hoverMenu',
			frames: this.anims.generateFrameNumbers('main_menu', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		});
		menu.setInteractive({ cursor: 'pointer' });
		menu.on('pointerover', () => {
			menu.play('hoverMenu');
		});
		menu.on('pointerout', () => {
			menu.playReverse('hoverMenu');
		});
		menu.on('pointerup', () => {
			this.sound.removeByKey('explorationSong');
			this.sound.removeByKey('fightSong');
			this.scene.stop('settings');
			this.scene.stop('UIScene');
			this.scene.stop(this.level);
			this.scene.start('mainScene');
		});

		this.muteButton = this.add.sprite(1060, 630, 'mute_button').setScale(0.35);
		this.muteButton.visible = false;
		this.muteButton.setInteractive({ cursor: 'pointer' });
		this.muteButton.on('pointerover', () => {
			if (this.isMuted) {
				this.muteButton.play('hoverMute');
			} else {
				this.muteButton.play('hoverSound');
			}
		});
		this.muteButton.on('pointerout', () => {
			if (this.isMuted) {
				this.muteButton.playReverse('hoverMute');
			} else {
				this.muteButton.playReverse('hoverSound');
			}
		});
		this.muteButton.on('pointerup', () => {
			if (this.isMuted) {
				this.isMuted = false;
				this.events.emit('muteOption', this.isMuted);
				this.music.play();
			}
			this.changeButtonTexture(this.muteButton);
			this.muteButton.visible = false;
			this.soundButton.visible = true;
		});

		// SOUNDBUTTON
		this.soundButton = this.add.sprite(1060, 630, 'sound_button').setScale(0.35);
		this.soundButton.setInteractive({ cursor: 'pointer' });
		this.soundButton.on('pointerover', () => {
			if (!this.isMuted) {
				this.soundButton.play('hoverSound');
			} else {
				this.soundButton.play('hoverMute');
			}
		});
		this.soundButton.on('pointerout', () => {
			if (!this.isMuted) {
				this.soundButton.playReverse('hoverSound');
			} else {
				this.soundButton.playReverse('hoverMute');
			}
		});
		this.soundButton.on('pointerup', () => {
			if (!this.isMuted) {
				this.isMuted = true;
				this.events.emit('muteOption', this.isMuted);
				this.sound.stopAll();
			}
			this.changeButtonTexture(this.soundButton);
			this.muteButton.visible = true;
			this.soundButton.visible = false;
		});

		// FULLSCREEN BUTTON
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

	// COMPROBACIONES DE SI ESTA MUTEADO O NO
	update(t) {
		if (!this.isMuted) {
			this.soundButton.visible = true;
			this.muteButton.visible = false;
		}
		else {
			this.muteButton.visible = true;
			this.soundButton.visible = false;
		}
	}

	// FUNCION PARA CAMBIAR LA TEXTURA DEL BOTON DE SONIDO
	changeButtonTexture(button) {
		if (this.isMuted) {
			button.setTexture('sound_button');
		} else {
			button.setTexture('mute_button');
		}
		button.play('hover' + (this.isMuted ? 'Mute' : 'Sound'));
	}
}