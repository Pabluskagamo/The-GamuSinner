import PowerUp from "./powerUp"

export default class PetBot extends PowerUp{

    constructor(scene, x, y, petType){
        super(scene, x, y, "petpower", true)

        this.pet = petType
        
        this.scene.anims.create({
            key: 'petbot_animation',
            frames: this.scene.anims.generateFrameNumbers('petpower', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        })
        this.play('petbot_animation')
    }

    isPet() {
        return true;
    }

    run () {
        this.scene.player.setPet(this.pet)
    }

    hidePet() {
        this.pet.hide()
    }
/* 
    disable(reloaded){
        console.log("POWERUP DISABLED")
        this.hidePet()
        this.enabled = false
        this.scene.powerUpPool.release(this)

        if(!reloaded){
            this.scene.events.emit('endPowerUpTime', this.key);
        } else {
            this.timer.remove();
        }
    } */
}