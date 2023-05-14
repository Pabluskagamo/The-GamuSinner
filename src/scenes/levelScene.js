import BulletPool from "../gameobjects/Pools/bulletPool"
import CoinPool from "../gameobjects/Pools/coinPool"
import FoodPool from "../gameobjects/Pools/foodPool"
import PowerUpPool from "../gameobjects/Pools/powerUpPool"
import EnemyPool from "../gameobjects/Pools/enemyPool"
import Character from "../gameobjects/character"
import TripleShot from "../gameobjects/powerUps/tripleShot"
import EightDirShot from "../gameobjects/powerUps/eightDirShot"
import BouncingShot from "../gameobjects/powerUps/bouncingShot"
import FreezingShot from "../gameobjects/powerUps/freezingShot"
import PetBot from "../gameobjects/powerUps/petBot"
import JellyfishPet from "../gameobjects/powerUps/jellyfishPet"

// PADRE DE TODOS LOS NIVELES DE GALICIA

export default class LevelScene extends Phaser.Scene {
	// OBJECT QUE LLEVA EL PROGRESO DE CADA NIVEL (FALSE === PASARLO, TRUE === YA PASADO)
	static progress = {
		level1: false,
		level2: true,
		level3: true,
		level4: true,
		levelBoss: true
	}

	constructor(scene) {
		super(scene)
        this.namescene = scene;
	}

	init() {
		this.cameras.main.fadeIn(500);
	}

	preload() {
		this.load.image('puertaSala1', './assets/tileset/puertas_32x32.png')
		this.load.image('puertaSala3', './assets/tileset/puertas3_32x32.png')
		this.load.image('puertaSala4', './assets/tileset/puerta4_32x32.PNG')
		this.load.image('puertaSala2Izq', './assets/tileset/sala2/Pizq.png')
		this.load.image('puertaSala2Der', './assets/tileset/sala2/Pder.png')
		this.load.image('puertaSala2Abajo', './assets/tileset/sala2/Pabj.png')
		this.load.image('game_settings', './assets/ui/settings.png')
		this.load.image('pana', './assets/enemies/pana_pixel.png')
	}

	create(data) {

		// AÑADE MUSICA
		this.isMuted = data.mute;
		
        if(!this.isMuted){
			this.setMusic()
		}

		this.explorationSong = this.sound.add("explorationSong", {
			volume: 0.1,
			loop: true
		});

		// INICIALIZA EL PERSONAJE, LAS POOLS Y EL TILEMAP
		this.initPlayerAndPools(data);
		this.initMap();
		this.coinPool.fillPull(20);
		this.foodPool.fillPull(20);
		this.bulletPool.fillPool(1000);
		
		// COMPRUEBA SI EL NIVEL YA HA SIDO PASADO O NO
		if(LevelScene.progress[this.namescene]){
			this.initLevelFreeMode()
		}else{
			this.initLevelFightMode();
		}

		// SETTINGS BUTTON
		const settings = this.add.image(90, 90, 'game_settings').setScale(0.3).setDepth(4);

		if(this.namescene == 'level1' && !LevelScene.progress.level1){		
			console.log("LAUNCH Level", this.namescene)
			this.scene.launch('UIScene', {playerData: this.player.getPlayerStats(), level: this.namescene, bossLevel: data.bossLevel});
		}

		settings.setInteractive({ cursor: 'pointer' });

		settings.on('pointerover', function (pointer) {
			this.setTint(0xffc800);
		});

		settings.on('pointerout', function (pointer) {
			this.clearTint();
		});

		settings.on('pointerup', () => {
			this.player.stopHorizontal();
			this.player.stopVertical();
			this.scene.pause();
			this.scene.pause('UIScene');
			if(LevelScene.progress[this.namescene]){
				this.scene.launch('settings', { level: this.namescene, mute: this.isMuted, music: this.explorationSong});
			}
			else{
				this.scene.launch('settings', { level: this.namescene, mute: this.isMuted, music: this.banda});
			}
		});

		this.input.keyboard.on('keydown', (event) => {
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.CTRL) {
				this.player.stopHorizontal();
				this.player.stopVertical();
				this.scene.pause();
				this.scene.pause('UIScene');
				if(LevelScene.progress[this.namescene]){
					this.scene.launch('settings', { level: this.namescene, mute: this.isMuted, music: this.explorationSong});
				}
				else{
					this.scene.launch('settings', { level: this.namescene, mute: this.isMuted, music: this.banda});
				}
			}
		});

