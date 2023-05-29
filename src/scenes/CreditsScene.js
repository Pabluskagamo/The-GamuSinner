import Phaser from 'phaser'
import LevelScene from './levelScene';
import LevelScene2 from './levelScenes/levelScene2';

// ESCENA DE LOS CREDITOS DEL JUEGO

export default class CreditsScene extends Phaser.Scene {
	constructor() {
		super('credits_scene');
	}

	init() {
		this.cameras.main.fadeIn(500);
	}

	preload() {
		this.load.image('background_settings', './img/pergamino.png');
		this.load.image('game_over', './img/game_over.png');
		this.load.spritesheet('game_restart', './assets/ui/restart_sprite.png', { frameWidth: 480, frameHeight: 170 });
		this.load.spritesheet('main_menu', './assets/ui/MainMenu_sprite.png', { frameWidth: 480, frameHeight: 170 });
		this.load.audio("losse", "assets/audio/Effects/losse2.wav");
		this.load.image('game_title', './img/titulo.png');
		this.load.audio("creditsSong", "./assets/audio/credits.ogg");
	}

	create(data) {
		// AÑADE LA MUSICA
		this.isMuted = data.mute;
		this.level = data.level;

		this.creditsSound = this.sound.add("creditsSong", {
			volume: 0.3,
			loop: true
		});
		if(!this.isMuted){
			this.creditsSound.play()
		}
		
		// BAKGROUND
		this.add.image(0, 0, 'background_settings').setOrigin(0, 0)

		this.input.keyboard.on('keydown', (event) => {
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
				this.sound.removeByKey('explorationSong');
				this.sound.removeByKey('fightSong');
				this.sound.removeByKey('creditsSong');
				this.scene.stop('UIScene');
				this.scene.stop(this.level);
				this.scene.stop('stats');
				this.scene.start('mainScene');
				LevelScene.progress =  {
					level1: false,
					level2: true,
					level3: false,
					level4: false,
					levelBoss: true
				}
				
				LevelScene2.firstTalkMeiga = false
			}
		});

		this.anims.create({
			key: 'hoverMenu',
			frames: this.anims.generateFrameNumbers('main_menu', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		})

		// TITLE
		const title = this.add.image(this.sys.game.canvas.width / 2, 125, 'game_title').setScale(0.5);

		// MENSJAE DE AGRADECIMIENTO JUNTO A SUS CREADORES
		const thanksMsg = this.add.text(200, 200, '¡Muchas gracias por jugar a nuestro juego!', { fontFamily: 'MedievalSharp-Regular' }).setFontSize(40).setColor("#8C4B00").setFontStyle('bold')
		const alex = this.add.text(360, 300, 'Alejandro Antuña Rodríguez', { fontFamily: 'MedievalSharp-Regular' }).setFontSize(40).setColor("#8C4B00").setFontStyle('bold')
		const carlos = this.add.text(420, 350, 'Carlos Gómez López', { fontFamily: 'MedievalSharp-Regular' }).setFontSize(40).setColor("#8C4B00").setFontStyle('bold')
		const javi = this.add.text(420, 400, 'Javier Gil Caballero', { fontFamily: 'MedievalSharp-Regular' }).setFontSize(40).setColor("#8C4B00").setFontStyle('bold')
		const pablo = this.add.text(420, 450, 'Pablo Gamo González', { fontFamily: 'MedievalSharp-Regular' }).setFontSize(40).setColor("#8C4B00").setFontStyle('bold')
		
		// MENU BUTTON
		const menu = this.add.sprite(this.sys.game.canvas.width / 2, 570, 'main_menu').setScale(0.35);
		
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
			this.sound.removeByKey('creditsSong');
			this.scene.stop('UIScene');
			this.scene.stop(this.level);
			this.scene.stop('stats');
			this.scene.start('mainScene');
			LevelScene.progress =  {
				level1: false,
				level2: true,
				level3: false,
				level4: false,
				levelBoss: true
			}
			
			LevelScene2.firstTalkMeiga = false
		});

	}
}