import LevelScene from "../levelScene";

// ESCENA QUE CORRESPONDE AL NIVEL 2 DE GALICIA

export default class LevelScene2 extends LevelScene {
	static firstTalkMeiga = false

	constructor() {
		super('level2');
		this.isTransitioning = false;
	}

	create(data){
		super.create(data);
		if(!this.scene.isActive('stats') && !this.scene.isSleeping('stats')){
			this.scene.launch('stats', {playerData: this.player.getPlayerStats(), level: 'level2', dmg: this.bulletPool.getDmg()});
			this.scene.sleep('stats');
		}
	}

	// FUNCION PARA INICIALIZAR EL TILEMAP DEL NIVEL 2
	initMap() {
		const mapa = this.map = this.make.tilemap({
			key: 'sala2'
		});

		// TILE IMAGES
		const tiles = mapa.addTilesetImage('Forest', 'tiles');
		const tilesCastleProps = mapa.addTilesetImage('CastleProps', 'tilesCastleProps')
		const tilesCastleStruct = mapa.addTilesetImage('CastleStruct', 'tilesCastleStruct')
		const tilesCastleWall = mapa.addTilesetImage('CastleWalls', 'tilesCastleWall')
		const tilesCastleGrass = mapa.addTilesetImage('FloorCastle', 'tilesCastleGrass')
		const tilesCastlePlant = mapa.addTilesetImage('trees', 'tilesCastlePlant')
		const smallRunes = mapa.addTilesetImage('Small Runes', 'smallRunes')

		// TILE LAYERS
		this.groundLayer = this.map.createLayer('Suelo', [tiles, tilesCastleGrass]);
		this.vegetacion = this.map.createLayer('Vegetacion', [tiles, tilesCastlePlant]);
		this.fuente = this.map.createLayer('Fuente', [tilesCastleProps]);
		this.runasfuente = this.map.createLayer('runasFuente', [smallRunes, tilesCastleProps]).setVisible(false);
		this.puertaAbierta = this.map.createLayer('PuertaAbierta', [tilesCastleProps]).setVisible(false);
		this.puertaCerrada = this.map.createLayer('PuertaCerrada', [tilesCastleProps]);
		this.puerta = this.map.createLayer('EntradasSala', tiles);
		this.porton = this.map.createLayer('Porton', [tilesCastleStruct]);
		this.foregroundLayer = this.map.createLayer('Bordes', [tiles, tilesCastleStruct, tilesCastleWall, tilesCastlePlant]);
		this.objetos = this.map.createLayer('Objetos', [tiles, tilesCastleProps]);
		this.objetosColl = this.map.createLayer('ObjetosColl', [tiles, tilesCastleProps]);
		this.runas = this.map.createLayer('runas', [tilesCastleProps]).setVisible(false);
		this.borderTrees = this.map.createLayer('bordeArboles', [tiles, tilesCastlePlant]);
		this.escaleras = this.map.createLayer('Escaleras', [tilesCastleStruct, tilesCastleProps]);

		// COLISIONES
		this.foregroundLayer.setCollisionBetween(0, 1200);
		this.objetosColl.setCollisionBetween(0, 999);
		this.porton.setCollisionBetween(0, 999);

		this.physics.add.collider(this.enemyPool._group, this.foregroundLayer);
		this.physics.add.collider(this.player, this.foregroundLayer);
		this.physics.add.collider(this.player, this.objetosColl);
		this.physics.add.collider(this.enemyPool._group, this.objetosColl);

		this.physics.add.collider(this.enemyPool._group, this.porton);
		this.physics.add.collider(this.player, this.porton);



		this.physics.add.collider(this.bulletPool._group, this.foregroundLayer, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		// PROFUNDIDAD
		this.player.setDepth(2);
		this.enemyPool._group.setDepth(2);
		this.borderTrees.setDepth(3);
		this.foregroundLayer.setDepth(3);
		this.objetosColl.setDepth(4);
		this.porton.setDepth(3);

		// PUERTAS POSIBLES
		this.salidasSala = {
			izq: { destino: 'sala3', coords: { x: this.sys.game.canvas.width - 80, y: this.sys.game.canvas.height / 2 } },
			der: { destino: 'sala4', coords: { x: 80, y: this.sys.game.canvas.height / 2 } },
			abajo: { destino: 'sala1', coords: { x: this.sys.game.canvas.width / 2, y: 80 } }
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

		this.f = this.input.keyboard.addKey('F')

	}

	// FUNCION PARA INICIALIZAR EL NIVEL MODO EXPLORACION Y AÑADE LA MEIGA, EN CASO DE QUEYA HAYA HABLADO CON ELLA ABRE LAS PUERTAS
	initLevelFreeMode() {
		if(!this.isMuted){
			this.explorationSong.play();
		}
		this.addMeiga();
		if(LevelScene2.firstTalkMeiga){
			this.abrirPuertas()
		}
	}

	// FUNCION PARA ABRIR LAS PUERTAS QUE LE CORRESPONDEN (3 PUERTAS EN ESTE CASO)
	abrirPuertas() {
		this.puerta.setVisible(false);
		this.puertasGroup.setVisible(false)

		// ELIMINA LAS TRES PUERTAS Y GENERA 3 ZONAS INVISIBLES PARA ASI ACCEDER A SUS RESPECTIVAS SALAS SI COLISIONAS CON ÉSTAS
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
			this.sound.removeByKey('panasong');
			this.sound.removeByKey('explorationSong');
			this.sound.removeByKey('appearEffect');
			this.events.emit('passLevel', { playerData: this.player.getPlayerStats(), level: 'level1' });
			this.scene.start('level1', { player: this.player, gate: this.salidasSala.abajo.coords, mute: this.isMuted });
		});

		this.physics.add.overlap(this.player, this.puertaSolidaIzq, () => {
			this.sound.removeByKey('panasong');
			this.sound.removeByKey('explorationSong');
			this.sound.removeByKey('appearEffect');
			this.events.emit('passLevel', { playerData: this.player.getPlayerStats(), level: 'level3' });
			this.scene.start('level3', { player: this.player, gate: this.salidasSala.izq.coords, mute: this.isMuted });
		});

		this.physics.add.overlap(this.player, this.puertaSolidaDer, () => {
			this.sound.removeByKey('panasong');
			this.sound.removeByKey('explorationSong');
			this.sound.removeByKey('appearEffect');
			this.events.emit('passLevel', { playerData: this.player.getPlayerStats(), level: 'level4' });
			this.scene.start('level4', { player: this.player, gate: this.salidasSala.der.coords, mute: this.isMuted });
		});

		if (this.allLevelsComplete()) {
			this.puertaCerrada.setVisible(false);
			this.puertaAbierta.setVisible(true);
			this.runasfuente.setVisible(true);
			this.runas.setVisible(true);
			this.tweens.add({
				targets: [this.runas, this.runasfuente],
				alpha: 0,
				duration: 1700,
				ease: 'Power2',
				yoyo: true,
				repeat: -1
			  });
			if (this.isTransitioning) {
				return;
			}
			this.isTransitioning = true;
			this.puertaSolidaArriba = this.add.zone(575, 119, 35, 10);
			this.physics.add.existing(this.puertaSolidaArriba);
			this.physics.add.overlap(this.player, this.puertaSolidaArriba, () => {
				this.sound.removeByKey('panasong');
				this.sound.removeByKey('explorationSong');
				this.sound.removeByKey('appearEffect');
				this.events.emit('passLevel', { playerData: this.player.getPlayerStats(), level: 'levelBoss', bossLevel: true });
				this.scene.start('levelBoss', { player: this.player, gate: { x: this.player.x, y: this.sys.game.canvas.height - 80 }, mute: this.isMuted });
			});
		}


		this.easteregg = this.add.zone(1040, 560, 20, 20);
		this.physics.add.existing(this.easteregg);

		this.eastereggActive = false

		this.physics.add.overlap(this.player, this.easteregg, () => {
			if (this.f.isDown && !this.eastereggActive) {
				this.eastereggActive = true
				this.activateEaseterEgg();
			}
		});
	}

