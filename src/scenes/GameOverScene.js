import Phaser from 'phaser'

export default class GameOverScene extends Phaser.Scene {
	constructor() {
		super('game_overr');
	}

	preload() {
		this.load.image('background2', '/img/fondo_pixelart3.png');
		this.load.image('game_over', '/img/game_over.png');
		this.load.spritesheet('game_restart', '/assets/restart_sprite.png', {frameWidth: 480 , frameHeight: 170});
		}

	create() {
		this.anims.create({
			key: 'hoverRestart',
			frames: this.anims.generateFrameNumbers('game_restart', {start: 0, end: 2}),
			frameRate: 10,
			repeat: 0
		})
		this.add.image(0, 0, 'background2').setOrigin(0, 0).setScale(0.75);
		const title = this.add.image(this.sys.game.canvas.width/2, 230, 'game_over').setScale(0.65);
		
		const start = this.add.sprite(this.sys.game.canvas.width/2, 450, 'game_restart').setScale(0.35);
		start.setInteractive({cursor: 'pointer'});
		start.on('pointerover', () => {
			start.play('hoverRestart');
		});
	
		start.on('pointerout', () => {
			start.playReverse('hoverRestart');
		});	

		start.on('pointerup', ()=>{
			this.scene.start('mainScene');
		});

		this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                this.scene.start('mainScene');
            }
        });
	}
}
