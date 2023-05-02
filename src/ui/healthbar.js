export default class HealthBar {

    constructor (scene, x, y, hp)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.hp = hp
        this.value = 460;
        this.p = 460;

        this.draw();

        scene.add.existing(this.bar);
    }

    decrease (amount)
    {
        const proporcion = amount / this.hp;

        if(this.p - (this.value * proporcion) > 0){
            this.p -= (this.value * proporcion);
        }else{
            this.p = 0
        }

        this.draw();

        console.log("[HUD] Vida al", this.p/this.value)

        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();

        //Border
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x + 2, this.y + 2, 465, 16);

        //  Health
        this.bar.fillStyle(0xff0000);
        this.bar.fillRect(this.x + 5, this.y + 4, this.p, 10);
    }

}