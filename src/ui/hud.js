import dialogBox from "../dialogs/dialogBox";
import HealthBar from "./healthbar";
import HealthPoint from "./healthpoint";

//  ESCENA DE HUD QUE CONTIENE EL TEMPORIZADOR, Nº MONEDAS, POWER-UPS, GUARDADO DE POWER-UP, VIDA DEL PERSONAJE Y VIDA DEL BOSS

export default class Hud extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    init(data) {
        // this.maxHp = data.maxHp;
        // this.hp = data.hp;
        console.log("INI SETTINGS HUD",data)
        this.playerData = data.playerData;
        this.level = data.level
        this.isBoss = data.bossLevel
    }

    preload() {
        this.load.spritesheet('healthbar', './assets/ui/Hearts/PNG/animated/border/heart_animated_2.png', { frameWidth: 17, frameHeight: 17 })
        this.load.image('coinhud', '/assets/items/coin.png');
        this.load.image('dash_hud', '/assets/powerups/DashEffect.png');
        this.load.image('pwpanel', './assets/ui/powerUpPanel.png');
        this.load.spritesheet('tripleShotHud', './assets/powerups/Tripleshoot.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('eightDirShotHud', './assets/powerups/Multishoot.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('multipleDirfreezingShotectionShotHud', './assets/powerups/FreezeArrow.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('bouncingShotHud', './assets/powerups/BouncingArrow.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('petpowerHud', './assets/powerups/pet.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('multipleDirectionShotHud', './assets/powerups/Multishoot.png', { frameWidth: 32, frameHeight: 32 })
    }

    create() {
        // VIDA
        this.initHearthsHud()

        // MONEDAS
        this.numMonedas = this.add.text(1044, 115, 'X 0', { fontFamily: 'MedievalSharp-Regular' });
        this.numMonedas.setText('X ' + this.playerData.coins);
        this.numMonedas.setFontSize(20);
        const coinHud = this.add.image(1110, 123, 'coinhud')
        coinHud.setCrop(0, 0, 16, 16)
        coinHud.setScale(1.5)

        // POWER-UPS
        this.powerUpsList = []
        this.powerUpsImgs = {
            tripleShot: {
                img: this.add.image(-150, -150, 'tripleShotHud'),
                text: this.add.text(-150, -150, '', { fontFamily: 'MedievalSharp-Regular' })
            },
            eightDirShot: {
                img: this.add.image(-150, -150, 'eightDirShotHud'),
                text: this.add.text(-150, -150, '', { fontFamily: 'MedievalSharp-Regular' })
            },
            multipleDirfreezingShotectionShot: {
                img: this.add.image(-150, -150, 'multipleDirfreezingShotectionShotHud'),
                text: this.add.text(-150, -150, '', { fontFamily: 'MedievalSharp-Regular' })
            },
            bouncingShot: {
                img: this.add.image(-150, -150, 'bouncingShotHud'),
                text: this.add.text(-150, -150, '', { fontFamily: 'MedievalSharp-Regular' })
            },
            petpower: {
                img: this.add.image(-150, -150, 'petpowerHud'),
                text: this.add.text(-150, -150, '', { fontFamily: 'MedievalSharp-Regular' })
            },
            multipleDirectionShot: {
                multiple: true,
                imgs: [this.add.image(-150, -150, 'tripleShotHud'), this.add.image(-150, -150, 'eightDirShotHud')],
                text: this.add.text(-150, -150, '', { fontFamily: 'MedievalSharp-Regular' })
            },
            dash_char: {
                img: this.add.image(-150, -150, 'dash_hud').setScale(0.85),
                text: this.add.text(-150, -150, '', { fontFamily: 'MedievalSharp-Regular' })
            }
        }

        // POWER-UP SAVE PANEL
        this.powerUpPanel = this.add.image(990, 123, 'pwpanel');

        // CONTADOR TIEMPO OLEADA
        this.countdown = this.add.text(555, 75, '00:20', { fontFamily: 'MedievalSharp-Regular' });
        this.countdown.setFontSize(24);

        // OBTIENE UNA REFERENCIA DE LA ESCENA DEL JUEGO (NIVEL EN EL QUE TE ENCUENTRAS)
        let levelGame = this.scene.get(this.level);

        if(this.isBoss){
            // BOSS HEALTH BAR.
            this.healthBar = null
            this.countdown.setText("Demonboss").setVisible(false)
            this.countdown.x-=20;

            // RECIBE DAÑO DEL BOSS
            levelGame.events.on('bossHit', function (hp) {
                if(this.healthBar != null){
                    this.healthBar.decrease(hp)
                }
            }, this);

            // EL BOSS APARECE EN LA ESCENA
            levelGame.events.on('bossStart', function (hp) {
                this.healthBar = new HealthBar(this, 370, 110, hp);
                this.countdown.setVisible(true)
            }, this);

        }


        //  ESCUCHA EVENTOS DE LA ESCENA REFERENCIADA
        // AÑADE VIDA AL PERSONAJE
        levelGame.events.on('addScore', function (hp) {
            this.updateHealthUi(hp)
        }, this);

        // CAMBIA EL TEMPORIZADOR
        levelGame.events.on('changeCount', function (newTime) {
            this.countdown.setText('00:' + (newTime < 10 ? '0' : '') + newTime)
        }, this);

        // TEMPORIZADORES PARA CUANDO COMPLETAS UN NIVEL
        this.fadeTime = 0;

        this.faded = false;

        // SE ACABA EL NIVEL
        levelGame.events.on('levelComplete', function () {
            this.countdown.x -= 150
            this.countdown.setText('!Has completado todas las oleadas!');
            if (!this.faded) {
                this.fadeTime = 0;
                this.faded = true;
            }
        }, this);

        // RECOLECTA UNA MONEDA
        levelGame.events.on('earnCoin', function (coins) {
            this.numMonedas.setText('X ' + coins)
        }, this);

        // RECOLECTA UN POWER-UP
        levelGame.events.on('collectPowerUp', function (type) {

            if (!this.powerUpsList.includes(type)) {
                this.powerUpsList.push(type)
                this.updatePowerUpsHud()
            }
        }, this);

        // EL PERSONAJE DASHEA
        levelGame.events.on('characterDash', function () {
            this.powerUpsList.push("dash_char")
            this.updatePowerUpsHud()
        }, this);

        // ACTUALIZA EL CONTADOR DEL POWER-UP
        levelGame.events.on('updatePowerupCount', function (key, newTime) {
            if (newTime !== -1) {
                this.updatePowerUpCount(key, newTime)
            } else {
                // this.powerUpTimer.setVisible(false)
                // this.clearPowerUps()
            }
        }, this);

        // EL DASHEO DEL PERSONAJE TERMINA
        levelGame.events.on('characterDashEnd', function () {
            this.clearPowerUp("dash_char")
        }, this);

        // TERMINA EL EFECTO DEL POWER-UP
        levelGame.events.on('endPowerUpTime', function (key) {
            this.clearPowerUp(key)
        }, this);

        // GUARDA UN POWER-UP
        levelGame.events.on('savePowerUp', function (key) {
            this.savePowerUp(key)
        }, this);

        // UTILIZA EL POWER-UP GUARDADO
        levelGame.events.on('usePowerUpInventory', function () {
            this.usePowerUpSaved()
        }, this);

        // OBTIENE UNA REFERENCIA DE LA ESCENA DEL JUEGO (ESTADISTICAS)
        let statsGame = this.scene.get('stats');

        // GASTA LAS MONEDAS
        statsGame.events.on('spentcoins', this.spendCoins, this);

        // INCREMENTA LA VIDA DEL PERSONAJE
        statsGame.events.on('incrementLife', this.incrementHearths, this);
        
        // PASAS DE NIVEL
        levelGame.events.on('passLevel', this.passLevel, this);

        // ELIMINA LOS EVENTOS INDICADOS CUANDO SE HACE UNA LLAMADA DE CERRADO
        this.events.on('shutdown', ()=>{
            statsGame.events.removeListener('spentcoins', this.spendCoins, this)
            statsGame.events.removeListener('incrementLife', this.incrementHearths, this)
            levelGame.events.removeListener('passLevel', this.passLevel, this);
        }, this);

        this.updateHealthUi(this.playerData.hp);
    }
    update(t, dt) {
        // GENERA UN EFECTO DE DESVANECIMIENTO AL TEXTO
        if (this.faded) {
            if (this.fadeTime < 3500) {
                this.fadeTime = this.fadeTime + (t / 1000);
            } else {
                this.tweens.add({
                    targets: this.countdown,
                    alpha: 0,
                    duration: 2000,
                    ease: 'Linear'
                });
            }
        }
        super.update(t, dt);
    }

    // FUNCION CUANDO PASAS DE NIVEL PARA REINICIAR LA ESCENA
    passLevel(data){
        this.scene.restart(data);
    }

    // FUNCION PARA INCREMENTAR LA VIDA DEL PERSONAJE
    incrementHearths(hp){
        this.uiLive.unshift(new HealthPoint(this, this.uiLive[0].x - 30, 90))
        console.log("SUBIR HP", this.uiLive[0].x)
        this.playerData.maxHp++;
        this.playerData.hp = hp;
        this.updateHealthUi(this.playerData.hp);
    }

    // FUNCION PARA ACTUALIZAR LAS MONEDAS EN EL HUD AL SER GASTADAS
    spendCoins(coins){
        this.numMonedas.setText('X ' + coins)
    }

    // FUNCION QUE PINTA DE LOS CORAZONES
    initHearthsHud() {
        let lastPosX = 1110;
        this.uiLive = []

        for (let i = 0; i < this.playerData.maxHp; i++) {
            this.uiLive.unshift(new HealthPoint(this, lastPosX, 90));
            lastPosX -= 30;
        }
    }

    // FUNCION QUE ACTUALIZA LA VIDA DEL PERSONAJE
    updateHealthUi(hp) {
        //setscrollfactor(0, 0) para que cuando se mueva la camara no se mueva el HUD

        for (let i = 1; i <= this.playerData.maxHp; i++) {

            if (i <= hp) {
                this.uiLive[i - 1].full()
            } else if (i <= this.playerData.maxHp) {
                this.uiLive[i - 1].empty()
            }
        }
    }

    // FUNCION QUE ACTUALIZA LOS POWER-UPS EN EL HUD
    updatePowerUpsHud() {
        const separationX = 20;
        const separationY = 30;
        let currentX = 1025
        let currentY = 130

        this.powerUpsList.forEach(p => {
            const pow = this.powerUpsImgs[p];

            if (!pow.multiple) {
                pow.img.x = currentX;
                pow.img.y = currentY + separationY;
                pow.img.setVisible(true)
            } else {
                let imgSepCombo = 0
                pow.imgs.forEach(img => {
                    img.x = currentX - imgSepCombo;
                    img.y = currentY + separationY;
                    img.setVisible(true)
                    imgSepCombo += (separationX + 10);
                })
            }

            pow.text.x = currentX + separationX;
            pow.text.y = currentY + separationY - 8;
            pow.text.setVisible(true)
            currentY += separationY;
        })
    }

    // FUNCION QUE ACTUALIZA EL CONTADOR DE LOS POWER-UPS
    updatePowerUpCount(key, newTime) {
        const pow = this.powerUpsImgs[key];
        pow.text.setText('00:' + (newTime < 10 ? '0' : '') + newTime);
    }

    // FUNCION PARA ELIMINAR EL EFECTO DEL POWER-UP
    clearPowerUp(key) {
        console.log("SE ACABA EL POWER UP", key)

        const pow = this.powerUpsImgs[key];

        pow.text.setVisible(false);

        if (!pow.multiple) {
            pow.img.setVisible(false);
        } else {
            pow.imgs.forEach(img => {
                img.setVisible(false);
            })
        }

        const index = this.powerUpsList.indexOf(key);
        this.powerUpsList.splice(index, 1);

        this.updatePowerUpsHud();
    }

    // FUNCION QUE GUARDA EL POWER-UP
    savePowerUp(key) {
        const img_key = key + 'Hud'

        this.savedPowerUp = this.add.image(990, 123, img_key)
    }

    // FUNCION PARA UTILIZAR EL POWER-UP GUARDADO
    usePowerUpSaved() {
        if (this.savedPowerUp) {
            this.savedPowerUp.destroy();
        }
    }

    getPowerUps(){
        return this.powerUpsList;
    }


}