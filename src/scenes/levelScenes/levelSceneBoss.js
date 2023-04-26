import LevelScene from "../levelScene";
import Character from "../../gameobjects/character";
import BulletPool from "../../gameobjects/Pools/bulletPool";
import PowerUpPool from "../../gameobjects/Pools/powerUpPool";
import EnemyPool from "../../gameobjects/Pools/enemyPool";
import CoinPool from "../../gameobjects/Pools/coinPool";
import FoodPool from "../../gameobjects/Pools/foodPool";
import DemonBoss from "../../gameobjects/enemies/demonBoss";

export default class LevelSceneBoss extends LevelScene {

    constructor() {
		super('levelBoss')
	}

	create(data){
        super.create({...data, bossLevel: true});
        this.demon = new DemonBoss(this, 0, 0, 60, this.player, this.enemyPool)

		// if(this.scene.isActive('UIScene')){
		// 	this.scene.stop('UIScene');			
		// }

		// console.log("LAUNCH HUD", this.player.getMaxHp(), this.player.getHp())
		// this.scene.launch('UIScene', {playerData: this.player.getPlayerStats(), level: this.namescene});

		this.physics.add.collider(this.bulletPool._group, this.demon, (obj1, obj2) => {
            obj1.hit(obj2)
        }, (obj1, obj2) => !obj2.isDead());

		this.physics.add.collider(this.demon, this.player, (obj1, obj2) => {
				obj1.attack(obj2);
				this.events.emit('addScore', obj2.getHp());
			}, (obj1, obj2) => !obj2.getDash()
		);

		this.physics.add.collider(this.bulletPool._group, this.enemyPool._group, (obj1, obj2) => {
			obj1.hit(obj2)
		}, (obj1, obj2) => !obj2.isDead());

		this.physics.add.overlap(this.coinPool._group, this.player, (obj1, obj2) => {
			obj1.collect(obj2);
			this.events.emit('earnCoin', obj2.getWallet());
		});

		this.physics.add.overlap(this.powerUpPool._group, this.player, (obj1, obj2) => {
			obj2.collectPowerUp(obj1);
		}, (obj1, obj2) => !obj1.isEnabled());
		
		this.physics.add.overlap(this.foodPool._group, this.player, (obj1, obj2) => {
			obj1.collect(obj2);
			this.events.emit('addScore', obj2.getHp());
		});

		this.physics.add.collider(this.enemyPool._group, this.player, (obj1, obj2) => {
			obj1.attack(obj2);
			this.events.emit('addScore', obj2.getHp());
		}, (obj1, obj2) => !obj2.getDash()
		);
    }

    initPlayerAndPools(data) {
		console.log("LLEGO AQUI")
		
        if(data.hasOwnProperty('gate')){
            this.player = new Character(this, data.gate.x, data.gate.y, null, data.player.getSpeed(), data.player.getHp(), data.player.getMaxHp(), data.player.getWallet(),  data.player.getCadence());
        }else{
            this.player = new Character(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, null, 150, 4, 4, 0, 400);
        }
		this.player.body.onCollide = true;

		this.bulletPool = new BulletPool(this, 150, 20)
		this.powerUpPool = new PowerUpPool(this, 6)
		this.enemyPool = new EnemyPool(this, 15);
		this.coinPool = new CoinPool(this, 20);
		this.foodPool = new FoodPool(this, 20);
	}

	initTimers(debug) {
		this.v = this.input.keyboard.addKey('v');
		this.debugMode = true;
	}

}