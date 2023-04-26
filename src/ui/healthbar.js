export default class HealthBar {

    constructor (scene, x, y)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = 600;
        this.p = 456 / 600;

        this.draw();

        scene.add.existing(this.bar);
    }

    decrease (amount)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 460, 16);

        //  Health

        // this.bar.fillStyle(0xffffff);
        this.bar.fillStyle(0xff0000);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);

        var d = Math.floor(this.p * this.value);

        console.log("ESTO ES LA DDDDD",d)

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

}