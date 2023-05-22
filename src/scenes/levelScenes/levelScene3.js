import LevelScene from "../levelScene";

// ESCENA QUE CORRESPONDE AL NIVEL 3 DE GALICIA

export default class LevelScene3 extends LevelScene {
	constructor() {
		super('level3')
	}

	// FUNCION PARA INICIALIZAR EL TILEMAP DEL NIVEL 3
	initMap() {
		const mapa = this.map = this.make.tilemap({
			key: 'sala3'
		});

		// TILE IMAGE
		const tiles = mapa.addTilesetImage('Forest', 'tiles');

		// TILE LAYERS
		this.groundLayer = this.map.createLayer('Suelo', tiles);
		this.foregroundLayer = this.map.createLayer('Bordes', tiles);
		this.puertaSolida = this.physics.add.image(1168, 320, 'puertaSala3');
		this.puerta = this.map.createLayer('Puerta2', tiles);
		this.objetos = this.map.createLayer('Objetos', tiles);
		this.borderTrees = this.map.createLayer('bordeArboles', tiles);

		// COLISIONES
		this.foregroundLayer.setCollisionBetween(0, 999);
        this.puertaSolida.setImmovable(true);

		this.physics.add.collider(this.enemyPool._group, this.foregroundLayer, (obj1, obj2) => {
			if(obj1.key === 'rock' && !obj1.justHit){
				obj1.hit();
			}
		});

		this.physics.add.collider(this.player, this.foregroundLayer);
		this.physics.add.collider(this.enemyPool._group, this.puertaSolida);
		this.physics.add.collider(this.player, this.puertaSolida);

		this.physics.add.collider(this.bulletPool._group, this.foregroundLayer, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		this.physics.add.collider(this.bulletPool._group, this.puertaSolida, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		// PROFUNDIDAD
		this.puertaSolida.setDepth(3);
		this.player.setDepth(2);
		this.enemyPool._group.setDepth(2);
		this.borderTrees.setDepth(3);
		this.foregroundLayer.setDepth(3);
	}

	// FUNCION PARA CUANDO SE COMPLETE EL NIVEL SE AÑADA LA MUSICA Y SE ABRAN LAS PUERTAS
	completeLevel() {
		console.log("NIVEL COMPLETADO")
		LevelScene.progress[this.namescene] = true

		this.sound.removeByKey('fightSong');
		this.sound.removeByKey('fightSong2');
		this.sound.removeByKey('fightSong3');

		if(!this.isMuted){
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
		this.abrirPuertas();

		for (let i = 0; i < 5; i++) {
			setTimeout(() => {
				this.cameras.main.flash(500);
			}, i * 600);
		}
	}

	// FUNCION PARA ABRIR LAS PUERTAS QUE LE CORRESPONDEN
	abrirPuertas(){
		this.puerta.setVisible(false);
		this.puertaSolida.destroy();
		
		// AÑADE UNA ZONA INVISIBLE PARA QUE CUANDO LA TOQUES PASES EN ESTE CASO AL NIVEL 2
		const zonaInvisible = this.add.zone(this.sys.game.canvas.width, 320, 10, 128);
		this.physics.add.existing(zonaInvisible);

		this.physics.add.overlap(this.player, zonaInvisible, () => {
			this.sound.removeByKey('explorationSong');
			this.sound.removeByKey('appearEffect');
			this.events.emit('passLevel', {playerData: this.player.getPlayerStats(), level: 'level2', levelboss: true});
			this.scene.start('level2', { player: this.player, gate: {x: 80, y: this.player.y}, mute: this.isMuted });
		});
	}

	// ESTABLECE LA MUSICA
	setMusic(){
		if(!this.sound.get("fightSong3")){
			this.banda = this.sound.add("fightSong3", {
				volume: 0.1,
				loop: true
			});
		}
	}

}