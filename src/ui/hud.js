import HealthPoint from "./healthpoint";

export default class Hud extends Phaser.Scene{
    constructor(){
        super('UIScene');
    }


    preload() {
		this.load.spritesheet('healthbar', './assets/ui/Hearts/PNG/animated/border/heart_animated_2.png', { frameWidth: 17, frameHeight: 17 })
        this.load.image('coinhud', '/assets/items/coin.png');
	}

    create ()
    {   
        //this.add.image(1022, 87, 'hud_hp');
        this.uiLive = [new HealthPoint(this, 960, 90), new HealthPoint(this, 990, 90),
            new HealthPoint(this, 1020, 90), new HealthPoint(this, 1050, 90), new HealthPoint(this, 1080, 90), new HealthPoint(this, 1110, 90)]

        this.numMonedas = this.add.text(1044, 115, 'X 0');
        this.numMonedas.setFontSize(20);

        const coinHud = this.add.image(1110, 123, 'coinhud')
        coinHud.setCrop(0, 0, 16, 16)
        coinHud.setScale(1.5)
        

        this.countdown = this.add.text(this.sys.game.canvas.width/2, 75, '00:20');
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

        levelGame.events.on('earnCoin', function (coins) {
            this.numMonedas.setText('X ' + coins)
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


}