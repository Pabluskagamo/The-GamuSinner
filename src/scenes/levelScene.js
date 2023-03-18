import BlackWolf from "../gameobjects/blackWolf"
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
	}

	create() {
		this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 'level_background').setScale(2);
		this.player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 200);

		let randX = Phaser.Math.RND.between(0, this.sys.game.canvas.width);
		let randY = Phaser.Math.RND.between(0, this.sys.game.canvas.height);

		console.log(randX, randY);

		this.wolf = new BlackWolf(this, randX, randY, 200);

		randX = Phaser.Math.RND.between(0, this.sys.game.canvas.width);
		randY = Phaser.Math.RND.between(0, this.sys.game.canvas.height);

		this.gob = new Goblin(this, randX, randY, 250);
		this.physics.add.collider(this.player, this.wolf);
		this.physics.add.collider(this.player, this.gob);
	}
}
