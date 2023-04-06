import BulletPool from "../gameobjects/Pools/bulletPool"
import CoinPool from "../gameobjects/Pools/coinPool"
import PowerUpPool from "../gameobjects/Pools/powerUpPool"
import EnemyPool from "../gameobjects/Pools/enemyPool"
import Character from "../gameobjects/character"
import Coin from "../gameobjects/items/coin";
import HealthPoint from "../ui/healthpoint"
import TripleShot from "../gameobjects/items/tripleShot"
import EightDirShot from "../gameobjects/items/eightDirShot"

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
		this.load.spritesheet('muerte', './assets/effects/explosion.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('bullet', './assets/bullets/bullets.png', { frameWidth: 16, frameHeight: 16 })
		this.load.spritesheet('coin', './assets/items/coin.png', { frameWidth: 16, frameHeight: 16 })
		this.load.spritesheet('tripleshoot', './assets/powerups/Tripleshoot.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('multishoot', './assets/powerups/Multishoot.png', { frameWidth: 32, frameHeight: 32 })
		this.load.image('tiles', './assets/tileset/forest_tiles.png')
		this.load.tilemapTiledJSON('map', './assets/tilemap/mapa_sinrio.json')
		this.load.image('game_settings', '/assets/ui/settings.png')
	}

	create() {
		this.initPlayerAndPools();
		this.initMap();
		this.coinPool.fillPull(20);
		this.bulletPool.fillPool(200);
		this.initTimers(false);
		const settings = this.add.image(90, 90, 'game_settings').setScale(0.3);
		this.scene.launch('UIScene');

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
			this.scene.launch('settings');
		});

		this.input.keyboard.on('keydown', (event) => {
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ESC) {
				this.player.stopHorizontal();
				this.player.stopVertical();
				this.scene.pause();
				this.scene.pause('UIScene');
				this.scene.launch('settings');
			}
		});

		let powerUps = []

		for (let i = 0; i < 10; i++) {
			powerUps.push(new TripleShot(this, -125, -125));
			powerUps.push(new EightDirShot(this, -125, -125));
		}
		this.powerUpPool.addMultipleEntity(powerUps);
	}


	update(t) {
		if (this.debugMode && Phaser.Input.Keyboard.JustUp(this.v)) {
			this.enemyPool.spawn(0, 0)
		}

		const remaining = (this.freqChangeTime - this.freqTimer.getElapsed()) / 1000;

		if (this.lastSec != remaining) {
			this.events.emit('changeCount', remaining.toFixed(0));
		}

		this.lastSec = remaining
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
			this.bulletPool.release(obj1);
		});

		this.player.setDepth(2);
		this.enemyPool._group.setDepth(2);
		this.borderTrees.setDepth(3);
		this.foregroundLayer.setDepth(3);
	}

	initPlayerAndPools() {
		this.player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 150, null);
		this.player.body.onCollide = true;


		this.bulletPool = new BulletPool(this, 150)
		this.powerUpPool = new PowerUpPool(this, 15)
		this.enemyPool = new EnemyPool(this, 15);
		this.coinPool = new CoinPool(this, 20);


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
		});

		this.physics.add.collider(this.enemyPool._group, this.player, (obj1, obj2) => {
			obj1.attack(obj2);
			this.events.emit('addScore', obj2.getHp());
		});

	}

	spawnInBounds() {
		const xPos = [0, this.sys.game.canvas.width]
		const yPos = [0, this.sys.game.canvas.height]

		const randX = Phaser.Math.RND.between(0, 1);
		const randY = Phaser.Math.RND.between(0, 1);

		this.enemyPool.spawn(xPos[randX], yPos[randY]);
	}

	initTimers(debug) {
		this.freqChangeTime = 20000;
		this.lastSec = 20;
		this.freqFactor = 500;

		if (debug) {
			this.v = this.input.keyboard.addKey('v');
			this.debugMode = true;
		} else {
			this.enemySpawnTimer = this.time.addEvent({

				delay: 4000,
				callback: () => { this.spawnInBounds(); },
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
			this.scene.sleep('UIScene');
		}, this);
	}

	changeFreqHandler() {
		const currDelay = this.enemySpawnTimer.delay;

		this.freqFactor = currDelay > 1000 ? 500 : 200;

		console.log('cambio de frecuencia de', currDelay, 'a', currDelay - this.freqFactor)
		if (currDelay > 400) {
			this.enemySpawnTimer.reset({
				delay: currDelay - this.freqFactor,
				callback: () => { this.spawnInBounds(); },
				callbackScope: this,
				loop: true
			})
		} else {
			this.enemySpawnTimer.remove();
		}
	}
}