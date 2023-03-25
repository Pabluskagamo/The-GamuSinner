import BlackWolf from "../gameobjects/blackWolf"
import Bullet from "../gameobjects/bullet"
import BulletPool from "../gameobjects/Pools/bulletPool"
import EnemyPool from "../gameobjects/Pools/EnemyPool"
import Character from "../gameobjects/character"
import Goblin from "../gameobjects/Goblin"
import Cyclops from "../gameobjects/cyclops"
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
		const mapa = this.map = this.make.tilemap({
			key: 'map'
		});
		const tiles = mapa.addTilesetImage('Forest', 'tiles');
		this.groundLayer = this.map.createLayer('Suelo', tiles);
		this.foregroundLayer = this.map.createLayer('Bordes', tiles);
		this.river = this.map.createLayer('Rio', tiles);
		this.borderRiver = this.map.createLayer('MargenRio', tiles);
		this.objetos = this.map.createLayer('Objetos', tiles);
		this.borderTrees = this.map.createLayer('bordeArboles', tiles);

		this.river.setCollisionBetween(0, 999);
		this.foregroundLayer.setCollisionBetween(0, 999);


		let player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 200);
		this.player = player
		this.player.body.onCollide = true;

		let randX = Phaser.Math.RND.between(0, this.sys.game.canvas.width);
		let randY = Phaser.Math.RND.between(0, this.sys.game.canvas.height);

		randX = Phaser.Math.RND.between(0, this.sys.game.canvas.width);
		randY = Phaser.Math.RND.between(0, this.sys.game.canvas.height);

		randX = Phaser.Math.RND.between(0, this.sys.game.canvas.width);
		randY = Phaser.Math.RND.between(0, this.sys.game.canvas.height);


		let scene = this;

		let bullets = [];
		for (let i = 0; i < 10; i++) {
			bullets.push(new Bullet(this, -100, -100, 300, 20));
		}

		this.bulletPool = new BulletPool(this, bullets, 10)

		this.enemyPool = new EnemyPool(this, 15);

		let enemies = [];

		for (let i = 0; i < 10; i++) {
			enemies.push(new Goblin(this, randX, randY, 80, player, this.enemyPool));
		}

		for (let i = 0; i < 5; i++) {
			enemies.push(new BlackWolf(this, randX, randY, 60, player, this.enemyPool));
		}

		for (let i = 0; i < 3; i++) {
			enemies.push(new Cyclops(this, randX, randY, 45, player, this.enemyPool));
		}

		this.v = this.input.keyboard.addKey('v');

		this.enemyPool.addMultipleEntity(enemies);

		this.physics.add.collider(this.enemyPool._group, this.foregroundLayer);
		this.physics.add.collider(player, this.foregroundLayer);
		this.physics.add.collider(this.enemyPool._group, this.river);
		this.physics.add.collider(player, this.river);

		player.setDepth(2);
		this.enemyPool._group.setDepth(2);
		this.borderTrees.setDepth(3);
		this.foregroundLayer.setDepth(3);

		let poolenemigos = this.enemyPool;

		this.lastSpawned = 0;

		this.physics.add.collider(this.bulletPool._group, this.foregroundLayer, (obj1, obj2) => {

			this.bulletPool.release(obj1);

		});

		this.physics.add.collider(this.bulletPool._group, this.enemyPool._group, (obj1, obj2) => {
			obj1.hit(obj2)
		}, (obj1, obj2) => !obj2.isDead());


		this.physics.add.collider(this.enemyPool._group, this.player, (obj1, obj2) => {
			obj1.attack(obj2);
			this.events.emit('addScore', obj2.getHp());
		});

		// let timer = this.time.addEvent({

		// 	delay: 3000,
		// 	callback: () => { this.spawnInBounds(); },
		// 	callbackScope: this,
		// 	loop: true
		// });

	}


	update(t) {
		if (Phaser.Input.Keyboard.JustUp(this.v)) {
			this.enemyPool.spawn(0, 0)
		}
		if (this.player.getHp() === 0) {
			this.player.dieMe();
			this.player.on('animationcomplete', () => {
				if (this.player.anims.currentAnim.key === 'mainChar_die') {
					this.cameras.main.fadeOut(500);
					this.cameras.main.once("camerafadeoutcomplete", function () {
						this.scene.start('game_over');
					}, this);
				}
			})
		}
	}

	spawnInBounds() {
		const xPos = [0, this.sys.game.canvas.width]
		const yPos = [0, this.sys.game.canvas.height]

		const randX = Phaser.Math.RND.between(0, 1);
		const randY = Phaser.Math.RND.between(0, 1);

		this.enemyPool.spawn(xPos[randX], xPos[randY]);
	}
}