		// AÑADIMOS LOS POWER-UPS DISPONIBLES Y LOS AÑADIMOS A SU POOL
		let powerUps = []

		for (let i = 0; i < 6; i++) {
			powerUps.push(new FreezingShot(this, -125, -125));
			powerUps.push(new BouncingShot(this, -125, -125));
			powerUps.push(new TripleShot(this, -125, -125));
			powerUps.push(new EightDirShot(this, -125, -125));
			powerUps.push(new PetBot(this, -125, -125, new JellyfishPet(this, -125, -125)));
		}
		this.powerUpPool.addMultipleEntity(powerUps);

		this.e = this.input.keyboard.addKey('E');

		// CAPTURA LA ESCENA DE ESTADISTICAS
		this.statsGame = this.scene.get('stats');

		// EVENTO PARA ACTUALIZAR LAS MONEDAS DEL PERSONAJE AL SER GASTADAS
		this.statsGame.events.on('spentcoins', this.player.setWallet, this.player);

		// EVENTO PARA INCREMENTAR LA FUERZA DEL PERSONAJE
		this.statsGame.events.on('incrementStrong', this.player.setBulletDmg, this.player);

		// EVENTO PARA INCREMENTAR LA VELOCIDAD EL PERSONAJE
		this.statsGame.events.on('incrementSpeed', this.player.setSpeed, this);

		// EVENTO PARA INCREMENTAR LA VIDA DEL PERSONAJE
		this.statsGame.events.on('incrementLife', this.incrementPlayerLife, this);

		// EVENTO PARA INCREMENTAR LA CADENCIA DEL DISAPARO DEL PERSONAJE
		this.statsGame.events.on('incrementCadence', this.player.setCadence, this.player);

		this.settingsGame = this.scene.get('settings');

		// EVENTO PARA COMPROBAR SI ESTA MUTE O NO
		this.settingsGame.events.on('muteOption', function (mute) {
			this.isMuted = mute;
		}, this);

