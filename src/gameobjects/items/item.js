// PADRE DE TODOS LOS ITEMS

export default class Item extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, key){
        super(scene, x, y, key);
        this.tweenDur = 500
        this.totalTest = 500

        this.tweenConfig = {
            targets: this,
            alpha: {from:1, to: 0},
            duration: this.tweenDur,
            ease: 'Sine.easeInOut',
            yoyo: true,
            onComplete: () => {
                if(this.tweenDur > 0){
                    this.tweenDur -= 50;
                    this.totalTest += this.tweenDur
                    this.tweenBlink = this.scene.tweens.add({...this.tweenConfig, duration: this.tweenDur})
                }
            }
        }

        this.tweenActivated = false

    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)

        // COMPRUEBA PARA REALIZAR EL PARPADEO Y DESAPARICION
        if(!this.tweenActivated && this.despawnTimer){
            const remainingToDespawn = (10000 - this.despawnTimer.getElapsed()) / 1000
            
            if(remainingToDespawn.toFixed(1) == 5.6){
                this.tweenActivated = true
                this.tweenBlink = this.scene.tweens.add(this.tweenConfig)
            }
        }
    }

    // RECOLECTA EL ITEM
    collect(){
        if(this.despawnTimer){
            this.despawnTimer.remove();
        }
    }

    deSpawn(){
        //Method to overwrite
    }

    // INICIALIZA EL ITEM
    initItem(){
        this.despawnTimer = this.scene.time.addEvent({
			delay: 10000,
			callback: this.deSpawn,
			callbackScope: this,
			loop: false
		});
        this.collected = false;
    }

}