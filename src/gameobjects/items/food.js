import Item from "./item";

// CLASE DE LOS MUSLITOS

export default class Food extends Item{

    constructor(scene, x, y, value){
        super(scene, x, y, 'food');
        this.value = value
        this.collected = false;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);  
        this.setScale(0.8);

        this.scene.anims.create({
            key: 'food_animation',
            frames: this.scene.anims.generateFrameNumbers('food', { start: 0, end: 4}),
            frameRate: 8,
            repeat: -1
        })

        this.play('food_animation')
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt)
    }

    // FUNCION PARA CUANDO LO RECOLECTA EL PERSONAJE
    collect(character){

        if(!this.collected){
            this.scene.sound.add("takefood_audio", {
                volume: 0.15,
                loop: false
            }).play();

            super.collect();
            this.collected = true;
            character.collectFood(this.value);
            this.scene.foodPool.release(this);
        }
    }

    // DESAPARECE EL MUSLITO
    deSpawn(){
        this.scene.foodPool.release(this);
    }


}