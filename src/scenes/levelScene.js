import BlackWolf from "../gameobjects/blackWolf"
import Bullet from "../gameobjects/bullet"
import BulletPool from "../gameobjects/Pools/bulletPool"
import EnemyPool from "../gameobjects/Pools/EnemyPool"
import Character from "../gameobjects/character"
import Goblin from "../gameobjects/Goblin"
import Cyclops from "../gameobjects/cyclops"
import HealthPoint from "../ui/healthpoint"
import EasyStar from 'easystarjs'

export default class LevelScene extends Phaser.Scene {
	constructor() {
		super('level')
	}

	init() {
		this.cameras.main.fadeIn(500);
	}

	preload() {
		this.load.image('level_background', '/img/top-down-forest.png')
		this.load.spritesheet('character', '/assets/character.png', { frameWidth: 64, frameHeight: 32 })
		this.load.spritesheet('blackWolf', '/assets/blackWolf.png', { frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('cyclops', '/assets/cyclops.png', { frameWidth: 64, frameHeight: 64.1 })
		//this.load.spritesheet('goblin', '/assets/goblins.png', { frameWidth: 48, frameHeight: 48 })
		this.load.spritesheet('goblin', '/assets/redGoblin.png', { frameWidth: 32, frameHeight: 32.1 })
		this.load.spritesheet('muerte', '/assets/explosion.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('bullet', '/assets/bullets.png', { frameWidth: 16, frameHeight: 16 })
		this.load.spritesheet('healthbar', '/assets/Hearts/PNG/animated/border/heart_animated_2.png', { frameWidth: 17, frameHeight: 17 })
		this.load.image('tiles', '/assets/tileset/forest_tiles.png')
		this.load.tilemapTiledJSON('map', '/assets/tilemap/mapa.json')
	}

	create() {
		this.initPlayerAndPools();
		this.initMap();
		this.bulletPool.fillPull(10);
		this.initTimers(true);
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
		const tiles = this.tiles = mapa.addTilesetImage('Forest', 'tiles');
		this.groundLayer = this.map.createLayer('Suelo', tiles);
		this.foregroundLayer = this.map.createLayer('Bordes', tiles);
		this.river = this.map.createLayer('Rio', tiles);
		this.borderRiver = this.map.createLayer('MargenRio', tiles);
		this.objetos = this.map.createLayer('Objetos', tiles);
		this.borderTrees = this.map.createLayer('bordeArboles', tiles);

		this.river.setCollisionBetween(0, 999);
		this.foregroundLayer.setCollisionBetween(0, 999);

		this.physics.add.collider(this.enemyPool._group, this.foregroundLayer);
		this.physics.add.collider(this.player, this.foregroundLayer);
		this.physics.add.collider(this.enemyPool._group, this.river);
		this.physics.add.collider(this.player, this.river);

		this.physics.add.collider(this.bulletPool._group, this.foregroundLayer, (obj1, obj2) => {
			this.bulletPool.release(obj1);
		});

		this.player.setDepth(2);
		this.enemyPool._group.setDepth(2);
		this.borderTrees.setDepth(3);
		this.foregroundLayer.setDepth(3);

		this.initFinder();

	}

	initPlayerAndPools(){
		this.player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 200);
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
			this.scene.remove('UIScene');
		}, this);
	}

	initFinder(){
		this.finder = new EasyStar.js();

		var grid = [];
		for(var y = 0; y < this.map.height; y++){
			var col = [];
			for(var x = 0; x < this.map.width; x++){
				// In each cell we store the ID of the tile, which corresponds
				// to its index in the tileset of the map ("ID" field in Tiled)
				col.push(this.getTileID(x,y));
			}
			grid.push(col);
		}
		this.finder.setGrid(grid);

		console.log(grid);

		var tileset = this.map.tilesets[0];
		var properties = tileset.tileProperties;

		console.log('Propierties', properties);

		var acceptableTiles = [];

		for(var i = tileset.firstgid-1; i < this.tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
			if(!properties.hasOwnProperty(i)) {
				// If there is no property indicated at all, it means it's a walkable tile
				acceptableTiles.push(i+1);
				continue;
			}
			if(!properties[i].collide) acceptableTiles.push(i+1);
			if(properties[i].cost) this.finder.setTileCost(i+1, properties[i].cost); // If there is a cost attached to the tile, let's register it
		}

		console.log('Acceptable', acceptableTiles);

		this.finder.setAcceptableTiles(acceptableTiles);
	}

	calculatePath(){
		var toX = 10;
		var toY = 11;
		var fromX = 0;
		var fromY = 0;
		console.log('going from ('+fromX+','+fromY+') to ('+toX+','+toY+')');

		this.finder.findPath(fromX, fromY, toX, toY, function( path ) {
			if (path === null) {
				console.warn("Path was not found.");
			} else {
				console.log(path);
			}
		});

		this.finder.calculate();
	}

	getTileID(x,y){
		
		var tile = this.map.getTileAt(x, y, true);
    	return tile.index;
	}
}