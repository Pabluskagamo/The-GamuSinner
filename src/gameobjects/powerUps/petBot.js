import PowerUp from "./powerUp"

// POWER-UP DE LA MASCOTA

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

    // FUNCION PARA SABER SI ES LA MASCOTA
    isPet() {
        return true;
    }

    // FUNCION PARA QUE SIGA AL PERSONAJE
    run () {
        this.scene.player.setPet(this.pet)
    }

    // FUNCION PARA OCULTAR LA MASCOTA
    hidePet() {
        this.pet.hide()
    }
}