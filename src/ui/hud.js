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
        this.powerUpTimer = this.add.text(1044, 145, '', { fontFamily: 'MedievalSharp-Regular' });
        this.powerUpTimer.setFontSize(15);
        this.powerUpTimer.setVisible(false);
        this.powerUpsList = []
        this.powerUpsImgs = {
            tripleShot: this.add.image(-150, -150, 'tripleShotHud'),
            eightDirShot: this.add.image(-150, -150, 'eightDirShotHud'),
            multipleDirfreezingShotectionShot: this.add.image(-150, -150, 'multipleDirfreezingShotectionShotHud'),
            bouncingShot: this.add.image(-150, -150, 'bouncingShotHud')
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
            this.powerUpTimer.setVisible(true)
            if(!this.powerUpsList.includes(type)){
                this.powerUpsList.push(type)
                this.updatePowerUpsIcons()
            }
        }, this);

        levelGame.events.on('UpdatePowerUpTimer', function (newTime) {
            if(newTime !== -1){
                this.powerUpTimer.setText('00:'+ (newTime < 10 ? '0' : '') +newTime)
            }else{
                this.powerUpTimer.setVisible(false)
                this.clearPowerUps()
            }
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

    updatePowerUpsIcons(){
        const separation = 30;
        let currentX = 1050

        this.powerUpsList.forEach(p=>{
            const img = this.powerUpsImgs[p];
            img.x = currentX - separation;
            img.y = 152;
            img.setVisible(true)
            currentX -= separation;
        })
    }

    clearPowerUps(){
        this.powerUpsList.forEach(p=>{
            const img = this.powerUpsImgs[p];
            img.setVisible(false)
        })

        this.powerUpsList = []
    }


}