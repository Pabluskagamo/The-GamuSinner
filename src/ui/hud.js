import dialogBox from "../dialogs/dialogBox";
import HealthPoint from "./healthpoint";

export default class Hud extends Phaser.Scene{
    constructor(){
        super('UIScene');
    }

    init(data){
        // this.maxHp = data.maxHp;
        // this.hp = data.hp;
        this.playerData = data.playerData;
        this.level = data.level
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
        this.load.spritesheet('multipleDirectionShotHud', './assets/powerups/Multishoot.png', { frameWidth: 32, frameHeight: 32 })
	}

    create ()
    {   
        new dialogBox(this,200,200, 500);
        //VIDA
        this.initHearthsHud()

        //MONEDAS
        this.numMonedas = this.add.text(1044, 115, 'X 0', { fontFamily: 'MedievalSharp-Regular' });
        this.numMonedas.setText('X ' + this.playerData.coins);
        this.numMonedas.setFontSize(20);
        const coinHud = this.add.image(1110, 123, 'coinhud')
        coinHud.setCrop(0, 0, 16, 16)
        coinHud.setScale(1.5)

        //POWERUPS
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
            multipleDirectionShot: {
                multiple: true,
                comboKeys: ["tripleShot", "eightDirShot"],
                text: this.add.text(-150, -150, '', { fontFamily: 'MedievalSharp-Regular' })
            },
            dash_char: {
                img: this.add.image(-150, -150, 'dash_hud').setScale(0.85),
                text: this.add.text(-150, -150, '', { fontFamily: 'MedievalSharp-Regular' })
            }
        }

        //Power Up Save Panel
        this.powerUpPanel = this.add.image(990, 123, 'pwpanel'),

        //CONTADOR TIEMPO OLEADA
        this.countdown = this.add.text(555, 75, '00:20',  { fontFamily: 'MedievalSharp-Regular' });
        this.countdown.setFontSize(24);

        //  Grab a reference to the Game Scene
        let levelGame = this.scene.get(this.level);

        //  Listen for events from it
        levelGame.events.on('addScore', function (hp) {
            this.updateHealthUi(hp)
        }, this);

        levelGame.events.on('changeCount', function (newTime) {
            this.countdown.setText('00:'+ (newTime < 10 ? '0' : '') +newTime)
        }, this);

        this.fadeTime = 0;

        this.faded = false;

        levelGame.events.on('levelComplete', function () {
            this.countdown.x -= 150
            this.countdown.setText('!Has completado todas las oleadas!');
            if(!this.faded){
                this.fadeTime = 0;
                this.faded = true;
            }
        }, this);

        levelGame.events.on('earnCoin', function (coins) {
            this.numMonedas.setText('X ' + coins)
        }, this);

        levelGame.events.on('collectPowerUp', function (type) {
            
            if(!this.powerUpsList.includes(type)){
                this.powerUpsList.push(type)
                this.updatePowerUpsHud()
            }
        }, this);

        levelGame.events.on('characterDash', function () {
            this.powerUpsList.push("dash_char")
            this.updatePowerUpsHud()
        }, this); 

        levelGame.events.on('updatePowerupCount', function (key, newTime) {
            if(newTime !== -1){
                this.updatePowerUpCount(key, newTime)
            }else{
                // this.powerUpTimer.setVisible(false)
                // this.clearPowerUps()
            }
        }, this);

        levelGame.events.on('characterDashEnd', function () {
            this.clearPowerUp("dash_char")
        }, this); 
        
        levelGame.events.on('endPowerUpTime', function (key) {
            this.clearPowerUp(key)
        }, this);

        levelGame.events.on('savePowerUp', function (key) {
            this.savePowerUp(key)
        }, this);

        levelGame.events.on('usePowerUpInventory', function () {
            this.usePowerUpSaved()
        }, this);

        let statsGame = this.scene.get('stats');

        statsGame.events.on('spentcoins', function (coins) {
            this.numMonedas.setText('X ' + coins)
        }, this);

        statsGame.events.on('incrementLife', function (hp) {
            this.uiLive.unshift(new HealthPoint(this, this.uiLive[0].x-30, 90))
            console.log("SUBIR HP", this.uiLive[0].x)
            this.playerData.maxHp++;
            this.playerData.hp = hp;
            this.updateHealthUi(this.playerData.hp);
        }, this);

        this.updateHealthUi(this.playerData.hp);
    }
    update(t){
        if(this.faded){
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
    }


    initHearthsHud(){
        let lastPosX = 1110;
        this.uiLive = []

        for(let i = 0; i < this.playerData.maxHp; i++){
            this.uiLive.unshift(new HealthPoint(this, lastPosX, 90));
            lastPosX-=30;
        }
    }

    updateHealthUi(hp) {
		//setscrollfactor(0, 0) para que cuando se 
		//mueva la camara no se mueva el HUD

		for (let i = 1; i <= this.playerData.maxHp; i++) {
        
			if (i <= hp) {
				this.uiLive[i-1].full()
			} else if(i <= this.playerData.maxHp){
				this.uiLive[i-1].empty()
			}
		}
	}

    updatePowerUpsHud(){
        const separationX = 20;
        const separationY = 30;
        let currentX = 1025
        let currentY = 130

        this.powerUpsList.forEach(p=>{
            const pow = this.powerUpsImgs[p];

            if(!pow.multiple){
                pow.img.x = currentX;
                pow.img.y = currentY + separationY;
                pow.img.setVisible(true)
            }else{
                let imgSepCombo = 0
                pow.comboKeys.forEach(k=>{
                    const comboPow = this.powerUpsImgs[k];
                    comboPow.img.x = currentX - imgSepCombo;
                    comboPow.img.y = currentY + separationY;
                    comboPow.img.setVisible(true)
                    imgSepCombo += (separationX + 10);
                })
            }

            pow.text.x = currentX + separationX;
            pow.text.y = currentY + separationY - 8;
            pow.text.setVisible(true)
            currentY += separationY;
        })
    }

    updatePowerUpCount(key, newTime){
        const pow = this.powerUpsImgs[key];
        pow.text.setText('00:'+ (newTime < 10 ? '0' : '') +newTime);
    }

    clearPowerUp(key){
        console.log("SE ACABA EL POWER UP", key)

        const pow = this.powerUpsImgs[key];
        
        pow.text.setVisible(false);
        
        if(!pow.multiple){
            pow.img.setVisible(false);
        }else{
            pow.comboKeys.forEach(k=>{
                const comboPow = this.powerUpsImgs[k];
                comboPow.img.setVisible(false);
            })
        }

        const index = this.powerUpsList.indexOf(key);
        this.powerUpsList.splice(index, 1);

        this.updatePowerUpsHud();
    }

    savePowerUp(key){
        const img_key = key + 'Hud'
        
        this.savedPowerUp = this.add.image(990, 123, img_key)
    }

    usePowerUpSaved(){
        if(this.savedPowerUp){
            this.savedPowerUp.destroy();
        }
    }


}