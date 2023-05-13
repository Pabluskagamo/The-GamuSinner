import Phaser from 'phaser'

// ESCENA DE LA PANTALLA DE INICIO

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('mainScene');
		this.isMuted = false;
	}

	// CARGAMOS LA MAYORIA DE LOS DATOS PARA NO SATURAR EL RESTO DEL JUEGO
	preload() {
		this.load.image('background', './img/fondo_pixelart3.png');
		this.load.image('game_title', './img/titulo.png');
		this.load.spritesheet('game_start', './assets/ui/start_sprite.png', { frameWidth: 750, frameHeight: 355 });
		this.load.spritesheet('sound_button', './assets/ui/SoundButton.png', { frameWidth: 192, frameHeight: 192 });
		this.load.spritesheet('mute_button', './assets/ui/MuteButton.png', { frameWidth: 192, frameHeight: 192 });
		this.load.spritesheet('full_screen', './assets/ui/FullScreenSprite.png', { frameWidth: 192, frameHeight: 192 });
		this.load.audio("musica", "assets/audio/awesomeness.mp3");
		this.load.spritesheet('character', './assets/character/character.png', { frameWidth: 64, frameHeight: 32 })
		this.load.spritesheet('character_shot', './assets/character/character_shooting.png', { frameWidth: 64, frameHeight: 32 })
		this.load.spritesheet('blackWolf', './assets/enemies/blackWolf.png', { frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('cyclops', './assets/enemies/cyclops.png', { frameWidth: 64, frameHeight: 64.1 })
		this.load.spritesheet('goblin', './assets/enemies/redGoblin.png', { frameWidth: 32, frameHeight: 32.1 })
		this.load.spritesheet('spectre2', './assets/enemies/spectre.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('demonboss', './assets/enemies/boss/boss_demon_slime/spritesheets/demonboss.png', { frameWidth: 288, frameHeight: 160 })
		this.load.spritesheet('projectilesboss', './assets/enemies/boss/boss_demon_slime/spritesheets/projectilesboss.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('explosion', './assets/enemies/boss/attacks/explosion.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('jellyfishpet', './assets/pets/jellyfish.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('muerte', './assets/effects/explosion.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('bullet', './assets/bullets/bullets.png', { frameWidth: 16, frameHeight: 16 })
		this.load.spritesheet('icebullet', './assets/bullets/icebullets.png', { frameWidth: 16, frameHeight: 16 })
		this.load.spritesheet('bouncigbullet', './assets/bullets/bouncigbullets.png', { frameWidth: 16, frameHeight: 16 })
		this.load.spritesheet('coin', './assets/items/coin.png', { frameWidth: 16, frameHeight: 16 })
		this.load.spritesheet('food', './assets/items/food.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('tripleshot', './assets/powerups/Tripleshoot.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('multishot', './assets/powerups/Multishoot.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('freezingshot', './assets/powerups/FreezeArrow.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('bouncingshot', './assets/powerups/BouncingArrow.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('petpower', './assets/powerups/pet.png', { frameWidth: 32, frameHeight: 32 })
		this.load.image('tiles', './assets/tileset/forest_tiles.png')
		this.load.image('tilesCastleProps', './assets/tileset/sala2/tilesetCastle/TX Props.png')
		this.load.image('tilesCastleStruct', './assets/tileset/sala2/tilesetCastle/TX Struct.png')
		this.load.image('tilesCastleWall', './assets/tileset/sala2/tilesetCastle/TX Tileset Wall.png')
		this.load.image('tilesCastleGrass', './assets/tileset/sala2/tilesetCastle/TX Tileset Grass.png')
		this.load.image('tilesCastlePlant', './assets/tileset/sala2/tilesetCastle/TX Plant.png')
		this.load.image('tileFaerieForest', './assets/tileset/FaerieForest_PetricakeGamesPNG.png')
		this.load.image('tilesBossSuelo', './assets/tileset/salaBoss/drain-blood.png')
		this.load.image('tilesBossPared', './assets/tileset/salaBoss/evildungeon.png')
		this.load.image('tilesBossPentagram', './assets/tileset/salaBoss/pentagramm.png')
		this.load.image('tilesBossBricks', './assets/tileset/salaBoss/autotile purple brick.png')
		this.load.image('tilesBossBloodFountain', './assets/tileset/salaBoss/blood-fountain.png')
		this.load.tilemapTiledJSON('sala1', './assets/tilemap/sala1.json')
		this.load.tilemapTiledJSON('sala2', './assets/tilemap/sala2.json')
		this.load.tilemapTiledJSON('sala3', './assets/tilemap/sala3.json')
		this.load.tilemapTiledJSON('sala4', './assets/tilemap/sala4.json')
		this.load.tilemapTiledJSON('salaBoss', './assets/tilemap/salaBoss.json')
		this.load.audio("appearEffect", "./assets/audio/Effects/AppearSoundEffect.mp3");
		this.load.audio("explorationSong", "./assets/audio/Winds Of Stories.mp3");
		this.load.audio("hit", "./assets/effects/hit.mp3");
		this.load.audio("spectre_die", "./assets/effects/spectre_die.mp3");
		this.load.audio("goblin_die", "./assets/effects/goblin_die.mp3");
		this.load.audio("cyclops_die", "./assets/effects/cyclops_die.mp3");
		this.load.audio("blackWolf_die", "./assets/effects/blackWolf_die.mp3");
		this.load.audio("shoot_sound", "./assets/effects/shoot.wav");
		this.load.audio("takecoin_audio", "./assets/effects/coin.wav");
		this.load.audio("powerup_audio", "./assets/effects/powerup.wav");
		this.load.audio("takefood_audio", "./assets/effects/heal.wav");
		this.load.audio("fightSong", "./assets/audio/AdventureHO2.mp3");
		this.load.audio("fightSong2", "./assets/audio/kim_lightyear_-_angel_eyes_chiptune_edit.mp3");
		this.load.audio("fightSong3", "./assets/audio/level2song.wav");
		this.load.audio("panasong", "./assets/audio/panamiguel.mp3");
		this.load.audio("bossSong", "./assets/audio/Boss Battle.wav");
		this.load.audio("bossAppear", "./assets/effects/bossapear.mp3");
		this.load.audio("bossAttacksound", "./assets/effects/bossAttacksound.mp3");
		this.load.audio("bossExplotion", "./assets/effects/explotionBoss.wav");
		this.load.audio("bossShoot", "./assets/effects/bossShot.wav");
		this.load.audio("bossRage", "./assets/effects/bossRage.mp3");
		this.load.audio("bossDie", "./assets/effects/bossDie.mp3");
		this.load.audio("bossSongSecondFase", "./assets/audio/secondfasebossmusic.wav");
		this.load.audio("dungeonEnterSong", "./assets/audio/dungeonentermusic.mp3");
		this.load.spritesheet('meiga', './assets/enemies/meiga.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('e_key', './assets/keyboards/E.png', { frameWidth: 19, frameHeight: 21 });
		this.load.spritesheet('q_key', './assets/keyboards/Q.png', { frameWidth: 19, frameHeight: 21 });
	}


	create() {
		// AÑADE MUSICA SI PUEDE
		if(!this.isMuted){
			this.banda = this.sound.add("musica", {
				volume: 0.2,
				loop: true
			});
			this.banda.play();
		}

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

		// BACKGROUND
		this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.75);
		const title = this.add.image(this.sys.game.canvas.width / 2, 230, 'game_title').setScale(0.65);

		// STARTBUTTON
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
				this.scene.stop();
				this.scene.start('history', {mute: this.isMuted});
			}, this);
		});

		this.input.keyboard.on('keydown', (event) => {
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
				this.cameras.main.fadeOut(500);
				this.cameras.main.once("camerafadeoutcomplete", function () {
					this.sound.removeByKey('musica');
					this.scene.stop();
					this.scene.start('history', {mute: this.isMuted});
				}, this);
			}
		});

		// MUTE BUTTON
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
				this.banda.play();
			}
			this.changeButtonTexture(muteButton);
			muteButton.visible = false;
			soundButton.visible = true;
		});

		// SOUND BUTTON
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

	// FUNCION PARA CAMBIAR TEXTURA DE LOS BOTONES DE SONIDO
	changeButtonTexture(button) {
		if (this.isMuted) {
			button.setTexture('sound_button');
		} else {
			button.setTexture('mute_button');
		}
		button.play('hover' + (this.isMuted ? 'Mute' : 'Sound'));
	}
}