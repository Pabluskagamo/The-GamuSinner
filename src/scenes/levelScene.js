import BulletPool from "../gameobjects/Pools/bulletPool"
import CoinPool from "../gameobjects/Pools/coinPool"
import FoodPool from "../gameobjects/Pools/foodPool"
import PowerUpPool from "../gameobjects/Pools/powerUpPool"
import EnemyPool from "../gameobjects/Pools/enemyPool"
import Character from "../gameobjects/character"
import Coin from "../gameobjects/items/coin";
import HealthPoint from "../ui/healthpoint"
import TripleShot from "../gameobjects/powerUps/tripleShot"
import EightDirShot from "../gameobjects/powerUps/eightDirShot"
import Food from "../gameobjects/items/food"
import BouncingShot from "../gameobjects/powerUps/bouncingShot"
import FreezingShot from "../gameobjects/powerUps/freezingShot"

export default class LevelScene extends Phaser.Scene {
	constructor() {
		super('level')
	}

	init() {
		this.cameras.main.fadeIn(500);
	}

	preload() {
		this.load.image('level_background', './img/top-down-forest.png')
		this.load.spritesheet('character', './assets/character/character.png', { frameWidth: 64, frameHeight: 32.3 })
		this.load.spritesheet('character_shot', './assets/character/character_shooting.png', { frameWidth: 64, frameHeight: 32 })
		this.load.spritesheet('blackWolf', './assets/enemies/blackWolf.png', { frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('cyclops', './assets/enemies/cyclops.png', { frameWidth: 64, frameHeight: 64.1 })
		this.load.spritesheet('goblin', './assets/enemies/redGoblin.png', { frameWidth: 32, frameHeight: 32.1 })
		this.load.spritesheet('spectre', './assets/enemies/spectre.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('spectre2', './assets/enemies/spectre2.png', { frameWidth: 32, frameHeight: 32 })
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
		this.load.image('tiles', './assets/tileset/forest_tiles.png')
		this.load.tilemapTiledJSON('map', './assets/tilemap/mapa_sinrio.json')
		this.load.image('game_settings', './assets/ui/settings.png')
		this.load.audio("appearEffect", "./assets/audio/Effects/AppearSoundEffect.mp3");
		this.load.audio("fightSong", "./assets/audio/Dream Raid Full Version (Mock Up).mp3");
		this.load.audio("explorationSong", "./assets/audio/Winds Of Stories.mp3");
		this.load.spritesheet('meiga', './assets/enemies/meiga.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('e_key', './assets/keyboards/E.png', { frameWidth: 19, frameHeight: 21 });
	}

	create() {

		this.banda = this.sound.add("fightSong", {
			volume: 0.1,
			loop: true
		});
		this.banda.play();

		this.initPlayerAndPools();
		this.initMap();
		this.coinPool.fillPull(20);
		this.foodPool.fillPull(20);
		this.bulletPool.fillPool(200);
		this.initTimers(false);
		const settings = this.add.image(90, 90, 'game_settings').setScale(0.3);
		this.scene.launch('UIScene', {maxHp: this.player.getMaxHp(), hp: this.player.getHp()});

		this.foodPool.spawn(500, 150);
		settings.setInteractive({ cursor: 'pointer' });

		settings.on('pointerover', function (pointer) {
			this.setTint(0xffc800);
		});

		settings.on('pointerout', function (pointer) {
			this.clearTint();
		});

		settings.on('pointerup', () => {
			this.player.stopHorizontal();
			this.player.stopVertical();
			this.scene.pause();
			this.scene.pause('UIScene');
			this.scene.launch('settings', { music: this.banda });
		});

		this.input.keyboard.on('keydown', (event) => {
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.CTRL) {
				this.player.stopHorizontal();
				this.player.stopVertical();
				this.scene.pause();
				this.scene.pause('UIScene');
				this.scene.launch('settings', { music: this.banda });
			}
		});

		let powerUps = []

		for (let i = 0; i < 2; i++) {
			powerUps.push(new FreezingShot(this, -125, -125));
			powerUps.push(new BouncingShot(this, -125, -125));
			powerUps.push(new TripleShot(this, -125, -125));
			powerUps.push(new EightDirShot(this, -125, -125));
		}
		this.powerUpPool.addMultipleEntity(powerUps);
		this.spawnMeiga = false;
		this.e = this.input.keyboard.addKey('E');
		let statsGame = this.scene.get('stats');

		statsGame.events.on('spentcoins', function (coins) {
			this.player.setWallet(coins);
		}, this);

		statsGame.events.on('incrementStrong', function (dmg) {
			this.bulletPool.changeDmg(dmg);
		}, this);

		statsGame.events.on('incrementSpeed', function (speed) {
			this.player.setSpeed(speed);
		}, this);

		statsGame.events.on('incrementLife', function (hp) {
			this.player.incrementHp();
			this.player.setHp(hp);
		}, this);

		statsGame.events.on('incrementCadence', function (cadence) {
			this.player.setCadence(cadence);
		}, this);
	}


	update(t) {
		if (this.debugMode && Phaser.Input.Keyboard.JustUp(this.v)) {
			this.enemyPool.spawn(0, 0)
		}

		if (!this.wavesFinished && !this.debugMode) {
			this.updateWaveCount()
		}
		else if (!this.levelFinished && this.enemyPool.fullPool() && !this.debugMode) {
			this.levelFinished = true;
			this.completeLevel();
		}

		if (this.spawnMeiga && this.e.isDown) {
			this.openMeigaMenu()
		}

	}

	initMap() {
		const mapa = this.map = this.make.tilemap({
			key: 'map'
		});
		const tiles = mapa.addTilesetImage('Forest', 'tiles');
		this.groundLayer = this.map.createLayer('Suelo', tiles);
		this.foregroundLayer = this.map.createLayer('Bordes', tiles);
		//this.river = this.map.createLayer('Rio', tiles);
		//this.borderRiver = this.map.createLayer('MargenRio', tiles);
		this.objetos = this.map.createLayer('Objetos', tiles);
		this.borderTrees = this.map.createLayer('bordeArboles', tiles);

		//this.river.setCollisionBetween(0, 999);
		this.foregroundLayer.setCollisionBetween(0, 999);

		this.physics.add.collider(this.enemyPool._group, this.foregroundLayer);
		this.physics.add.collider(this.player, this.foregroundLayer);
		//this.physics.add.collider(this.enemyPool._group, this.river);
		//this.physics.add.collider(this.player, this.river);

		this.physics.add.collider(this.bulletPool._group, this.foregroundLayer, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		this.player.setDepth(2);
		this.enemyPool._group.setDepth(2);
		this.borderTrees.setDepth(3);
		this.foregroundLayer.setDepth(3);
	}

	initPlayerAndPools() {
		this.player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 150, null);
		this.player.body.onCollide = true;

		this.bulletPool = new BulletPool(this, 150, 20)
		this.powerUpPool = new PowerUpPool(this, 6)
		this.enemyPool = new EnemyPool(this, 15);
		this.coinPool = new CoinPool(this, 20);
		this.foodPool = new FoodPool(this, 20);

		this.enemyPool.fillPool(25, this.player);

		this.physics.add.collider(this.bulletPool._group, this.enemyPool._group, (obj1, obj2) => {
			obj1.hit(obj2)
		}, (obj1, obj2) => !obj2.isDead());

		this.physics.add.overlap(this.coinPool._group, this.player, (obj1, obj2) => {
			obj1.collect(obj2);
			this.events.emit('earnCoin', obj2.getWallet());
		});

		this.physics.add.overlap(this.powerUpPool._group, this.player, (obj1, obj2) => {
			obj2.collectPowerUp(obj1);
		}, (obj1, obj2) => !obj1.isEnabled());
		this.physics.add.overlap(this.foodPool._group, this.player, (obj1, obj2) => {
			obj1.collect(obj2);
			this.events.emit('addScore', obj2.getHp());
		});

		this.physics.add.collider(this.enemyPool._group, this.player, (obj1, obj2) => {
			obj1.attack(obj2);
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.getDash()
		);

	}

	spawnInBounds() {
		console.log('SPAWN ENEMY')

		const xPos = [0, this.sys.game.canvas.width]
		const yPos = [0, this.sys.game.canvas.height]

		const randX = Phaser.Math.RND.between(0, 1);
		const randY = Phaser.Math.RND.between(0, 1);

		const randNum = Phaser.Math.RND.between(1, 15);

		// console.log('SPAWN ENEMY RAND NUM:', randNum)

		if (randNum < 7) {
			this.enemyPool.spawnGob(xPos[randX], yPos[randY])
		} else if (randNum > 7 && randNum < 11) {
			this.enemyPool.spawnWolf(xPos[randX], yPos[randY])
		} else if (randNum > 11 && randNum < 14) {
			this.enemyPool.spawnSpectre(xPos[randX], yPos[randY])
		} else {
			this.enemyPool.spawnCyclops(xPos[randX], yPos[randY])
		}

		//this.enemyPool.spawn(xPos[randX], yPos[randY]);
	}

	initTimers(debug) {
		this.freqChangeTime = 1;
		this.lastSec = 20;
		this.freqFactor = 500;
		this.levelFinished = false;
		this.wavesFinished = false;

		if (debug) {
			this.v = this.input.keyboard.addKey('v');
			this.debugMode = true;
		} else {
			this.enemySpawnTimer = this.time.addEvent({

				delay: 100,
				callback: this.spawnInBounds,
				callbackScope: this,
				loop: true
			});


			this.freqTimer = this.time.addEvent({

				delay: this.freqChangeTime,
				callback: this.changeFreqHandler,
				callbackScope: this,
				loop: true
			});
		}
	}

	gameOver() {
		this.cameras.main.fadeOut(500);
		this.cameras.main.once("camerafadeoutcomplete", function () {
			this.scene.start('game_over');
			this.scene.stop('UIScene')
			this.banda.stop()
		}, this);
	}

	completeLevel(){
		console.log("NIVEL COMPLETADO")

		this.sound.removeByKey('fightSong');
		this.events.emit('levelComplete');

		for (let i = 0; i < 5; i++) {
			setTimeout(() => {
				this.cameras.main.flash(500);
			}, i * 600);
		}

		this.addMeiga();
		this.spawnMeiga = true;
		this.player.collectCoin(1000);
	}

	changeFreqHandler() {
		const currDelay = this.enemySpawnTimer.delay;

		this.freqFactor = currDelay > 1000 ? 500 : 200;

		if (currDelay === 1500) {
			this.freqChangeTime = 30000;
			this.lastSec = 30;
			this.freqTimer.reset({
				delay: this.freqChangeTime,
				callback: this.changeFreqHandler,
				callbackScope: this,
				loop: true
			})
		}

		console.log('cambio de frecuencia de', currDelay, 'a', currDelay - this.freqFactor)
		if (currDelay > 400) {
			this.enemySpawnTimer.reset({
				delay: currDelay - this.freqFactor,
				callback: this.spawnInBounds,
				callbackScope: this,
				loop: true
			})
		} else {
			this.enemySpawnTimer.remove();
			this.freqTimer.remove();
			this.wavesFinished = true;
		}
	}

	getGameHeight() {
		return this.game.config.height
	}

	getGameWidth() {
		return this.game.config.width
	}

	updateWaveCount(){
		const remaining = (this.freqChangeTime - this.freqTimer.getElapsed()) / 1000;

		if (this.lastSec != remaining) {
			this.events.emit('changeCount', remaining.toFixed(0));
		}

		this.lastSec = remaining
	}

	addMeiga() {
		const appearEffect = this.sound.add("appearEffect", {
			volume: 0.1
		});
		const explorationSong = this.sound.add("explorationSong", {
			volume: 0.1,
			loop: true
		});

		appearEffect.play();

		appearEffect.once('complete', () => {
			explorationSong.play();
		});
		const meiga = this.add.sprite(960, 250, 'meiga').setScale(1.6);
		this.anims.create({
			key: 'meigaState',
			frames: this.anims.generateFrameNumbers('meiga', { start: 0, end: 3 }),
			frameRate: 3,
			repeat: -1
		});
		meiga.play('meigaState');
		const e_key = this.add.sprite(957, 220, 'e_key');
		this.anims.create({
			key: 'E_Press',
			frames: this.anims.generateFrameNumbers('e_key', { start: 0, end: 2 }),
			frameRate: 2,
			repeat: -1
		});
		e_key.play('E_Press');
	}

	openMeigaMenu(){
		this.player.stopHorizontal();
		this.player.stopVertical();
		this.scene.pause();
		this.scene.pause('UIScene');
		if (this.scene.isSleeping('stats')) {
			this.scene.wake('stats', { player: this.player, dmg: this.bulletPool.getDmg() });
			this.scene.resume('stats', { player: this.player, dmg: this.bulletPool.getDmg() });

		} else {
			this.scene.launch('stats', { player: this.player, dmg: this.bulletPool.getDmg() });
		}
	}
}