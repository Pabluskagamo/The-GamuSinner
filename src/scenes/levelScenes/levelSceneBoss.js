import LevelScene from "../levelScene";
import Character from "../../gameobjects/character";
import BulletPool from "../../gameobjects/Pools/bulletPool";
import PowerUpPool from "../../gameobjects/Pools/powerUpPool";
import EnemyPool from "../../gameobjects/Pools/enemyPool";
import CoinPool from "../../gameobjects/Pools/coinPool";
import FoodPool from "../../gameobjects/Pools/foodPool";
import DemonBoss from "../../gameobjects/enemies/boss/demonBoss";
import Slime from "../../gameobjects/enemies/slime";
import JellyfishPet from "../../gameobjects/powerUps/jellyfishPet";
import BossPool from "../../gameobjects/Pools/bossPool";

export default class LevelSceneBoss extends LevelScene {

    constructor() {
		super('levelBoss')
	}

	create(data){
		this.isMuted = data.mute;
        super.create({...data, bossLevel: true});

		this.bossPool.fillPool(500, 30, 40, this.player)
        this.demon = new DemonBoss(this, this.game.canvas.width/2.07, this.game.canvas.height/3.1, 60, this.player, this.bossPool, this.enemyPool)
		this.demon.body.pushable = false;
		this.player.body.pushable = false;
		this.demon.setDepth(3);
		
		/* 
        this.jelly = new JellyfishPet(this, this.player.x,this.player.y)
		this.player.setPet(this.jelly) */

		// if(this.scene.isActive('UIScene')){
		// 	this.scene.stop('UIScene');			
		// }

		// console.log("LAUNCH HUD", this.player.getMaxHp(), this.player.getHp())
		// this.scene.launch('UIScene', {playerData: this.player.getPlayerStats(), level: this.namescene});

		/* this.physics.add.collider(this.demon, this.foregroundLayer);
		this.physics.add.collider(this.demon, this.puertaSolida); */

		this.physics.add.collider(this.bulletPool._group, this.demon, (obj1, obj2) => {
            obj1.hit(obj2)
        }, (obj1, obj2) => !obj2.isDead());

		this.physics.add.overlap(this.demon, this.player, (obj1, obj2) => {
				obj1.attack(obj2);
				this.events.emit('addScore', obj2.getHp());
			}, (obj1, obj2) => !obj2.isDead() && !obj2.getDash()
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

		this.physics.add.overlap(this.bossPool._bossExplosionGroup, this.player,(obj1, obj2) => {
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


		this.player.setDepth(2)
		this.bordeEstatuas.setDepth(2)
	
	}

    initPlayerAndPools(data) {
		console.log("LLEGO AQUI")
		
        if (data.hasOwnProperty('gate')) {
            this.player = new Character(this, data.gate.x, data.gate.y, null, data.player.getSpeed(), data.player.getHp(), data.player.getMaxHp(), data.player.getWallet(),  data.player.getCadence());
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

		this.enemyPool.fillPool(25, this.player, this.namescene);
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

	initTimers(debug) {
		this.v = this.input.keyboard.addKey('v');
		this.debugMode = true;
	}

	setMusic(){
		this.banda = this.sound.add("bossSong", {
			volume: 0.1,
			loop: true
		});
	}

}