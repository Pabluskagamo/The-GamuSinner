import Phaser from 'phaser'

export default class GameOverScene extends Phaser.Scene {
	constructor() {
		super('game_over');
	}

	init() {
		this.cameras.main.fadeIn(500);
	}

	preload() {
		this.load.image('background2', './img/fondo_pixelart3.png');
		this.load.image('game_over', './img/game_over.png');
		this.load.spritesheet('game_restart', './assets/ui/restart_sprite.png', { frameWidth: 480, frameHeight: 170 });
		this.load.spritesheet('main_menu', './assets/ui/MainMenu_sprite.png', { frameWidth: 480, frameHeight: 170 });
	}

	create() {
		this.anims.create({
			key: 'hoverRestart',
			frames: this.anims.generateFrameNumbers('game_restart', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		})
		this.anims.create({
			key: 'hoverMenu',
			frames: this.anims.generateFrameNumbers('main_menu', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		})
		this.add.image(0, 0, 'background2').setOrigin(0, 0).setScale(0.75);
		const title = this.add.image(this.sys.game.canvas.width / 2, 260, 'game_over').setScale(0.65);

		const restart = this.add.sprite(this.sys.game.canvas.width / 2, 470, 'game_restart').setScale(0.35);
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
			this.scene.start('level1');
		});

		this.input.keyboard.on('keydown', (event) => {
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
				this.sound.removeByKey('explorationSong');
				this.sound.removeByKey('fightSong');
				this.scene.start('level1');
			}
		});

		const menu = this.add.sprite(this.sys.game.canvas.width / 2, 525, 'main_menu').setScale(0.35);
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
			this.scene.start('mainScene');
		});

	}
}