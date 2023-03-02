import Phaser from 'phaser'

import MainScene from './MainScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 768,
	height: 768,

	scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		mode: Phaser.Scale.FIT,
		min: {
            width: 328,
            height: 328
        },
		max: {
            width: 768,
            height: 768
        },
		zoom: 1
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		},
	},
	scene: [MainScene],
}

export default new Phaser.Game(config)
