import Phaser from 'phaser'

import MainScene from './scenes/MainScene'
import InstructionScene from './scenes/instructionScene'
import LevelScene from './scenes/levelScene'
import Hud from './ui/hud'
import GameOverScene from './scenes/GameOverScene'

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
			debug: true
		},
	},
<<<<<<< HEAD
	scene: [/*MainScene,*/InstructionScene, LevelScene, Hud],
=======
	scene: [/*MainScene,InstructionScene,*/ LevelScene, Hud, GameOverScene],
>>>>>>> 2ea56cc7700afef5295895833cbc3d5dc15ea7aa
}

export default new Phaser.Game(config)
