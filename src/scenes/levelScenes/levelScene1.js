import LevelScene from "../levelScene";


export default class LevelScene1 extends LevelScene {
	constructor() {
		super('level1')
	}

	completeLevel() {
		console.log("NIVEL COMPLETADO")

		this.sound.removeByKey('fightSong');
		this.events.emit('levelComplete');
		this.puerta.setVisible(false);
		this.puertaSolida.destroy();
		const zonaInvisible = this.add.zone(576, 0, 128, 10);
		this.physics.add.existing(zonaInvisible);

		this.physics.add.overlap(this.player, zonaInvisible, () => {
			this.sound.stopAll();
			this.scene.sleep();
			this.scene.launch('level2', { player: this.player , prevScene: 'level1'});
		});

		for (let i = 0; i < 5; i++) {
			setTimeout(() => {
				this.cameras.main.flash(500);
			}, i * 600);
		}

		this.addMeiga();
		this.spawnMeiga = true;
		this.player.collectCoin(1000);
	}


}