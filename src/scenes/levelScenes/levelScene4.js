import LevelScene from "../levelScene";

// ESCENA QUE CORRESPONDE AL NIVEL 4 DE GALICIA

export default class LevelScene4 extends LevelScene {
    constructor() {
        super('level4')
    }

    // FUNCION PARA INICIALIZAR EL TILEMAP DEL NIVEL 4
    initMap() {
        const mapa = this.map = this.make.tilemap({
            key: 'sala4'
        });

        // TILE IMAGE
        const tilesFaerie = mapa.addTilesetImage('FairyForest', 'tileFaerieForest');

        // TILE LAYERS
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

        // COLISIONES
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

        this.physics.add.collider(this.bulletPool._group, this.topTree, (obj1, obj2) => {
            obj1.reboundOrRelease()
        });

        this.physics.add.collider(this.bulletPool._group, this.wall, (obj1, obj2) => {
            obj1.reboundOrRelease()
        });

        this.physics.add.collider(this.bulletPool._group, this.puertaSolida, (obj1, obj2) => {
            obj1.reboundOrRelease()
        });

        // PROFUNDIDAD
        this.puertaSolida.setDepth(3);
        this.player.setDepth(2);
        this.enemyPool._group.setDepth(2);
        this.topTree.setDepth(3);
        this.wall.setDepth(3);
        this.treeborder1.setDepth(3);
        this.treeborder2.setDepth(3);
        this.foregroundLayer1.setDepth(3);
        this.foregroundLayer2.setDepth(3);
        this.puerta1.setDepth(3);

        // TIEMPO POR SI RECOGES EL DINERO DEL COFRE
        this.fadeTime = 0;
        this.faded = false;
    }

    // ACTUALIZA EL TIEMPO DE DESVANECIMIENTO
    update(t) {
        super.update(t)

        if (this.faded) {
            if (this.fadeTime < 3500) {
                this.fadeTime = this.fadeTime + (t / 1000);
            } else {
                this.tweens.add({
                    targets: this.getMoney,
                    alpha: 0,
                    duration: 2000,
                    ease: 'Linear'
                });
            }
        }

    }

    // FUNCION PARA CUANDO SE COMPLETE EL NIVEL SE AÑADA LA MUSICA, SE ABRAN LAS PUERTAS Y APAREZCA EL PODER RECOGER EL COFRE
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

        this.e_key = this.add.sprite(1008, 310, 'e_key');
        this.e_key.setDepth(4);
        this.anims.create({
            key: 'E_Press',
            frames: this.anims.generateFrameNumbers('e_key', { start: 0, end: 2 }),
            frameRate: 2,
            repeat: -1
        });
        this.e_key.play('E_Press');
    }

    // FUNCION PARA ABRIR LAS PUERTAS QUE LE CORRESPONDEN
    abrirPuertas() {
        this.puerta1.setVisible(false);
        this.puerta2.setVisible(false);
        this.puertaSolida.destroy();

        // AÑADE UNA ZONA INVISIBLE PARA QUE CUANDO LA TOQUES PASES EN ESTE CASO AL NIVEL 2
        const zonaInvisible = this.add.zone(0, 288, 10, 128);
        this.physics.add.existing(zonaInvisible);

        this.physics.add.overlap(this.player, zonaInvisible, () => {
            this.sound.removeByKey('explorationSong');
            this.sound.removeByKey('appearEffect');
            this.events.emit('passLevel', { playerData: this.player.getPlayerStats(), level: 'level2' });
            this.scene.start('level2', { player: this.player, gate: { x: this.sys.game.canvas.width - 80, y: this.player.y }, mute: this.isMuted });
        });

        // AÑADE EL COFRE
        this.cofre = this.add.zone(1008, 338, 30, 25);
        this.physics.add.existing(this.cofre);
        this.nearCofre = false;
        this.physics.add.overlap(this.player, this.cofre, (obj1, obj2) => {
            if (this.e.isDown && !this.nearCofre) {
                this.nearCofre = true
                this.getMoney = this.add.text(480, 75, 'Has encontrado 150 monedas!!!', { fontFamily: 'MedievalSharp-Regular' });
                this.getMoney.setFontSize(24);
                obj1.setWallet(obj1.getWallet() + 150);
                this.events.emit('earnCoin', obj1.getWallet());
                this.e_key.destroy();
            }
            if (!this.faded) {
                this.fadeTime = 0;
                this.faded = true;
            }
        });
    }

    // ESTABLECE LA MUSICA
    setMusic(){
		this.banda = this.sound.add("fightSong2", {
			volume: 0.1,
			loop: true
		});
	}


}