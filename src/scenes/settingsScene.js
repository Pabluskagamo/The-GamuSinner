import Phaser from 'phaser'

export default class SettingScene extends Phaser.Scene {
    constructor() {
        super('settings');
    }

    init() {
        this.cameras.main.fadeIn(500);
    }

    preload() {
        this.load.image('background_settings', './img/pergamino.png');
        this.load.image('game_title', './img/titulo.png');
        this.load.spritesheet('game_resume', './assets/ui/resume_sprite.png', {frameWidth: 480 , frameHeight: 170});
        this.load.spritesheet('game_restart', './assets/ui/restart_sprite.png', {frameWidth: 480 , frameHeight: 170});
		this.load.spritesheet('main_menu', './assets/ui/MainMenu_sprite.png', {frameWidth: 480 , frameHeight: 170});
    }

    create() {
        // BACKGROUND
        this.add.image(0, 0, 'background_settings').setOrigin(0, 0).setScale(0.91);
        // TITLE
        const title = this.add.image(this.sys.game.canvas.width / 2, 150, 'game_title').setScale(0.4);

        // RESUME BUTTON
        const resume = this.add.sprite(this.sys.game.canvas.width / 2, 300, 'game_resume').setScale(0.7);
        this.anims.create({
			key: 'hoverResume',
			frames: this.anims.generateFrameNumbers('game_resume', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		});
        resume.setInteractive({ cursor: 'pointer' });
		resume.on('pointerover', () => {
			resume.play('hoverResume');
		});
		resume.on('pointerout', () => {
			resume.playReverse('hoverResume');
		});
		resume.on('pointerdown', () => {
            this.scene.resume('level');
            this.scene.resume('UIScene');
			this.scene.sleep('settings');
        });


        // RESTART BUTTON
        const restart = this.add.sprite(this.sys.game.canvas.width / 2, 410, 'game_restart').setScale(0.6);
        this.anims.create({
			key: 'hoverRestart',
			frames: this.anims.generateFrameNumbers('game_restart', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		});
        restart.setInteractive({ cursor: 'pointer' });
		restart.on('pointerover', () => {
			restart.play('hoverRestart');
		});
		restart.on('pointerout', () => {
			restart.playReverse('hoverRestart');
		});
        restart.on('pointerup', () => {
			this.scene.sleep('settings');
			this.scene.sleep('UIScene');
			this.scene.start('level');
		});

        // MENU BUTTON
        const menu = this.add.sprite(this.sys.game.canvas.width / 2, 510, 'main_menu').setScale(0.6);
		this.anims.create({
			key: 'hoverMenu',
			frames: this.anims.generateFrameNumbers('main_menu', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: 0
		});
        menu.setInteractive({ cursor: 'pointer' });
		menu.on('pointerover', () => {
			menu.play('hoverMenu');
		});
		menu.on('pointerout', () => {
			menu.playReverse('hoverMenu');
		});
        menu.on('pointerup', () => {
			this.scene.sleep('settings');
			this.scene.sleep('UIScene');
			this.scene.stop('level')
			this.scene.start('mainScene');
		});
    }
}