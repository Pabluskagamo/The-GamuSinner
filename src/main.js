import Phaser from 'phaser'

import MainScene from './scenes/MainScene'
import InstructionScene from './scenes/instructionScene'
import selecScene from './scenes/selectionScene'
import LevelScene1 from './scenes/levelScenes/levelScene1'
import LevelScene2 from './scenes/levelScenes/levelScene2'
import LevelScene3 from './scenes/levelScenes/levelScene3'
import LevelScene4 from './scenes/levelScenes/levelScene4'
import Hud from './ui/hud'
import GameOverScene from './scenes/GameOverScene'
import SettingScene from './scenes/settingsScene'
import StatsScene from './scenes/statsScene'
import historyScene from './scenes/historyScene'
import LevelSceneBoss from './scenes/levelScenes/levelSceneBoss'
import CreditsScene from './scenes/CreditsScene'

// CONFIGURACION PARA GENERAR EL ESPACIO DE PHASER

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	pixelArt: true,
	width: 1176,
	height: 672,
	renderer: Phaser.CANVAS,
	antialias: false,
	crisp: true,
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

	scene: [MainScene, historyScene, InstructionScene, selecScene, LevelScene1, LevelScene2, LevelScene3, LevelScene4, LevelSceneBoss ,Hud, StatsScene, SettingScene, GameOverScene, CreditsScene],
	// scene: [/*MainScene, historyScene, InstructionScene, selecScene,*/LevelSceneBoss, LevelScene1, LevelScene2, LevelScene3, LevelScene4, Hud, StatsScene, SettingScene, GameOverScene],
}

export default new Phaser.Game(config)
