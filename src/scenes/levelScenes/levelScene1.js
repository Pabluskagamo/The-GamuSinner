import LevelScene from "../levelScene";

// ESCENA QUE CORRESPONDE AL NIVEL 1 DE GALICIA

export default class LevelScene1 extends LevelScene {
	constructor() {
		super('level1')
	}

	// FUNCION PARA CUANDO SE COMPLETE EL NIVEL SE AÑADA LA MUSICA Y SE ABRAN LAS PUERTAS
	completeLevel() {

		LevelScene.progress[this.namescene] = true

		this.sound.removeByKey('fightSong');
		this.sound.removeByKey('fightSong2');
		this.sound.removeByKey('fightSong3');

		if (!this.isMuted) {
			const explorationSong = this.sound.add("explorationSong", {
				volume: 0.1,
				loop: true
			});

			const appearEffect = this.sound.add("appearEffect", {
				volume: 0.1
			});

			appearEffect.play();

			appearEffect.once('complete', () => {
				explorationSong.play();
			});
		}


		this.events.emit('levelComplete');
		this.abrirPuertas()

		for (let i = 0; i < 5; i++) {
			setTimeout(() => {
				this.cameras.main.flash(500);
			}, i * 600);
		}
	}

	// FUNCION PARA ABRIR LAS PUERTAS QUE LE CORRESPONDEN
	abrirPuertas() {
		this.puerta.setVisible(false);
		this.puertaSolida.destroy();
		
		// AÑADE UNA ZONA INVISIBLE PARA QUE CUANDO LA TOQUES PASES EN ESTE CASO AL NIVEL 2
		const zonaInvisible = this.add.zone(576, 0, 128, 10);
		this.physics.add.existing(zonaInvisible);

		this.physics.add.overlap(this.player, zonaInvisible, () => {
			this.sound.removeByKey('explorationSong');
			this.sound.removeByKey('appearEffect');
			this.events.emit('passLevel', { playerData: this.player.getPlayerStats(), level: 'level2', dmg: this.bulletPool.getDmg() });
			this.scene.start('level2', { player: this.player, gate: { x: this.player.x, y: this.sys.game.canvas.height - 80 }, mute: this.isMuted });
		});
	}


}