	// SI ESTA LA MEIGA Y SE PRESIONA LA TECLA E PUEDES INTERACTUAR CON ELLA ABIENDOSE EL MENU DE ESTADISTICAS
	update(t, dt){
		if (this.spawnMeiga && this.e.isDown) {
			this.openMeigaMenu()
		}
	}

	// FUNCION PARA DESPERTAR LA ESCENA DE ESTADISTICAS
	openMeigaMenu() {
		this.player.stopHorizontal();
		this.player.stopVertical();
		this.scene.pause();
		this.scene.pause('UIScene');
		
		this.statsGame.initDialog();
		this.scene.wake('stats', {playerData: this.player.getPlayerStats(), dmg: this.bulletPool.getDmg()});
	}

	// FUNCION PARA ABRIR LAS PUERTAS TRAS HABLAR POR PRIMERA VEZ CON LA MEIGA
	abrirpuertasFirstTalk(){
		LevelScene2.firstTalkMeiga = true;
		
		if(LevelScene2.firstTalkMeiga){
			this.tweens.add({
				targets: [this.puerta, this.puertaSolidaIzq, this.puertaSolidaDer, this.puertaSolidaAbajo],
				alpha: { from: 1, to: 0 },
				duration: 3000,
				ease: 'Sine.easeInOut',
				yoyo: false,
				onComplete: ()=>{
					this.abrirPuertas();
				}
			})
		}
	}

	// FUNCION PARA ACTIVAR UN EASTEREGG QUE HAY EN EL JUEGO
	activateEaseterEgg() {
		if (!this.isMuted) {
			const panasound = this.sound.add("panasong", {
				volume: 0.1
			});
			panasound.play();
		}

		const pana = this.add.sprite(1200, 560, 'pana').setScale(0.3);
		pana.setDepth(2);

		this.tweens.add({
			targets: pana,
			x: { from: 1200, to: 1100 },
			duration: 4000,
			ease: 'Sine.easeInOut',
			yoyo: false,
		})

		this.time.addEvent({
			delay: 31500,
			callback: () => {
				this.eastereggActive = false;
				this.tweens.add({
					targets: pana,
					x: { from: 1100, to: 1200 },
					duration: 4000,
					ease: 'Sine.easeInOut',
					yoyo: false,
					onComplete: () => {
						this.sound.removeByKey('panasong');
						this.explorationSong.play();
					}
				})
			},
			callbackScope: this,
			loop: false
		});
	}


}