import HealthPoint from "./healthpoint";

export default class Hud extends Phaser.Scene{
    constructor(){
        super('UIScene');
    }

    init(data){
        this.maxHp = data.maxHp;
        this.hp = data.hp;
    }

    preload() {
		this.load.spritesheet('healthbar', './assets/ui/Hearts/PNG/animated/border/heart_animated_2.png', { frameWidth: 17, frameHeight: 17 })
        this.load.image('coinhud', '/assets/items/coin.png');
        this.load.spritesheet('tripleShotHud', './assets/powerups/Tripleshoot.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('eightDirShotHud', './assets/powerups/Multishoot.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('multipleDirfreezingShotectionShotHud', './assets/powerups/FreezeArrow.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('bouncingShotHud', './assets/powerups/BouncingArrow.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('multipleDirectionShotHud', './assets/powerups/Multishoot.png', { frameWidth: 32, frameHeight: 32 })
	}

    create ()
    {   
        //VIDA
        this.initHearthsHud()

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
            },
            multipleDirectionShot: {
                multiple: true,
                comboKeys: ["tripleShot", "eightDirShot"],
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

        let statsGame = this.scene.get('stats');

        statsGame.events.on('spentcoins', function (coins) {
            this.numMonedas.setText('X ' + coins)
        }, this);

        statsGame.events.on('incrementLife', function (hp) {
            this.uiLive.unshift(new HealthPoint(this, this.uiLive[0].x-30, 90))
            console.log("SUBIR HP", this.uiLive[0].x)
            this.maxHp++;
            this.hp = hp;
            this.updateHealthUi(this.hp);
        }, this);

        this.updateHealthUi(this.hp);
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

        for(let i = 0; i < this.maxHp; i++){
            this.uiLive.unshift(new HealthPoint(this, lastPosX, 90));
            lastPosX-=30;
        }
    }

    updateHealthUi(hp) {
		//setscrollfactor(0, 0) para que cuando se 
		//mueva la camara no se mueva el HUD

		for (let i = 1; i <= this.maxHp; i++) {
        
			if (i <= hp) {
				this.uiLive[i-1].full()
			} else if(i <= this.maxHp){
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


}