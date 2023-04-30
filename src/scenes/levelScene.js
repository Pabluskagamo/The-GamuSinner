import BulletPool from "../gameobjects/Pools/bulletPool"
import CoinPool from "../gameobjects/Pools/coinPool"
import FoodPool from "../gameobjects/Pools/foodPool"
import PowerUpPool from "../gameobjects/Pools/powerUpPool"
import EnemyPool from "../gameobjects/Pools/enemyPool"
import Character from "../gameobjects/character"
import TripleShot from "../gameobjects/powerUps/tripleShot"
import EightDirShot from "../gameobjects/powerUps/eightDirShot"
import BouncingShot from "../gameobjects/powerUps/bouncingShot"
import FreezingShot from "../gameobjects/powerUps/freezingShot"

export default class LevelScene extends Phaser.Scene {
	static progress = {
		level1: true,
		level2: true,
		level3: true,
		level4: false,
		levelBoss: false
	}


	constructor(scene) {
		super(scene)
        this.namescene = scene;
	}

	init() {
		console.log("Entre")
		this.cameras.main.fadeIn(500);
	}

	preload() {
		this.load.spritesheet('character', './assets/character/character.png', { frameWidth: 64, frameHeight: 32 })
		this.load.spritesheet('character_shot', './assets/character/character_shooting.png', { frameWidth: 64, frameHeight: 32 })
		this.load.spritesheet('blackWolf', './assets/enemies/blackWolf.png', { frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('cyclops', './assets/enemies/cyclops.png', { frameWidth: 64, frameHeight: 64.1 })
		this.load.spritesheet('goblin', './assets/enemies/redGoblin.png', { frameWidth: 32, frameHeight: 32.1 })
		this.load.spritesheet('spectre2', './assets/enemies/spectre.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('demonboss', './assets/enemies/boss/boss_demon_slime/spritesheets/demonboss.png', { frameWidth: 288, frameHeight: 160 })
		this.load.spritesheet('projectilesboss', './assets/enemies/boss/boss_demon_slime/spritesheets/projectilesboss.png', { frameWidth: 32, frameHeight: 32 })
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
		this.load.image('tiles', './assets/tileset/forest_tiles.png')
		this.load.image('tilesCastleProps', './assets/tileset/sala2/tilesetCastle/TX Props.png')
		this.load.image('tilesCastleStruct', './assets/tileset/sala2/tilesetCastle/TX Struct.png')
		this.load.image('tilesCastleWall', './assets/tileset/sala2/tilesetCastle/TX Tileset Wall.png')
		this.load.image('tilesCastleGrass', './assets/tileset/sala2/tilesetCastle/TX Tileset Grass.png')
		this.load.image('tilesCastlePlant', './assets/tileset/sala2/tilesetCastle/TX Plant.png')
		this.load.image('tileFaerieForest', './assets/tileset/FaerieForest_PetricakeGamesPNG.png')
		this.load.tilemapTiledJSON('sala1', './assets/tilemap/sala1.json')
		this.load.tilemapTiledJSON('sala2', './assets/tilemap/sala2.json')
		this.load.tilemapTiledJSON('sala3', './assets/tilemap/sala3.json')
		this.load.tilemapTiledJSON('sala4', './assets/tilemap/sala4.json')
		this.load.image('puertaSala1', './assets/tileset/puertas_32x32.png')
		this.load.image('puertaSala3', './assets/tileset/puertas3_32x32.png')
		this.load.image('puertaSala4', './assets/tileset/puerta4_32x32.PNG')
		this.load.image('puertaSala2Izq', './assets/tileset/sala2/Pizq.png')
		this.load.image('puertaSala2Der', './assets/tileset/sala2/Pder.png')
		this.load.image('puertaSala2Abajo', './assets/tileset/sala2/Pabj.png')
		this.load.image('game_settings', './assets/ui/settings.png')
		this.load.image('pana', './assets/enemies/pana_pixel.png')
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
		this.load.audio("panasong", "./assets/audio/panamiguel.mp3");
		this.load.spritesheet('meiga', './assets/enemies/meiga.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('e_key', './assets/keyboards/E.png', { frameWidth: 19, frameHeight: 21 });
	}

	create(data) {

        this.banda = this.sound.add("fightSong", {
			volume: 0.1,
			loop: true
		});

		this.explorationSong = this.sound.add("explorationSong", {
			volume: 0.1,
			loop: true
		});

		this.initPlayerAndPools(data);
		this.initMap();
		this.coinPool.fillPull(20);
		this.foodPool.fillPull(20);
		this.bulletPool.fillPool(1000);
		
		if(LevelScene.progress[this.namescene]){
			this.initLevelFreeMode()
		}else{
			this.initLevelFightMode();
		}

		const settings = this.add.image(90, 90, 'game_settings').setScale(0.3).setDepth(4);

		console.log("LAUNCH Level", this.namescene)
		if(this.namescene == 'level1'){		
			this.scene.launch('stats', {playerData: this.player.getPlayerStats(), level: this.namescene, dmg: this.bulletPool.getDmg()})
			this.scene.sleep('stats');
			this.scene.launch('UIScene', {playerData: this.player.getPlayerStats(), level: this.namescene, bossLevel: data.bossLevel});
		}

		if(this.namescene == 'level2'){		
			this.scene.launch('stats', {playerData: this.player.getPlayerStats(), level: this.namescene, dmg: this.bulletPool.getDmg()})
			this.scene.sleep('stats');
		}

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
			this.scene.launch('settings', { level: this.namescene });
		});

		this.input.keyboard.on('keydown', (event) => {
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.CTRL) {
				this.player.stopHorizontal();
				this.player.stopVertical();
				this.scene.pause();
				this.scene.pause('UIScene');
				this.scene.launch('settings', { level: this.namescene });
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

		this.e = this.input.keyboard.addKey('E');
		this.statsGame = this.scene.get('stats');

		this.statsGame.events.on('spentcoins', function (coins) {
			this.player.setWallet(coins);
		}, this);

		this.statsGame.events.on('incrementStrong', function (dmg) {
			this.bulletPool.changeDmg(dmg);
		}, this);

		this.statsGame.events.on('incrementSpeed', function (speed) {
			this.player.setSpeed(speed);
		}, this);

		this.statsGame.events.on('incrementLife', function (hp) {
			this.player.incrementHp();
			this.player.setHp(hp);
		}, this);

		this.statsGame.events.on('incrementCadence', function (cadence) {
			this.player.setCadence(cadence);
		}, this);
	}


	update(t) {
		
		if (this.debugMode && Phaser.Input.Keyboard.JustUp(this.v)) {
			this.enemyPool.spawn(0, 0)
		}

		if(!LevelScene.progress[this.namescene]){
			if (!this.wavesFinished && !this.debugMode) {
				this.updateWaveCount()
			}
			else if (!this.levelFinished && this.enemyPool.fullPool() && !this.debugMode) {
				this.levelFinished = true;
				this.completeLevel();
			}
		}

		if (this.spawnMeiga && this.e.isDown) {
			this.openMeigaMenu()
		}

	}

	initMap() {
		const mapa = this.map = this.make.tilemap({
			key: 'sala1'
		});
		const tiles = mapa.addTilesetImage('Forest', 'tiles');
		this.groundLayer = this.map.createLayer('Suelo', tiles);
		this.foregroundLayer = this.map.createLayer('Bordes', tiles);
		this.puertaSolida = this.physics.add.image(576, 16, 'puertaSala1');
		this.puerta = this.map.createLayer('Puerta2', tiles);
		this.objetos = this.map.createLayer('Objetos', tiles);
		this.borderTrees = this.map.createLayer('bordeArboles', tiles);

		this.foregroundLayer.setCollisionBetween(0, 999);
        this.puertaSolida.setImmovable(true);

		this.physics.add.collider(this.enemyPool._group, this.foregroundLayer);
		this.physics.add.collider(this.player, this.foregroundLayer);
		this.physics.add.collider(this.enemyPool._group, this.puertaSolida);
		this.physics.add.collider(this.player, this.puertaSolida);

		this.physics.add.collider(this.bulletPool._group, this.foregroundLayer, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		this.physics.add.collider(this.bulletPool._group, this.puertaSolida, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		this.puertaSolida.setDepth(3);
		this.player.setDepth(2);
		this.enemyPool._group.setDepth(2);
		this.borderTrees.setDepth(3);
		this.foregroundLayer.setDepth(3);
	}

	initPlayerAndPools(data) {
		
        if(data.hasOwnProperty('gate')){
            this.player = new Character(this, data.gate.x, data.gate.y, null, data.player.getSpeed(), data.player.getHp(), data.player.getMaxHp(), data.player.getWallet(),  data.player.getCadence());
        }else{
            this.player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, null, 150, 4, 4, 0, 400);
        }
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
				delay: 4000,
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

	initLevelFightMode(){
		this.banda.play();
		this.spawnMeiga = false;
		this.initTimers(false);
	}

	initLevelFreeMode(){
		this.explorationSong.play();
		this.abrirPuertas()
		if(this.namescene === 'level4'){
			this.cofre.destroy();
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
		
		const appearEffect = this.sound.add("appearEffect", {
			volume: 0.1
		});
		
		appearEffect.play();

		appearEffect.once('complete', () => {
			this.explorationSong.play();
		});

		this.events.emit('levelComplete');
		this.puerta.setVisible(false);
		this.puertaSolida.destroy();

		// for (let i = 0; i < 5; i++) {
		// 	setTimeout(() => {
		// 		this.cameras.main.flash(500);
		// 	}, i * 600);
		// }
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

		this.spawnMeiga = true;
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

    openMeigaMenu() {
		this.player.stopHorizontal();
		this.player.stopVertical();
		this.scene.pause();
		this.scene.pause('UIScene');

		this.statsGame.initDialog();
		this.scene.wake('stats');
		this.scene.resume('stats');
	}

	setPlayerPosition(x, y, level){
		this.scene.get(level).player.stopHorizontal();
		this.scene.get(level).player.stopVertical();
		this.scene.get(level).player.x = x;
		this.scene.get(level).player.y = y;
	}

	abrirPuertas(){

	}

	allLevelsComplete(){
		return LevelScene.progress.level1 && LevelScene.progress.level2 && LevelScene.progress.level3
				&& LevelScene.progress.level4;
	}

}