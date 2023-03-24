import HealthPoint from "./healthpoint";

export default class Hud extends Phaser.Scene{
    constructor(){
        super({ key: 'UIScene', active: true });
    }


    preload() {
		this.load.spritesheet('healthbar', '/assets/Hearts/PNG/animated/border/heart_animated_2.png', { frameWidth: 17, frameHeight: 17 })
        this.load.image('hud_hp', '/assets/ui/hud.png');
	}

    create ()
    {   
        this.add.image(1022, 87, 'hud_hp');
        this.uiLive = [new HealthPoint(this, 960, 90), new HealthPoint(this, 990, 90),
            new HealthPoint(this, 1020, 90), new HealthPoint(this, 1050, 90), new HealthPoint(this, 1080, 90)]


        //  Grab a reference to the Game Scene
        let levelGame = this.scene.get('level');

        //  Listen for events from it
        levelGame.events.on('addScore', function (hp) {
            this.updateHealthUi(hp)
        }, this);
        
    }

    updateHealthUi(hp) {
		//setscrollfactor(0, 0) para que cuando se 
		//mueva la camara no se mueva el HUD


		for (let i = 1; i <= 5; i++) {
			if (i <= hp) {
				this.uiLive[i - 1].full()
			} else {
				this.uiLive[i - 1].empty()
			}
		}
	}


}