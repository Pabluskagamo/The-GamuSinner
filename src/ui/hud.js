import HealthPoint from "./healthpoint";

export default class Hud extends Phaser.Scene{
    constructor(){
        super('UIScene');
    }


    preload() {
		this.load.spritesheet('healthbar', './assets/ui/Hearts/PNG/animated/border/heart_animated_2.png', { frameWidth: 17, frameHeight: 17 })
        this.load.image('coinhud', '/assets/items/coin.png');
        this.load.spritesheet('tripleShotHud', './assets/powerups/Tripleshoot.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('eightDirShotHud', './assets/powerups/Multishoot.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('multipleDirfreezingShotectionShotHud', './assets/powerups/FreezeArrow.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('bouncingShotHud', './assets/powerups/BouncingArrow.png', { frameWidth: 32, frameHeight: 32 })
	}

    create ()
    {   
        //VIDA
        this.uiLive = [new HealthPoint(this, 960, 90), new HealthPoint(this, 990, 90),
            new HealthPoint(this, 1020, 90), new HealthPoint(this, 1050, 90), new HealthPoint(this, 1080, 90), new HealthPoint(this, 1110, 90)]


        //MONEDAS
        this.numMonedas = this.add.text(1044, 115, 'X 0', { fontFamily: 'MedievalSharp-Regular' });
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
            }
        }
        
        //CONTADOR TIEMPO OLEADA
        this.countdown = this.add.text(555, 75, '00:20',  { fontFamily: 'MedievalSharp-Regular' });
        this.countdown.setFontSize(24);

        //  Grab a reference to the Game Scene
        let levelGame = this.scene.get('level');

        //  Listen for events from it
        levelGame.events.on('addScore', function (hp) {
            this.updateHealthUi(hp)
        }, this);

        levelGame.events.on('changeCount', function (newTime) {
            this.countdown.setText('00:'+ (newTime < 10 ? '0' : '') +newTime)
        }, this);

        levelGame.events.on('levelComplete', function () {
            this.countdown.setText('!Has completado todas las oleadas!')
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

        levelGame.events.on('updatePowerupCount', function (key, newTime) {
            if(newTime !== -1){
                this.updatePowerUpCount(key, newTime)
            }else{
                // this.powerUpTimer.setVisible(false)
                // this.clearPowerUps()
            }
        }, this);   
        
        levelGame.events.on('endPowerUpTime', function (key) {
            this.clearPowerUp(key)
        }, this);  
    }

    updateHealthUi(hp) {
		//setscrollfactor(0, 0) para que cuando se 
		//mueva la camara no se mueva el HUD


		for (let i = 1; i <= 6; i++) {
			if (i <= hp) {
				this.uiLive[i - 1].full()
			} else {
				this.uiLive[i - 1].empty()
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
            pow.img.x = currentX;
            pow.img.y = currentY + separationY;
            pow.img.setVisible(true)

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
        pow.img.setVisible(false);
        pow.text.setVisible(false);

        const index = this.powerUpsList.indexOf(key);
        this.powerUpsList.splice(index, 1);

        this.updatePowerUpsHud();
    }


}