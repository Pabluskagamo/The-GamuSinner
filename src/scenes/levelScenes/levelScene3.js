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
			this.sound.removeByKey('explorationSong');
			this.sound.removeByKey('appearEffect');
			this.events.emit('passLevel', {playerData: this.player.getPlayerStats(), level: 'level2', levelboss: true});
			this.scene.start('level2', { player: this.player, gate: {x: 80, y: this.player.y}, mute: this.isMuted });
		});
	}

	setMusic(){
		if(!this.sound.get("fightSong3")){
			this.banda = this.sound.add("fightSong3", {
				volume: 0.1,
				loop: true
			});
		}
	}

}