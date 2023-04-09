import Phaser from 'phaser'

import MainScene from './scenes/MainScene'
import InstructionScene from './scenes/instructionScene'
import selecScene from './scenes/selectionScene'
import LevelScene from './scenes/levelScene'
import Hud from './ui/hud'
import GameOverScene from './scenes/GameOverScene'
import SettingScene from './scenes/settingsScene'

const config = {
	type: Phaser.AUTO,

	scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		parent: 'app',
		mode: Phaser.Scale.FIT,
		width: 1176,
		height: 672,
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

	scene: [MainScene,InstructionScene, selecScene, LevelScene, Hud, SettingScene, GameOverScene],
}

export default new Phaser.Game(config)
