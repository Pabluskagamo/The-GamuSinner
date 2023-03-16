import Phaser from 'phaser'

import MainScene from './MainScene'
import LevelScene from './levelScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 1176,
	height: 672,

	scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		mode: Phaser.Scale.FIT,
		min: {
            width: 784,
            height: 448
        },
		max: {
            width: 1568,
            height: 896
        },
		zoom: 1
	},
	physics: {
		default: 'arcade',
		arcade: {
			//gravity: { y: 200 },
			debug : true
		},
	},
	scene: [MainScene, LevelScene],
}

export default new Phaser.Game(config)
