import BlackWolf from "../gameobjects/blackWolf"
import Bullet from "../gameobjects/bullet"
import BulletPool from "../gameobjects/bulletPool"
import Character from "../gameobjects/character"
import Goblin from "../gameobjects/Goblin"
import Cyclops from "../gameobjects/cyclops"
import HealthPoint from "../ui/healthpoint"

export default class LevelScene extends Phaser.Scene {
	constructor() {
		super('level')
	}

	preload() {
		this.load.image('level_background', '/img/top-down-forest.png')
		this.load.spritesheet('character', '/assets/charac.png', { frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('blackWolf', '/assets/blackWolf.png', { frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('cyclops', '/assets/cyclops.png', { frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('goblin', '/assets/goblins.png', { frameWidth: 48, frameHeight: 48 })
		this.load.spritesheet('muerte', '/assets/explosion.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('bullet', '/assets/bullets.png', { frameWidth: 16, frameHeight: 16 })
		this.load.spritesheet('healthbar', '/assets/Hearts/PNG/animated/border/heart_animated_2.png', { frameWidth: 17, frameHeight: 17 })
		this.load.image('tiles', '/assets/tileset/forest_tiles.png')
		this.load.tilemapTiledJSON('map', '/assets/tilemap/mapa.json')
	}

	create() {
		const mapa = this.map = this.make.tilemap({
			key: 'map'
		});
	
		const tiles = mapa.addTilesetImage('Forest', 'tiles');
		this.groundLayer = this.map.createLayer('Suelo', tiles);
		this.objetos = this.map.createLayer('Objetos', tiles);
        this.foregroundLayer = this.map.createLayer('Bordes', tiles);

		// this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 'level_background').setScale(2);

		let player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 200);
		this.player = player
		//player.body.onCollide = true;

		this.enemies = this.physics.add.group({ collideWorldBounds: true });

		let randX = Phaser.Math.RND.between(0, this.sys.game.canvas.width);
		let randY = Phaser.Math.RND.between(0, this.sys.game.canvas.height);

		this.wolf = new BlackWolf(this, randX, randY, 60, player);
		this.enemies.add(this.wolf);

		randX = Phaser.Math.RND.between(0, this.sys.game.canvas.width);
		randY = Phaser.Math.RND.between(0, this.sys.game.canvas.height);

		this.cyclops = new Cyclops(this, randX, randY, 45, player);
		this.enemies.add(this.cyclops);

		randX = Phaser.Math.RND.between(0, this.sys.game.canvas.width);
		randY = Phaser.Math.RND.between(0, this.sys.game.canvas.height);

		this.gob = new Goblin(this, randX, randY, 80, player);
		this.enemies.add(this.gob);

		let scene = this;

		let bullets = [];
		for (let i = 0; i < 10; i++) {
			bullets.push(new Bullet(this, 0, 0, 300, 20));
		}

		this.bulletPool = new BulletPool(this, bullets, 10)

		this.uiLive = [new HealthPoint(this, 830, 50), new HealthPoint(this, 860, 50),
		new HealthPoint(this, 890, 50), new HealthPoint(this, 920, 50), new HealthPoint(this, 950, 50)]

		this.physics.add.collider(this.bulletPool._group, this.enemies, (obj1, obj2) => {
			obj1.hit(obj2)
		},(obj1, obj2) => !obj2.isDead());


		this.physics.add.collider(this.enemies, player, (obj1, obj2) => {
			console.log('COl')
			//obj2.attack(obj1);
		});
		
	}


	update() {
		this.updateHealthUi(this.player.hp)
	}


	updateHealthUi(hp) {
		//setscrollfactor(0, 0) para que cuando se 
		//mueva la camara no se mueva el HUD


		for (let i = 1; i <= 5; i++) {
			if (i <= hp) {
				this.uiLive[i - 1].full()
			} else {
				this.uiLive[i - 1].empty()
			}
		}
	}

}
