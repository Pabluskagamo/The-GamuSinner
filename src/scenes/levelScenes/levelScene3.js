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
		this.puertaSolida = this.physics.add.image(1136, 240, 'puertaSala3');
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

}