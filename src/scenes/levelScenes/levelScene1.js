import LevelScene from "../levelScene";


export default class LevelScene1 extends LevelScene {
	constructor() {
		super('level1')
	}

	completeLevel() {
		console.log("NIVEL COMPLETADO")

		LevelScene.progress[this.namescene] = true

		this.sound.removeByKey('fightSong');

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

		this.events.emit('levelComplete');
		this.abrirPuertas()

		for (let i = 0; i < 5; i++) {
			setTimeout(() => {
				this.cameras.main.flash(500);
			}, i * 600);
		}

		this.addMeiga();
		this.spawnMeiga = true;
		this.player.collectCoin(1000);
	}

	abrirPuertas(){
		this.puerta.setVisible(false);
		this.puertaSolida.destroy();
		const zonaInvisible = this.add.zone(576, 0, 128, 10);
		this.physics.add.existing(zonaInvisible);

		this.physics.add.overlap(this.player, zonaInvisible, () => {
			this.sound.stopAll();
			this.events.emit('passLevel',  {playerData: this.player.getPlayerStats(), level: 'level2', dmg: this.bulletPool.getDmg()});
			this.statsGame.changeLevel('level2')
			this.scene.start('level2', { player: this.player, gate: {x: this.player.x, y: this.sys.game.canvas.height - 80}});
		});
	}


}