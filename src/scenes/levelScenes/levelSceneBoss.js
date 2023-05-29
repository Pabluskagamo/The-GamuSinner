import LevelScene from "../levelScene";
import Character from "../../gameobjects/character";
import BulletPool from "../../gameobjects/Pools/bulletPool";
import PowerUpPool from "../../gameobjects/Pools/powerUpPool";
import EnemyPool from "../../gameobjects/Pools/enemyPool";
import CoinPool from "../../gameobjects/Pools/coinPool";
import FoodPool from "../../gameobjects/Pools/foodPool";
import DemonBoss from "../../gameobjects/enemies/boss/demonBoss";
import BossPool from "../../gameobjects/Pools/bossPool";
import TripleShot from "../../gameobjects/powerUps/tripleShot"
import EightDirShot from "../../gameobjects/powerUps/eightDirShot"
import BouncingShot from "../../gameobjects/powerUps/bouncingShot"
import FreezingShot from "../../gameobjects/powerUps/freezingShot"
import PetBot from "../../gameobjects/powerUps/petBot"
import JellyfishPet from "../../gameobjects/powerUps/jellyfishPet"

// ESCENA DEL BOSS FINAL DE GALICIA

export default class LevelSceneBoss extends LevelScene {

	constructor() {
		super('levelBoss')
	}

