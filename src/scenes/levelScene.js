import BlackWolf from "../gameobjects/blackWolf"
import Bullet from "../gameobjects/bullet"
import BulletPool from "../gameobjects/bulletPool"
import Character from "../gameobjects/character"
import Goblin from "../gameobjects/Goblin"

export default class LevelScene extends Phaser.Scene {
	constructor() {
		super('level')
	}

	preload() {
		this.load.image('level_background', '/img/top-down-forest.png')
		this.load.spritesheet('character', '/assets/charac.png', { frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('blackWolf', '/assets/blackWolf.png', { frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('goblin', '/assets/goblins.png', { frameWidth: 48, frameHeight: 48 })
		this.load.spritesheet('muerte', '/assets/explosion.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('bullet', '/assets/bullets.png', { frameWidth: 16, frameHeight: 16 })
	}

	create() {
		this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 'level_background').setScale(2);
		let player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 200);
		player.body.onCollide = true;

		let enemies = this.physics.add.group({collideWorldBounds: true });

		let randX = Phaser.Math.RND.between(0, this.sys.game.canvas.width);
		let randY = Phaser.Math.RND.between(0, this.sys.game.canvas.height);

		//this.wolf = new BlackWolf(this, randX, randY, 100, player);
		//enemies.add(this.wolf);

		randX = Phaser.Math.RND.between(0, this.sys.game.canvas.width);
		randY = Phaser.Math.RND.between(0, this.sys.game.canvas.height);

		//this.gob = new Goblin(this, randX, randY, 120, player);
		//enemies.add(this.gob);
		this.physics.add.collider(player, enemies);

		let scene = this;

		let bullets = [];
		for (let i = 0; i < 100; i++) {
			bullets.push(new Bullet(this, 0,0, 300));
		}

		this.bulletPool = new BulletPool(this, bullets)


		this.physics.world.on('collide', function(gameObject1, gameObject2, body1, body2) {

			if(bullets.includes(gameObject1) && enemies.contains(gameObject2)){
				gameObject2.dieMe();	
			}
		});
	}
}
