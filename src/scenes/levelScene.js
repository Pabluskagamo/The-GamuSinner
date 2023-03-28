import BulletPool from "../gameobjects/Pools/bulletPool"
import EnemyPool from "../gameobjects/Pools/EnemyPool"
import Character from "../gameobjects/character"
import HealthPoint from "../ui/healthpoint"

export default class LevelScene extends Phaser.Scene {
	constructor() {
		super('level')
	}

	init() {
		this.cameras.main.fadeIn(500);
	}

	preload() {
		this.load.image('level_background', '/img/top-down-forest.png')
		this.load.spritesheet('character', '/assets/character/character.png', { frameWidth: 64, frameHeight: 32 })
		this.load.spritesheet('character_shot', '/assets/character/character_shooting.png', { frameWidth: 64, frameHeight: 32 })
		this.load.spritesheet('blackWolf', '/assets/enemies/blackWolf.png', { frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('cyclops', '/assets/enemies/cyclops.png', { frameWidth: 64, frameHeight: 64.1 })
		this.load.spritesheet('goblin', '/assets/enemies/redGoblin.png', { frameWidth: 32, frameHeight: 32.1 })
		this.load.spritesheet('muerte', '/assets/effects/explosion.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('bullet', '/assets/bullets/bullets.png', { frameWidth: 16, frameHeight: 16 })
		this.load.image('tiles', '/assets/tileset/forest_tiles.png')
		this.load.tilemapTiledJSON('map', '/assets/tilemap/mapa_sinrio.json')
	}

	create() {
		this.initPlayerAndPools();
		this.initMap();
		this.bulletPool.fillPull(10);
		this.initTimers(false);
		this.scene.launch('UIScene');
	}


	update(t) {
		if (this.debugMode && Phaser.Input.Keyboard.JustUp(this.v)) {
			this.enemyPool.spawn(0, 0)
		}
	}

	initMap(){
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

	initPlayerAndPools(){
		this.player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 150);
		this.player.body.onCollide = true;


		this.bulletPool = new BulletPool(this, 10)
		this.enemyPool = new EnemyPool(this, 15);


		this.enemyPool.fillPull(25, this.player);

		this.physics.add.collider(this.bulletPool._group, this.enemyPool._group, (obj1, obj2) => {
			obj1.hit(obj2)
		}, (obj1, obj2) => !obj2.isDead());


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

	initTimers(debug){
		if(debug){
			this.v = this.input.keyboard.addKey('v');
			this.debugMode = true;
		}else{
			let timer = this.time.addEvent({

				delay: 4000,
				callback: () => { this.spawnInBounds(); },
				callbackScope: this,
				loop: true
			});


			let timer2 = this.time.addEvent({

				delay: 20000,
				callback: () => { 
					const currDelay = timer.delay;
					console.log('cambio de frecuencia de', currDelay, 'a', currDelay-500)
					if(currDelay > 1000){
						timer.reset({
							delay: currDelay-500,
							callback: () => { this.spawnInBounds(); },
							callbackScope: this,
							loop: true
						})
					} 
				},
				callbackScope: this,
				loop: true
			});
		}
	}

	gameOver(){
		this.cameras.main.fadeOut(500);
		this.cameras.main.once("camerafadeoutcomplete", function () {
			this.scene.start('game_over');
			this.scene.sleep('UIScene');
		}, this);
	}
}