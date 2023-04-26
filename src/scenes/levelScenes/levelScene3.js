import LevelScene from "../levelScene";

export default class LevelScene2 extends LevelScene {
	constructor() {
		super('level3')
	}

	initMap() {
		const mapa = this.map = this.make.tilemap({
			key: 'sala3'
		});
		const tiles = mapa.addTilesetImage('Forest', 'tiles');
		this.groundLayer = this.map.createLayer('Suelo', tiles);
		this.foregroundLayer = this.map.createLayer('Bordes', tiles);
		this.puertaSolida = this.physics.add.image(1168, 320, 'puertaSala3');
		this.puerta = this.map.createLayer('Puerta2', tiles);
		this.objetos = this.map.createLayer('Objetos', tiles);
		this.borderTrees = this.map.createLayer('bordeArboles', tiles);

		this.foregroundLayer.setCollisionBetween(0, 999);
        this.puertaSolida.setImmovable(true);

		this.physics.add.collider(this.enemyPool._group, this.foregroundLayer);
		this.physics.add.collider(this.player, this.foregroundLayer);
		this.physics.add.collider(this.enemyPool._group, this.puertaSolida);
		this.physics.add.collider(this.player, this.puertaSolida);

		this.physics.add.collider(this.bulletPool._group, this.foregroundLayer, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		this.physics.add.collider(this.bulletPool._group, this.puertaSolida, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		this.puertaSolida.setDepth(3);
		this.player.setDepth(2);
		this.enemyPool._group.setDepth(2);
		this.borderTrees.setDepth(3);
		this.foregroundLayer.setDepth(3);
	}

	completeLevel() {
		console.log("NIVEL COMPLETADO")
		LevelScene.progress[this.namescene] = true

		this.sound.removeByKey('fightSong');
		this.events.emit('levelComplete');
		this.abrirPuertas()
		
		this.addMeiga();
		this.spawnMeiga = true;
		this.player.collectCoin(1000);
	}

	// addMeiga() {
		
	// 	const meiga = this.add.sprite(480, 300, 'meiga').setScale(1.6);
	// 	this.anims.create({
	// 		key: 'meigaState',
	// 		frames: this.anims.generateFrameNumbers('meiga', { start: 0, end: 3 }),
	// 		frameRate: 3,
	// 		repeat: -1
	// 	});
	// 	meiga.play('meigaState');
	// 	const e_key = this.add.sprite(480, 270, 'e_key');
	// 	this.anims.create({
	// 		key: 'E_Press',
	// 		frames: this.anims.generateFrameNumbers('e_key', { start: 0, end: 2 }),
	// 		frameRate: 2,
	// 		repeat: -1
	// 	});
	// 	e_key.play('E_Press');
	// }

	abrirPuertas(){
		this.puerta.setVisible(false);
		this.puertaSolida.destroy();
		const zonaInvisible = this.add.zone(this.sys.game.canvas.width, 320, 10, 128);
		this.physics.add.existing(zonaInvisible);

		this.physics.add.overlap(this.player, zonaInvisible, () => {
			this.sound.stopAll();
			this.scene.start('level2', { player: this.player, gate: {x: 80, y: this.player.y}});
		});
	}

}