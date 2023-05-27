import LevelScene from "../levelScene";

export default class SandBoxScene extends LevelScene{
    constructor(){
        super('sandboxlevel')
    }

    completeLevel(){

    }

    // initMap(){

    // }

    initMap() {
		const mapa = this.map = this.make.tilemap({
			key: 'salaSandBox'
		});

		// TILE IMAGES
		const tiles = mapa.addTilesetImage('Forest', 'tiles');
		const tilesCastleProps = mapa.addTilesetImage('CastleProps', 'tilesCastleProps')
		const tilesCastleWall = mapa.addTilesetImage('CastleWalls', 'tilesCastleWall')
		const tilesCastleGrass = mapa.addTilesetImage('FloorCastle', 'tilesCastleGrass')
		const tilesCastlePlant = mapa.addTilesetImage('trees', 'tilesCastlePlant')

		// TILE LAYERS
		this.groundLayer = this.map.createLayer('Suelo', [tilesCastleGrass]);
		this.vegetacion = this.map.createLayer('Vegetacion', [tiles, tilesCastlePlant]);
		this.fuente = this.map.createLayer('fuente', [tilesCastleProps]);
		this.foregroundLayer = this.map.createLayer('Bordes', [tiles, tilesCastleProps, tilesCastlePlant]);
		this.objetos = this.map.createLayer('Objetos', [tiles, tilesCastleProps]);
		this.borderTrees = this.map.createLayer('bordeArboles', [tiles, tilesCastlePlant, tilesCastleProps]);

		// COLISIONES
		this.foregroundLayer.setCollisionBetween(0, 600);

		this.physics.add.collider(this.enemyPool._group, this.foregroundLayer);
		this.physics.add.collider(this.player, this.foregroundLayer);
	

		this.physics.add.collider(this.bulletPool._group, this.foregroundLayer, (obj1, obj2) => {
			obj1.reboundOrRelease()
		});

		// PROFUNDIDAD
		this.player.setDepth(2);
		this.enemyPool._group.setDepth(2);
		this.borderTrees.setDepth(3);
		this.foregroundLayer.setDepth(3);

	}


    // INICIALIZADOR DE LOS TEMPORIZADORES - OLEADAS
	initTimers(debug) {
		this.freqChangeTime = 10000;
		this.lastSec = 20;
		this.freqFactor = 500;
		this.levelFinished = false;
		this.wavesFinished = false;

		if (debug) {
			this.k = this.input.keyboard.addKey('K');
			this.debugMode = true;
		}

		this.enemySpawnTimer = this.time.addEvent({
			delay: 4000,
			callback: this.spawnInBounds,
			callbackScope: this,
			loop: true
		});

		this.freqTimer = this.time.addEvent({

			delay: this.freqChangeTime,
			callback: this.changeFreqHandler,
			callbackScope: this,
			loop: true
		});
	}


    changeFreqHandler() {
		const currDelay = this.enemySpawnTimer.delay;

		this.freqFactor = currDelay > 1000 ? 500 : 200;

		if (currDelay === 1000) {
			this.freqChangeTime = 30000;
			this.lastSec = 30;
			this.freqTimer.reset({
				delay: this.freqChangeTime,
				callback: this.changeFreqHandler,
				callbackScope: this,
				loop: true
			})
		}

		if (currDelay === 2000) {
			this.freqChangeTime = 20000;
			this.lastSec = 20;
			this.freqTimer.reset({
				delay: this.freqChangeTime,
				callback: this.changeFreqHandler,
				callbackScope: this,
				loop: true
			})
		}

		console.log('cambio de frecuencia de', currDelay, 'a', currDelay - this.freqFactor)
        let spawnDelay = currDelay;

		if (currDelay > 300) {
            spawnDelay -= this.freqFactor;
        } 

        this.enemySpawnTimer.reset({
            delay: spawnDelay,
            callback: this.spawnInBounds,
            callbackScope: this,
            loop: true
        })
	}

}