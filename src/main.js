import Phaser from 'phaser'

import MainScene from './scenes/MainScene'
import InstructionScene from './scenes/instructionScene'
import selecScene from './scenes/selectionScene'
import LevelScene from './scenes/levelScene'
import Hud from './ui/hud'
import GameOverScene from './scenes/GameOverScene'
import SettingScene from './scenes/settingsScene'
import StatsScene from './scenes/statsScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	pixelArt: true,
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
            width: 1920,
            height: 1080
        },
		zoom: 1
	},
	
	physics: {
		default: 'arcade',
		
		arcade: {
			debug: false
		},
	},

	scene: [MainScene, InstructionScene, selecScene, LevelScene, Hud, SettingScene, StatsScene, GameOverScene],
}

export default new Phaser.Game(config)
