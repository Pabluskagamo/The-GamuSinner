import Character from "./gameobjects/character"

export default class LevelScene extends Phaser.Scene {
	constructor() {
		super('level')
        console.log('jkdas')
	}

	preload() {
		this.load.image('level_background', '/img/top-down-forest.png')
        this.load.spritesheet('character', '/assets/charac.png', {frameWidth: 64, frameHeight: 64})
	}

	create() {
		this.add.image(this.sys.game.canvas.width/2, this.sys.game.canvas.height/2, 'level_background').setScale(2);
        new Character(this, this.sys.game.canvas.width/2, this.sys.game.canvas.height/2, 20);
    }
}
