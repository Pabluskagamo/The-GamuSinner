import moveCharacter from "../gameobjects/instructions/moveCharacter"
import shootCharacter from "../gameobjects/instructions/shootCharacter"
import dashCharacter from "../gameobjects/instructions/dashCharacter"

export default class LevelScene extends Phaser.Scene {
	constructor() {
		super('instructions')
	}

	preload() {
		this.load.image('background_instructions', '/img/pergamino.png')
		this.load.image('controls', '/assets/controls.png');
		this.load.image('a_key', '/assets/keyboards/keyboard_key_a_pixel.png');
		this.load.image('b_key', '/assets/keyboards/keyboard_key_b_pixel.png');
		this.load.image('d_key', '/assets/keyboards/keyboard_key_d_pixel.png');
		this.load.image('down_key', '/assets/keyboards/keyboard_key_down_pixel.png');
		this.load.image('g_key', '/assets/keyboards/keyboard_key_g_pixel.png');
		this.load.image('left_key', '/assets/keyboards/keyboard_key_left_pixel.png');
		this.load.image('right_key', '/assets/keyboards/keyboard_key_right_pixel.png');
		this.load.image('s_key', '/assets/keyboards/keyboard_key_s_pixel.png');
		this.load.image('spacebar_key', '/assets/keyboards/keyboard_key_spacebar_pixel.png');
		this.load.image('tab_key', '/assets/keyboards/keyboard_key_tab_pixel.png');
		this.load.image('up_key', '/assets/keyboards/keyboard_key_up_pixel.png');
		this.load.image('w_key', '/assets/keyboards/keyboard_key_w_pixel.png');
		this.load.spritesheet('potion', '/assets/potions.png', { frameWidth: 16, frameHeight: 16 });
		this.load.image('granade', '/assets/granade.png');
		this.load.spritesheet('character', '/assets/charac.png', { frameWidth: 64, frameHeight: 64 });
		this.load.image('skip_title', '/assets/skip_title.png');
		this.load.image('skip', '/assets/skip.png');
		this.load.spritesheet('skip_sprite', '/assets/skip_sprite.png', { frameWidth: 336, frameHeight: 166 });
	}

	create() {
		// FONDO
		this.add.image(0, 0, 'background_instructions').setOrigin(0, 0).setScale(0.91);

		// TITULO
		const controls = this.add.sprite(290, 100, 'controls').setScale(0.3);

		// WASD
		const a_key = this.add.sprite(100, 275, 'a_key').setScale(0.13);
		const w_key = this.add.sprite(170, 205, 'w_key').setScale(0.13);
		const s_key = this.add.sprite(170, 275, 's_key').setScale(0.13);
		const d_key = this.add.sprite(240, 275, 'd_key').setScale(0.13);

		// CURSOR
		const left_key = this.add.sprite(330, 275, 'left_key').setScale(0.13);
		const up_key = this.add.sprite(400, 205, 'up_key').setScale(0.13);
		const down_key = this.add.sprite(400, 275, 'down_key').setScale(0.13);
		const right_key = this.add.sprite(470, 275, 'right_key').setScale(0.13);

		// SHOOT
		const spacebar_key = this.add.sprite(290, 390, 'spacebar_key').setScale(0.20);

		// DASH
		const tab_key = this.add.sprite(290, 550, 'tab_key').setScale(0.24);

		// GUARDAR MODIFICADOR
		const g_key = this.add.sprite(800, 275, 'g_key').setScale(0.13);
		const powerUp = this.add.sprite(920, 275, 'potion', 71).setScale(3.5);

		// USO DE GRANADA
		const b_key = this.add.sprite(800, 390, 'b_key').setScale(0.13);
		const granade = this.add.sprite(920, 390, 'granade').setScale(0.7);

		// CHARACTER
		new moveCharacter(this, 600, 220, 0).setScale(2.7);
		new shootCharacter(this, 600, 380, 0).setScale(2.7);
		new dashCharacter(this, 600, 540, 0).setScale(2.7);

		// SKIP BUTTON
		this.anims.create({
			key: 'hoverSkip',
			frames: this.anims.generateFrameNumbers('skip_sprite', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		})

		// const skip_title = this.add.sprite(890, 600, 'skip_title').setScale(0.2);
		// skip_title.setInteractive({cursor: 'pointer'});
		const skip = this.add.sprite(1000, 600, 'skip_sprite').setScale(0.5);
		skip.setInteractive({ cursor: 'pointer' });
		skip.on('pointerover', () => {
			skip.play('hoverSkip');
		});

		skip.on('pointerout', () => {
			skip.playReverse('hoverSkip');
		});

		skip.on('pointerup', () => {
			this.scene.start('level');
		})
	}
}
