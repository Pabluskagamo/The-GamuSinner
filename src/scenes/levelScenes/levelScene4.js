import LevelScene from "../levelScene";

export default class LevelScene4 extends LevelScene {
    constructor() {
        super('level4')
    }

    initMap() {
        const mapa = this.map = this.make.tilemap({
            key: 'sala4'
        });
        const tilesFaerie = mapa.addTilesetImage('FairyForest', 'tileFaerieForest');
        this.groundLayer = this.map.createLayer('Suelo', tilesFaerie);
        this.foregroundLayer2 = this.map.createLayer('Bordes2', tilesFaerie);
        this.puerta2 = this.map.createLayer('Puerta2', tilesFaerie);
        this.foregroundLayer1 = this.map.createLayer('Bordes1', tilesFaerie);
        this.topTree = this.map.createLayer('copaArboles', tilesFaerie);
        this.wall = this.map.createLayer('Muro', tilesFaerie);  
        this.objetos2 = this.map.createLayer('Objetos2', tilesFaerie);
        this.objetos1 = this.map.createLayer('Objetos', tilesFaerie);
        this.treeborder1 = this.map.createLayer('bordeArboles1', tilesFaerie);
        this.treeborder2 = this.map.createLayer('bordeArboles2', tilesFaerie);
        this.puerta1 = this.map.createLayer('Puerta1', tilesFaerie);
        this.puertaSolida = this.physics.add.image(16, 256, 'puertaSala4');

        this.foregroundLayer1.setCollisionBetween(0, 999);
        this.foregroundLayer2.setCollisionBetween(0, 999);
        this.topTree.setCollisionBetween(0, 999);
        this.wall.setCollisionBetween(0, 999);
        this.puertaSolida.setImmovable(true);

        this.physics.add.collider(this.player, this.foregroundLayer1);
        this.physics.add.collider(this.player, this.foregroundLayer2);
        this.physics.add.collider(this.enemyPool._group, this.topTree);
        this.physics.add.collider(this.player, this.topTree);
        this.physics.add.collider(this.enemyPool._group, this.wall);
        this.physics.add.collider(this.player, this.wall);
        this.physics.add.collider(this.enemyPool._group, this.puertaSolida);
        this.physics.add.collider(this.player, this.puertaSolida);

        this.physics.add.collider(this.bulletPool._group, this.foregroundLayer1, (obj1, obj2) => {
            obj1.reboundOrRelease()
        });

        this.physics.add.collider(this.bulletPool._group, this.foregroundLayer2, (obj1, obj2) => {
            obj1.reboundOrRelease()
        });

        this.physics.add.collider(this.bulletPool._group, this.wall, (obj1, obj2) => {
            obj1.reboundOrRelease()
        });

        this.physics.add.collider(this.bulletPool._group, this.puertaSolida, (obj1, obj2) => {
            obj1.reboundOrRelease()
        });

        this.puertaSolida.setDepth(3);
        this.player.setDepth(2);
        this.enemyPool._group.setDepth(2);
        this.objetos1.setDepth(3);
        this.wall.setDepth(3);
        this.foregroundLayer1.setDepth(3);
        this.foregroundLayer2.setDepth(3);

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
		this.abrirPuertas();

		for (let i = 0; i < 5; i++) {
			setTimeout(() => {
				this.cameras.main.flash(500);
			}, i * 600);
		}

		this.addMeiga();
		this.spawnMeiga = true;
		this.player.collectCoin(1000);
	}

    addMeiga() {

        const meiga = this.add.sprite(945, 360, 'meiga').setScale(1.6);
        this.anims.create({
            key: 'meigaState',
            frames: this.anims.generateFrameNumbers('meiga', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        meiga.play('meigaState');
        const e_key = this.add.sprite(945, 330, 'e_key');
        this.anims.create({
            key: 'E_Press',
            frames: this.anims.generateFrameNumbers('e_key', { start: 0, end: 2 }),
            frameRate: 2,
            repeat: -1
        });
        e_key.play('E_Press');
    }

    abrirPuertas() {
        this.puerta1.setVisible(false);
        this.puerta2.setVisible(false);
        this.puertaSolida.destroy();
        const zonaInvisible = this.add.zone(0, 288, 10, 128);
        this.physics.add.existing(zonaInvisible);

        this.physics.add.overlap(this.player, zonaInvisible, () => {
            this.sound.stopAll();
            this.scene.start('level2', { player: this.player, gate: { x: this.sys.game.canvas.width - 80, y: this.player.y } });
        });
    }

}