	create(data) {
		// AÑADE LA MUSICA DEL BOSS
		this.isMuted = data.mute;
		super.create({ ...data, bossLevel: true });
		this.initTimers(true);

		// INICIALIZA LAS POOLS DEL BOSS
		this.bossPool.fillPool(500, 30, 40, this.player)
		this.enemyPool.fillPool(25, this.player, this.namescene);

		// DIBUJA AL BOSS FINAL
		this.demon = new DemonBoss(this, this.game.canvas.width / 2.07, this.game.canvas.height / 3.1, 60, this.player, this.bossPool, this.enemyPool)
		this.demon.body.pushable = false;
		this.player.body.pushable = false;
		this.demon.setDepth(3);

		// AÑADE COLISIONES
		this.physics.add.collider(this.bulletPool._group, this.demon, (obj1, obj2) => {
			obj1.hit(obj2)
		}, (obj1, obj2) => !obj2.isDead());

		// AÑADE EL RECIBIMIENTO DE DAÑO POR PARTE DE BOSS
		this.physics.add.overlap(this.demon, this.player, (obj1, obj2) => {
			obj1.attack(obj2);
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.isDead() && !obj2.getDash()
		);

		// GOLPEA EL BOSS AL PERSONAJE
		this.physics.add.overlap(this.demon, this.player, (obj1, obj2) => {
			obj2.getHit(1)
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => obj1.getonSpecialAbility()
		);

		// GOLPEA LA BALA AL BOSS
		this.physics.add.collider(this.bulletPool._group, this.enemyPool._group, (obj1, obj2) => {
			obj1.hit(obj2)
		}, (obj1, obj2) => !obj2.isDead());

		// RECOGE LAS MONEDAS
		this.physics.add.overlap(this.coinPool._group, this.player, (obj1, obj2) => {
			obj1.collect(obj2);
			this.events.emit('earnCoin', obj2.getWallet());
		});

		// RECOGE EL POWER-UP
		this.physics.add.overlap(this.powerUpPool._group, this.player, (obj1, obj2) => {
			obj2.collectPowerUp(obj1);
		}, (obj1, obj2) => !obj1.isEnabled());

		// RECOGE LOS MUSLITOS PARA RECUPERAR VIDA
		this.physics.add.overlap(this.foodPool._group, this.player, (obj1, obj2) => {
			obj1.collect(obj2);
			this.events.emit('addScore', obj2.getHp());
		});

		// LOS ESBIRROS ATACAN AL PERSONAJE
		this.physics.add.collider(this.enemyPool._group, this.player, (obj1, obj2) => {
			obj1.attack(obj2);
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.isDead() && !obj2.getDash() && !obj2.isInvicible()
		);

		// LOS ESBIRROS DEL BOSS ATACAN AL PERSONAJE
		this.physics.add.collider(this.bossPool._bossEnemiesGroup, this.player, (obj1, obj2) => {
			obj1.attack(obj2);
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.isDead() && !obj2.getDash() && !obj2.isInvicible()
		);

		// LOS ESBIRROS DEL BOSS RECIBEN DAÑO
		this.physics.add.collider(this.bulletPool._group, this.bossPool._bossEnemiesGroup, (obj1, obj2) => {
			obj1.hit(obj2)
		}, (obj1, obj2) => !obj2.isDead()
		);

		// LAS BALAS DEL BOSS IMPACTAN EN EL PERSONAJE
		this.physics.add.collider(this.bossPool._bossBulletGroup, this.player, (obj1, obj2) => {
			obj1.hit(obj2)
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.isDead() && !obj2.getDash() && !obj2.isInvicible()
		);

		// LAS EXPLOSIONES DEL BOSS IMPACTAN EN EL PERSONAJE
		this.physics.add.overlap(this.bossPool._bossExplosionGroup, this.player, (obj1, obj2) => {
			obj1.hit(obj2)
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.isDead() && !obj2.getDash() && !obj2.isInvicible()
		);

	}

	// INICIALIZA EL TILEMAP CORRESPONDIENTE AL BOSS FINAL
	initMap() {
		const mapa = this.map = this.make.tilemap({
			key: 'salaBoss'
		});

		// TILE IMAGES
		const tilesSuelo = mapa.addTilesetImage('suelo', 'tilesBossSuelo');
		const tilesCastleProps = mapa.addTilesetImage('Runas', 'tilesCastleProps')
		const tilesParedes = mapa.addTilesetImage('paredes', 'tilesBossPared')
		const tilesBricks = mapa.addTilesetImage('ladrillos', 'tilesBossBricks')
		const tilesPentagram = mapa.addTilesetImage('pentagram', 'tilesBossPentagram')
		const tilesBloodFoutain = mapa.addTilesetImage('bloodfountain', 'tilesBossBloodFountain')

		// TILE LAYERS
		this.groundLayer = this.map.createLayer('Suelo', [tilesSuelo, tilesParedes]);
		this.foregroundLayer = this.map.createLayer('Bordes', [tilesParedes, tilesBricks]);
		this.decoracion = this.map.createLayer('Decoracion', [tilesParedes, tilesBloodFoutain, tilesCastleProps, tilesBricks]);
		this.estatuas = this.map.createLayer('Estatuas', tilesParedes);
		this.bordeEstatuas = this.map.createLayer('BordeEstatuas', tilesParedes);
		this.pentagram = this.map.createLayer('Pentagrams', tilesPentagram);

		// COLISIONES
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

		// PROFUNDIDAD
		this.player.setDepth(2)
		this.bordeEstatuas.setDepth(2)

	}

	// INICIALIZACION DE LAS POOLS ESPECIFICAS PARA EL BOSS
	initPlayerAndPools(data) {

		if (data.hasOwnProperty('gate')) {
			let powerUp = null;
			if(data.player.inventory !== null){
				if(data.player.inventory.getKey() === "bouncingShot"){
					powerUp = new BouncingShot(this, -125, -125);
				}else if(data.player.inventory.getKey() === "eightDirShot"){
					powerUp = new EightDirShot(this, -125, -125);
				}else if(data.player.inventory.getKey() === "petpower"){
					powerUp = new PetBot(this, -125, -125, new JellyfishPet(this, -125, -125));
				}else if(data.player.inventory.getKey() === "multipleDirfreezingShotectionShot"){
					powerUp = new FreezingShot(this, -125, -125);
				}else if(data.player.inventory.getKey() === "tripleShot"){
					powerUp = new TripleShot(this, -125, -125);
				}
			}
			this.player = new Character(this, data.gate.x, data.gate.y, null, data.player.getSpeed(), data.player.getHp(), data.player.getMaxHp(), data.player.getWallet(), data.player.getCadence(), data.player.getBulletDmg(), powerUp);
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

	update(t) {
		// COMPRUEBA QUE SE VAYA REALIZANDO DAÑO AL BOSS
		if (this.debugMode && !this.levelFinished && Phaser.Input.Keyboard.JustUp(this.k)) {
			this.demon.hp = 100;
			this.events.emit("bossHit", this.demon.startHp - 100);
			console.log("LLEGAMOS A REVENTAR BOSS")
			// this.completeLevel()
		}
	}

	// SALTA LA BATALLA FINAL CON LA TECLA K
	initTimers(debug) {
		if (debug) {
			this.k = this.input.keyboard.addKey('K');
			this.debugMode = true;
		}
	}

	// ESTABLECE LA MUSICA
	setMusic() {
		this.banda = this.sound.add("bossSong", {
			volume: 0.1,
			loop: true
		});
	}

	// AÑADE LA MEIGA DE LA ANIMACION
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

	// FUNCION PARA CUANDO SE ACABA EL NIVEL Y LLEVAR A LOS CREDITOS
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

	// FUNCION PARA CUANDO ESTA EN MODO EXPLORACION EN LA SALA DEL BOSS (CUANDO ESTA LA ANIMACION)
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
			delay: 8000,
			callback: () => {
				this.setMusic();
				if (!this.isMuted) {
					this.banda.play();
				}
				this.demon.transform();
				this.meiga.setVisible(false)
				this.spawnMeiga = false;
				if (!this.isMuted) {
					this.sound.removeByKey('dungeonEnterSong');
				}
				this.input.keyboard.enabled = true;
			},
			callbackScope: this,
			loop: false
		})
	}

	// FUNCION PARA ACTUALIZAR LA MUSICA CUANDO SE ACABA LA PRIMERA FASE
	endFirstFase() {
		if(!this.isMuted){
			this.sound.removeByKey('bossSong');
		}
	}

	// FUNCION PARA ACTUALIZAR LA MUSICACUANDO EMPIEZA LA SEGUNDA FASE
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