import LevelScene from "../levelScene";

export default class LevelScene2 extends LevelScene {
	constructor() {
		super('level2')
	}

	initMap() {
		const mapa = this.map = this.make.tilemap({
			key: 'sala2'
		});

		//Tile Images
		const tiles = mapa.addTilesetImage('Forest', 'tiles');
		const tilesCastleProps = mapa.addTilesetImage('CastleProps', 'tilesCastleProps')
		const tilesCastleStruct = mapa.addTilesetImage('CastleStruct', 'tilesCastleStruct')
		const tilesCastleWall = mapa.addTilesetImage('CastleWalls', 'tilesCastleWall')
		const tilesCastleGrass = mapa.addTilesetImage('FloorCastle', 'tilesCastleGrass')
		const tilesCastlePlant = mapa.addTilesetImage('trees', 'tilesCastlePlant')


		this.groundLayer = this.map.createLayer('Suelo', [tiles, tilesCastleGrass]);
		this.foregroundLayer = this.map.createLayer('Bordes', [tiles, tilesCastleStruct, tilesCastleWall, tilesCastlePlant]);
		this.puerta = this.map.createLayer('EntradasSala', tiles);
		this.objetos = this.map.createLayer('Objetos', [tiles, tilesCastleProps]);
		this.borderTrees = this.map.createLayer('bordeArboles', [tiles, tilesCastlePlant]);
		this.vegetacion = this.map.createLayer('Vegetacion', [tilesCastlePlant]);
		this.porton = this.map.createLayer('Porton', [tilesCastleStruct]);
		this.fuente = this.map.createLayer('Fuente', [tilesCastleProps]);
		this.puertaAbierta = this.map.createLayer('PuertaAbierta', [tilesCastleProps]).setVisible(false);
		this.puertaCerrada = this.map.createLayer('PuertaCerrada', [tilesCastleProps]);
		this.escaleras = this.map.createLayer('Escaleras', [tilesCastleStruct, tilesCastleProps]);
		

		this.foregroundLayer.setCollisionBetween(0, 999);

		this.physics.add.collider(this.enemyPool._group, this.foregroundLayer);
		this.physics.add.collider(this.player, this.foregroundLayer);

		//Ver por que este collider no va
		this.physics.add.collider(this.enemyPool._group, this.porton);
		this.physics.add.collider(this.player, this.porton);

		

		this.physics.add.collider(this.bulletPool._group, this.foregroundLayer, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		
		// this.puertaSolida.setDepth(3);
		this.player.setDepth(2);
		this.enemyPool._group.setDepth(2);
		this.borderTrees.setDepth(3);
		this.foregroundLayer.setDepth(3);
		
		this.salidasSala = {
			izq: {destino: 'sala3', coords: {x: this.sys.game.canvas.width - 80, y: this.sys.game.canvas.height/2}},
			der: {destino: 'sala4', coords: {x: this.player.x, y: 80}},
			abajo: {destino: 'sala1', coords: {x: this.sys.game.canvas.width/2, y: 80}}
		}
		
		this.puertaSolidaIzq = this.physics.add.image(16, 304, 'puertaSala2Izq').setImmovable(true);
		this.puertaSolidaDer = this.physics.add.image(1168, 320, 'puertaSala2Der').setImmovable(true);
		this.puertaSolidaAbajo = this.physics.add.image(574, 656, 'puertaSala2Abajo').setImmovable(true);

		this.puertasGroup = this.add.group();
		this.puertasGroup.addMultiple([this.puertaSolidaIzq, this.puertaSolidaDer, this.puertaSolidaAbajo])
		
		this.physics.add.collider(this.enemyPool._group, this.puertasGroup);
		this.physics.add.collider(this.player, this.puertasGroup);
		
		this.physics.add.collider(this.bulletPool._group, this.puertasGroup, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});


	}

	completeLevel() {
		console.log("NIVEL COMPLETADO")

		this.sound.removeByKey('fightSong');
		this.events.emit('levelComplete');
		this.puerta.setVisible(false);
		this.puertasGroup.setVisible(false)

		this.puertasGroup.remove(this.puertaSolidaAbajo, true, true)
		this.puertasGroup.remove(this.puertaSolidaIzq, true, true)
		this.puertasGroup.remove(this.puertaSolidaDer, true, true)

		this.puertaSolidaAbajo = this.add.zone(574, 672, 128, 10);
		this.physics.add.existing(this.puertaSolidaAbajo);

		this.puertaSolidaIzq = this.add.zone(0, 300, 10, 128);
		this.physics.add.existing(this.puertaSolidaIzq);

		this.puertaSolidaDer = this.add.zone(1176, 320, 10, 128);
		this.physics.add.existing(this.puertaSolidaDer);

		
		this.physics.add.overlap(this.player, this.puertaSolidaAbajo, () => {
			this.sound.stopAll();
			this.events.emit('passLevel', 'level1');
			this.scene.start('level1', { player: this.player, gate: this.salidasSala.abajo.coords});
		});

		this.physics.add.overlap(this.player, this.puertaSolidaIzq, () => {
			this.sound.stopAll();
			this.events.emit('passLevel', 'level3');
			console.log("GATE ANTES", this.salidasSala.izq.coords)
			this.scene.start('level3', { player: this.player, gate: this.salidasSala.izq.coords});
		});

		// this.physics.add.overlap(this.player, this.puertaSolidaDer, () => {
		// 	this.sound.stopAll();
		// 	this.events.emit('passLevel', 'level4');
		// 	this.scene.start('level4', { player: this.player, gate: this.salidasSala.der.coords});
		// });

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