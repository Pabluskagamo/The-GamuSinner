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
        this.p -= (this.value * proporcion);
       
        this.draw();

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