		// EVENTO PARA ELIMINAR LAS ESCUCHAS A LOS EVENTOS DE LA ESCENA DE ESTADISTICAS
		this.events.on('shutdown', ()=>{
            this.statsGame.events.removeListener('spentcoins', this.player.setWallet, this);
			this.statsGame.events.removeListener('incrementStrong', this.bulletPool.changeDmg, this);
			this.statsGame.events.removeListener('incrementSpeed', this.player.setSpeed, this);
			this.statsGame.events.removeListener('incrementLife', this.incrementPlayerLife, this);
			this.statsGame.events.removeListener('incrementCadence', this.player.setCadence, this);
        }, this);
	}

	update(t) {
		
		// COMPRUEBA SI ESTA EN DEBUGUEO O COMPLETADO EL NIVEL
		if (this.debugMode && !this.levelFinished && Phaser.Input.Keyboard.JustUp(this.k)) {
			if(this.enemySpawnTimer){
				this.enemySpawnTimer.remove();
			}
			if(this.freqTimer){
				this.freqTimer.remove();
			}

			this.levelFinished = true;
			this.player.collectCoin(1000);
			this.events.emit('earnCoin', this.player.getWallet());
			this.completeLevel()
		}

		// COMPRUEBA EL PROGRESO DEL NIVEL
		if(!LevelScene.progress[this.namescene]){
			if (!this.wavesFinished) {
				this.updateWaveCount()
			}
			else if (!this.levelFinished && this.enemyPool.fullPool()) {
				this.levelFinished = true;
				this.completeLevel();
			}
		}
	}

	// FUNCION PARA INICIALIZAR EL TILEMAP QUE LE CORRESPONDA (POR DEFECTO SALA 1)
	initMap() {
		const mapa = this.map = this.make.tilemap({
			key: 'sala1'
		});

		// TILE IMAGE
		const tiles = mapa.addTilesetImage('Forest', 'tiles');

		// TILE LAYERS
		this.groundLayer = this.map.createLayer('Suelo', tiles);
		this.foregroundLayer = this.map.createLayer('Bordes', tiles);
		this.puertaSolida = this.physics.add.image(576, 16, 'puertaSala1');
		this.puerta = this.map.createLayer('Puerta2', tiles);
		this.objetos = this.map.createLayer('Objetos', tiles);
		this.borderTrees = this.map.createLayer('bordeArboles', tiles);

		// SE LE AÑADEN COLISIONES A ALGUNOS LAYERS
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

		// SE AÑADE PROFUNDIDAD A LAS DISTINTAS CAPAS
		this.puertaSolida.setDepth(3);
		this.player.setDepth(2);
		this.enemyPool._group.setDepth(2);
		this.borderTrees.setDepth(3);
		this.foregroundLayer.setDepth(3);
	}

	// FUNCION PARA INICIAR LAS POOLS Y DIBUJAR AL PERSONAJE
	initPlayerAndPools(data) {
		
		// EN FUNCION DE LA SALA EN LA QUE SE ENCUENTRE DIBUJA EN UN SITIO ESPECIFICO AL PERSONAJE Y CON UNAS DETERMINADAS ESTADISITICAS
        if(data.hasOwnProperty('gate')){
            this.player = new Character(this, data.gate.x, data.gate.y, null, data.player.getSpeed(), data.player.getHp(), data.player.getMaxHp(), data.player.getWallet(),  data.player.getCadence(), data.player.getBulletDmg());
        }else{
            this.player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, null, 150, 4, 4, 0, 400, 20);
        }
		this.player.body.onCollide = true;

		// SE CREAN LAS POOLS Y SE LLENAN
		this.bulletPool = new BulletPool(this, 150, this.player.getBulletDmg())
		this.powerUpPool = new PowerUpPool(this, 6)
		this.enemyPool = new EnemyPool(this, 15);
		this.coinPool = new CoinPool(this, 20);
		this.foodPool = new FoodPool(this, 20);

		this.enemyPool.fillPool(25, this.player, this.namescene);

		this.physics.add.collider(this.bulletPool._group, this.enemyPool._group, (obj1, obj2) => {
			obj1.hit(obj2)
		}, (obj1, obj2) => !obj2.isDead());

		this.physics.add.overlap(this.coinPool._group, this.player, (obj1, obj2) => {
			obj1.collect(obj2);
			this.events.emit('earnCoin', obj2.getWallet());
		});

		this.physics.add.overlap(this.powerUpPool._group, this.player, (obj1, obj2) => {
			obj2.collectPowerUp(obj1);
		}, (obj1, obj2) => !obj1.isEnabled());
		
		this.physics.add.overlap(this.foodPool._group, this.player, (obj1, obj2) => {
			obj1.collect(obj2);
			this.events.emit('addScore', obj2.getHp());
		});

		this.physics.add.collider(this.enemyPool._group, this.player, (obj1, obj2) => {
			obj1.attack(obj2);
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.getDash()
		);

	}

	// FUNCION PARA SPAWNEAR LOS ENEMIGOS EN LAS ESQUINAS DE LA ESCENA
	spawnInBounds() {

		const xPos = [0, this.sys.game.canvas.width]
		const yPos = [0, this.sys.game.canvas.height]

		const randX = Phaser.Math.RND.between(0, 1);
		const randY = Phaser.Math.RND.between(0, 1);

		const randNum = Phaser.Math.RND.between(1, 15);

		// console.log('SPAWN ENEMY RAND NUM:', randNum)

		if (randNum < 7) {
			this.enemyPool.spawnGob(xPos[randX], yPos[randY])
		} else if (randNum > 7 && randNum < 11) {
			this.enemyPool.spawnWolf(xPos[randX], yPos[randY])
		} else if (randNum > 11 && randNum < 14) {
			this.enemyPool.spawnSpectre(xPos[randX], yPos[randY])
		} else {
			this.enemyPool.spawnCyclops(xPos[randX], yPos[randY])
		}

		//this.enemyPool.spawn(xPos[randX], yPos[randY]);
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

	// FUNCION PARA INICIALIZAR MODO PELEA
	initLevelFightMode(){
		if(!this.isMuted){
			this.banda.play();
		}
		this.spawnMeiga = false;
		this.initTimers(true);
	}

	// FUNCION PARA INICIALIZAR MODO EXPLORACION
	initLevelFreeMode(){
		if(!this.isMuted){
			this.explorationSong.play();
		}
		this.abrirPuertas()
		if(this.namescene === 'level4'){
			this.cofre.destroy();
		}
	}

	// FUNCION PARA MOSTRAR ESCENA DE PERDER EN EL JUEGO
	gameOver() {
		this.cameras.main.fadeOut(500);
		this.cameras.main.once("camerafadeoutcomplete", function () {
			this.scene.start('game_over', { level: this.namescene, mute: this.isMuted });
			this.scene.stop('UIScene')
			this.banda.stop()
		}, this);
	}

	// FUNCION PARA CUANDO SE TERMINA EL NIVEL, SE CAMBIA LA MUSICA Y SE ABRE SU DETERMINADA PUERTA
	completeLevel(){

		this.sound.removeByKey('fightSong');
		
		const appearEffect = this.sound.add("appearEffect", {
			volume: 0.1
		});
		
		appearEffect.play();

		appearEffect.once('complete', () => {
			this.explorationSong.play();
		});

		this.events.emit('levelComplete');
		this.puerta.setVisible(false);
		this.puertaSolida.destroy();
	}

	// FUNCION PARA AUMENTAR LA VIDA DEL PERSONAJE
	incrementPlayerLife(hp){
		this.player.incrementHp();
		this.player.setHp(hp);
	}

	// FUNCION PARA CAMBIAR LA FRECUENCIA DE LAS OLEADAS
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
		if (currDelay > 300) {
			this.enemySpawnTimer.reset({
				delay: currDelay - this.freqFactor,
				callback: this.spawnInBounds,
				callbackScope: this,
				loop: true
			})
		} else {
			this.enemySpawnTimer.remove();
			this.freqTimer.remove();
			this.wavesFinished = true;
		}
	}

	// FUNCION PARA OBTENER LA ALTURA DEL JUEGO
	getGameHeight() {
		return this.game.config.height
	}

	// FUNCION PARA OBTENER LA ANCHURA DEL JUEGO
	getGameWidth() {
		return this.game.config.width
	}

	// FUNCION PARA ACTUALIZAR EL CONTADOR DE OLEADAS
	updateWaveCount(){
		const remaining = (this.freqChangeTime - this.freqTimer.getElapsed()) / 1000;

		if (this.lastSec != remaining) {
			this.events.emit('changeCount', remaining.toFixed(0));
		}

		this.lastSec = remaining
	}

	// FUNCION PARA AÑADIR LA MEIGA EN LA ESCENA
    addMeiga() {

		this.spawnMeiga = true;
		const meiga = this.add.sprite(960, 250, 'meiga').setScale(1.6);
		this.anims.create({
			key: 'meigaState',
			frames: this.anims.generateFrameNumbers('meiga', { start: 0, end: 3 }),
			frameRate: 3,
			repeat: -1
		});
		meiga.play('meigaState');
		const e_key = this.add.sprite(957, 220, 'e_key');
		this.anims.create({
			key: 'E_Press',
			frames: this.anims.generateFrameNumbers('e_key', { start: 0, end: 2 }),
			frameRate: 2,
			repeat: -1
		});
		e_key.play('E_Press');
	}

	// FUNCION PARA INDICAR LA POSICION DEL PERSONAJE
	setPlayerPosition(x, y, level){
		this.scene.get(level).player.stopHorizontal();
		this.scene.get(level).player.stopVertical();
		this.scene.get(level).player.x = x;
		this.scene.get(level).player.y = y;
	}

	abrirPuertas(){

	}

	// FUNCION QUE INDICA SI TODOS LOS NIVELES HAN SIDO ACABADOS
	allLevelsComplete(){
		return LevelScene.progress.level1 && LevelScene.progress.level2 && LevelScene.progress.level3
				&& LevelScene.progress.level4;
	}

	// FUNCION PARA PONER LA MUSICA
	setMusic(){
		this.banda = this.sound.add("fightSong", {
			volume: 0.1,
			loop: true
		});
	}

}