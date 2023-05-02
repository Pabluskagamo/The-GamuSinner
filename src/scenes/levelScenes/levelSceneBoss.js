import LevelScene from "../levelScene";
import Character from "../../gameobjects/character";
import BulletPool from "../../gameobjects/Pools/bulletPool";
import PowerUpPool from "../../gameobjects/Pools/powerUpPool";
import EnemyPool from "../../gameobjects/Pools/enemyPool";
import CoinPool from "../../gameobjects/Pools/coinPool";
import FoodPool from "../../gameobjects/Pools/foodPool";
import DemonBoss from "../../gameobjects/enemies/boss/demonBoss";
import BossPool from "../../gameobjects/Pools/bossPool";

export default class LevelSceneBoss extends LevelScene {

	constructor() {
		super('levelBoss')
	}

	create(data) {
		this.isMuted = data.mute;
		super.create({ ...data, bossLevel: true });
		this.initTimers(true);

		this.bossPool.fillPool(500, 30, 40, this.player)
		this.enemyPool.fillPool(25, this.player, this.namescene);
		this.demon = new DemonBoss(this, this.game.canvas.width / 2.07, this.game.canvas.height / 3.1, 60, this.player, this.bossPool, this.enemyPool)
		this.demon.body.pushable = false;
		this.player.body.pushable = false;
		this.demon.setDepth(3);

		this.physics.add.collider(this.bulletPool._group, this.demon, (obj1, obj2) => {
			obj1.hit(obj2)
		}, (obj1, obj2) => !obj2.isDead());

		this.physics.add.overlap(this.demon, this.player, (obj1, obj2) => {
			obj1.attack(obj2);
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.isDead() && !obj2.getDash()
		);

		this.physics.add.overlap(this.demon, this.player, (obj1, obj2) => {
			obj2.getHit(1)
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => obj1.getonSpecialAbility()
		);


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
		}, (obj1, obj2) => !obj2.isDead() && !obj2.getDash() && !obj2.isInvicible()
		);

		this.physics.add.collider(this.bossPool._bossEnemiesGroup, this.player, (obj1, obj2) => {
			obj1.attack(obj2);
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.isDead() && !obj2.getDash() && !obj2.isInvicible()
		);

		this.physics.add.collider(this.bulletPool._group, this.bossPool._bossEnemiesGroup, (obj1, obj2) => {
			obj1.hit(obj2)
		}, (obj1, obj2) => !obj2.isDead()
		);

		this.physics.add.collider(this.bossPool._bossBulletGroup, this.player, (obj1, obj2) => {
			obj1.hit(obj2)
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.isDead() && !obj2.getDash() && !obj2.isInvicible()
		);

		this.physics.add.overlap(this.bossPool._bossExplosionGroup, this.player, (obj1, obj2) => {
			obj1.hit(obj2)
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.isDead() && !obj2.getDash() && !obj2.isInvicible()
		);

	}

	initMap() {
		const mapa = this.map = this.make.tilemap({
			key: 'salaBoss'
		});

		//Tile Images
		const tilesSuelo = mapa.addTilesetImage('suelo', 'tilesBossSuelo');
		const tilesCastleProps = mapa.addTilesetImage('Runas', 'tilesCastleProps')
		const tilesParedes = mapa.addTilesetImage('paredes', 'tilesBossPared')
		const tilesBricks = mapa.addTilesetImage('ladrillos', 'tilesBossBricks')
		const tilesPentagram = mapa.addTilesetImage('pentagram', 'tilesBossPentagram')
		const tilesBloodFoutain = mapa.addTilesetImage('bloodfountain', 'tilesBossBloodFountain')


		this.groundLayer = this.map.createLayer('Suelo', [tilesSuelo, tilesParedes]);
		this.foregroundLayer = this.map.createLayer('Bordes', [tilesParedes, tilesBricks]);
		this.decoracion = this.map.createLayer('Decoracion', [tilesParedes, tilesBloodFoutain, tilesCastleProps, tilesBricks]);
		this.estatuas = this.map.createLayer('Estatuas', tilesParedes);
		this.bordeEstatuas = this.map.createLayer('BordeEstatuas', tilesParedes);
		this.pentagram = this.map.createLayer('Pentagrams', tilesPentagram);

		//Colisiones
		this.foregroundLayer.setCollisionBetween(0, 999);
		this.estatuas.setCollisionBetween(0, 999);

		this.physics.add.collider(this.enemyPool._group, this.foregroundLayer);
		this.physics.add.collider(this.player, this.foregroundLayer);

		this.physics.add.collider(this.player, this.estatuas);

		this.physics.add.collider(this.bulletPool._group, this.foregroundLayer, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		this.physics.add.collider(this.bulletPool._group, this.estatuas, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		this.physics.add.collider(this.bossPool._bossBulletGroup, this.foregroundLayer, (obj1, obj2) => {
			obj1.release()
		});

		this.physics.add.collider(this.bossPool._bossBulletGroup, this.estatuas, (obj1, obj2) => {
			obj1.release()
		});


		this.player.setDepth(2)
		this.bordeEstatuas.setDepth(2)

	}

	initPlayerAndPools(data) {
		console.log("LLEGO AQUI")

		if (data.hasOwnProperty('gate')) {
			this.player = new Character(this, data.gate.x, data.gate.y, null, data.player.getSpeed(), data.player.getHp(), data.player.getMaxHp(), data.player.getWallet(), data.player.getCadence());
		} else {
			this.player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, null, 150, 4, 4, 0, 400);
		}
		this.player.body.onCollide = true;

		this.bossPool = new BossPool(this, 200, 30, 1)
		this.bulletPool = new BulletPool(this, 150, 20)
		this.powerUpPool = new PowerUpPool(this, 6)
		this.enemyPool = new EnemyPool(this, 15);
		this.coinPool = new CoinPool(this, 20);
		this.foodPool = new FoodPool(this, 20);
	}

	// initMap() {
	// 	super.initMap()
	// 	this.physics.add.collider(this.bossPool._bossEnemiesGroup, this.foregroundLayer);
	// 	this.physics.add.collider(this.bossPool._bossEnemiesGroup, this.puertaSolida);
	// 	this.physics.add.collider(this.bossPool._bossBulletGroup, this.foregroundLayer, (obj1, obj2) => {
	// 		obj1.release()
	// 	});

	// 	this.physics.add.collider(this.bossPool._bossBulletGroup, this.puertaSolida, (obj1, obj2) => {
	// 		obj1.release()
	// 	});
	// }

	update(t) {

		if (this.debugMode && !this.levelFinished && Phaser.Input.Keyboard.JustUp(this.k)) {
			this.demon.hp = 100;
			this.events.emit("bossHit", this.demon.startHp - 100);
			console.log("LLEGAMOS A REVENTAR BOSS")
			// this.completeLevel()
		}
	}

	initTimers(debug) {
		if (debug) {
			this.k = this.input.keyboard.addKey('K');
			this.debugMode = true;
		}
	}

	setMusic() {
		this.banda = this.sound.add("bossSong", {
			volume: 0.1,
			loop: true
		});
	}

	addMeiga() {

		this.spawnMeiga = true;
		this.meiga = this.add.sprite(500, 350, 'meiga').setScale(1.6);
		this.anims.create({
			key: 'meigaState',
			frames: this.anims.generateFrameNumbers('meiga', { start: 0, end: 3 }),
			frameRate: 3,
			repeat: -1,
		});

		this.anims.create({
			key: 'meiga_magic',
			frames: this.anims.generateFrameNumbers('meiga', { start: 20, end: 27 }),
			frameRate: 10,
			repeat: -1,
		});

		this.meiga.play('meiga_magic');
	}

	completeLevel() {
		console.log("NIVEL COMPLETADO")
		this.levelFinished = true
		this.input.keyboard.enabled = false;
		this.player.stopHorizontal();
		this.player.stopVertical();

		this.sound.removeByKey('bossSongSecondFase');

		this.time.addEvent({
			delay: 5000,
			callback: () => {
				this.cameras.main.fadeOut(500);
				this.cameras.main.once("camerafadeoutcomplete", function () {
					this.scene.stop('UIScene')
					this.scene.start('credits_scene', { level: this.namescene, mute: this.isMuted });
				}, this);
			},
			callbackScope: this,
			loop: false
		})
	}

	initLevelFreeMode() {
		this.addMeiga()
		this.input.keyboard.enabled = false;
		if (!this.isMuted) {
			this.enterDungeonMusic = this.sound.add("dungeonEnterSong", {
				volume: 0.4,
				loop: true
			});
			this.enterDungeonMusic.play()
		}


		this.time.addEvent({
			delay: 5000,
			callback: () => {
				if (!this.isMuted) {
					this.setMusic();
					this.banda.play();
				}
				this.demon.transform();
				this.meiga.setVisible(false)
				this.spawnMeiga = false;
				if (!this.isMuted) {
					this.enterDungeonMusic.stop()
				}
				this.input.keyboard.enabled = true;
			},
			callbackScope: this,
			loop: false
		})
	}

	endFirstFase() {
		if(!this.isMuted){
			this.banda.stop();
		}
	}

	setSecondFase() {
		if(!this.isMuted){
			this.banda = this.sound.add("bossSongSecondFase", {
				volume: 0.1,
				loop: true
			});
	
			this.banda.play();
		}
	}

}