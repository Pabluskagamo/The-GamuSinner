import MovableObject from "./movableObject";
import NonePowerUp from "./powerUps/nonePowerUp";
import { PowerUpFactory } from "./powerUps/powerUpFactory";
import { Directions } from "./utils/directions"
import MultipleDirectionShot from "./powerUps/multipleDirectionShot";
import BouncingShot from "./powerUps/bouncingShot"

export default class Character extends MovableObject {

    constructor(scene, x, y, instruction, speed, hp, maxHp, wallet, cadence, bulletDmg) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);
        this.instruction = instruction;

        if (this.instruction === null) {
            this.wallet = wallet;
            this.isAttacking = false;
            this.isDashing = false;
            this.invicible = false;
            this.lastDash = 0;
            //this.nonePowerUp = new MultipleDirectionShot(this.scene)
            //this.nonePowerUp.collect()
            //this.nonePowerUp.initTimer()
            this.nonePowerUp = new NonePowerUp(this.scene)
            this.currentPowerUp = this.nonePowerUp
            this.inventory = null
            this.petPowerUp = null
            this.pet = null
            this.passives = []
            //this.passives = [new BouncingShot(this.scene)]
            this.hp = 4;
            this.maxHp = 4;
            this.numDirections = 8;
            this.bulletMultiplier = 3;
            this.bulletSpread = 0.25;
            this.hp = hp;
            this.maxHp = maxHp;
            this.lastFired = 0;
            this.cadence = cadence;
            this.bulletDmg = bulletDmg;
            this.dashTimer = null;


            this.setScale(1.7);

            this.scene.physics.add.existing(this);
            this.setCollideWorldBounds();
            /* this.originalWidth = this.body.width
            this.originalHeight = this.body.height
            this.body.setSize(this.originalWidth/6.3, this.originalHeight/2.5, true); */
            this.bodyOffsetWidth = this.body.width / 4.2;
            this.bodyOffsetHeight = this.body.height / 4.8;
            this.bodyWidth = this.body.width / 5.8;
            this.bodyHeight = this.body.height / 1.45;

            this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
            this.body.width = this.bodyWidth;
            this.body.height = this.bodyHeight;

            this.scene.anims.create({
                key: 'mainChar_static',
                frames: this.scene.anims.generateFrameNumbers('character', { start: 0, end: 7 }),
                frameRate: 5,
                repeat: -1
            })

            this.scene.anims.create({
                key: 'mainChar_lado',
                frames: this.scene.anims.generateFrameNumbers('character', { start: 8, end: 15 }),
                frameRate: 10,
                repeat: 0
            })

            this.scene.anims.create({
                key: 'mainChar_dash',
                frames: this.scene.anims.generateFrameNumbers('character', { start: 16, end: 22 }),
                frameRate: 10,
                repeat: 0
            })

            this.scene.anims.create({
                key: 'mainChar_shootlado',
                frames: this.scene.anims.generateFrameNumbers('character', { start: 40, end: 43 }),
                frameRate: 15,
                repeat: 0
            })

            this.scene.anims.create({
                key: 'mainChar_shootlado_izq',
                frames: this.scene.anims.generateFrameNumbers('character_shot', { start: 0, end: 3 }),
                frameRate: 15,
                repeat: 0
            })

            this.scene.anims.create({
                key: 'mainChar_die',
                frames: this.scene.anims.generateFrameNumbers('character', { start: 48, end: 52 }),
                frameRate: 5,
                repeat: 0
            })

            


            this.on('animationcomplete', end => {
                if (/^mainChar_shoot\w+/.test(this.anims.currentAnim.key)) {
                }

                if (this.anims.currentAnim.key === 'mainChar_lado') {
                    this.play('mainChar_static', true)
                }
                if (this.anims.currentAnim.key === 'mainChar_die') {
                    this.scene.gameOver();
                }

                if (this.anims.currentAnim.key === 'mainChar_dash') {
                    this.isDashing = false;
                }
            })
            this.play('mainChar_static', true);

            this.scene.events.on('endPowerUpPlayer', function () {
                this.checkPowerUps()
            }, this);
        }
        else if (this.instruction === "dash") {
            this.scene.anims.create({
                key: 'mainChar_controls_dash',
                frames: this.scene.anims.generateFrameNumbers('character', { start: 16, end: 22 }),
                frameRate: 5,
                repeat: 0
            });

            this.scene.anims.create({
                key: 'SHIFT_Press',
                frames: this.scene.anims.generateFrameNumbers('shift_key', { start: 0, end: 2 }),
                frameRate: 5,
                repeat: 0
            });

            this.play('mainChar_controls_dash');
        }
        else if (this.instruction === "move") {
            this.scene.anims.create({
                key: 'mainChar_controls_lado',
                frames: this.scene.anims.generateFrameNumbers('character', { start: 8, end: 15 }),
                frameRate: 6,
                repeat: 0
            });

            this.scene.anims.create({
                key: 'W_Press',
                frames: this.anims.generateFrameNumbers('w_key', { start: 0, end: 2 }),
                frameRate: 4,
                repeat: 0
            });

            this.scene.anims.create({
                key: 'A_Press',
                frames: this.anims.generateFrameNumbers('a_key', { start: 0, end: 2 }),
                frameRate: 4,
                repeat: 0
            });

            this.scene.anims.create({
                key: 'S_Press',
                frames: this.anims.generateFrameNumbers('s_key', { start: 0, end: 2 }),
                frameRate: 4,
                repeat: 0
            });

            this.scene.anims.create({
                key: 'D_Press',
                frames: this.anims.generateFrameNumbers('d_key', { start: 0, end: 2 }),
                frameRate: 4,
                repeat: 0
            });

            this.play('mainChar_controls_lado');
        }
        else if (this.instruction === "shoot") {
            this.scene.anims.create({
                key: 'mainChar_controls_shootlado',
                frames: this.scene.anims.generateFrameNumbers('character', { start: 40, end: 43 }),
                frameRate: 6,
                repeat: 0
            });

            this.scene.anims.create({
                key: 'UP_Press',
                frames: this.anims.generateFrameNumbers('up_key', { start: 0, end: 2 }),
                frameRate: 4,
                repeat: 0
            });

            this.scene.anims.create({
                key: 'LEFT_Press',
                frames: this.anims.generateFrameNumbers('left_key', { start: 0, end: 2 }),
                frameRate: 4,
                repeat: 0
            });

            this.scene.anims.create({
                key: 'DOWN_Press',
                frames: this.anims.generateFrameNumbers('down_key', { start: 0, end: 2 }),
                frameRate: 4,
                repeat: 0
            });

            this.scene.anims.create({
                key: 'RIGHT_Press',
                frames: this.anims.generateFrameNumbers('right_key', { start: 0, end: 2 }),
                frameRate: 4,
                repeat: 0
            });

            this.play('mainChar_controls_shootlado');
        }

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.a = this.scene.input.keyboard.addKey('A');
        this.s = this.scene.input.keyboard.addKey('S');
        this.d = this.scene.input.keyboard.addKey('D');
        this.w = this.scene.input.keyboard.addKey('W');
        this.spacebar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.inventoryKey = this.scene.input.keyboard.addKey('V');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        
        if (this.instruction === null) {

            this.flipX = false;

            if (!this.isDashing && !this.isDead()) {
                if (this.s.isDown && this.d.isDown) {
                    // Diagonal abajo-derecha
                    this.play('mainChar_lado', true);
                    this.moveRightDown();
                } else if (this.w.isDown && this.d.isDown) {
                    // Diagonal arriba-derecha
                    this.play('mainChar_lado', true);
                    this.moveRightUp();
                } else if (this.s.isDown && this.a.isDown) {
                    // Diagonal abajo-izquierda
                    this.play('mainChar_lado', true);
                    this.flipX = true;
                    this.moveLeftDown();
                } else if (this.w.isDown && this.a.isDown) {
                    // Diagonal arriba-izquierda
                    this.play('mainChar_lado', true);
                    this.flipX = true;
                    this.moveLeftUp();
                } else if (this.s.isDown) {
                    // Movimiento hacia abajo
                    this.play('mainChar_lado', true);
                    this.moveDown();
                } else if (this.w.isDown) {
                    // Movimiento hacia arriba
                    this.play('mainChar_lado', true);
                    this.moveUp();
                } else if (this.a.isDown) {
                    // Movimiento hacia izq
                    this.play('mainChar_lado', true);
                    this.flipX = true;
                    this.moveLeft();
                } else if (this.d.isDown) {
                    this.play('mainChar_lado', true);
                    this.moveRight();
                } else {
                    this.frictionEffect();
                }
            }

            if (this.shift.isDown) {

                if(!this.dashTimer || this.dashTimer.hasDispatched){
                    this.dash();
                    this.scene.events.emit('characterDash');

                    this.dashTimer = this.scene.time.addEvent({
                        delay: 5000,
                        callback: ()=>{this.scene.events.emit('characterDashEnd');},
                        callbackScope: this,
                        loop: false
                    });
                }
            }
            
            // activate inventory
            if (this.inventoryKey.isDown && this.inventory != null) {
                this.inventory.setCollected(false)
                this.collectPowerUp(this.inventory)
                this.scene.events.emit("usePowerUpInventory")
                this.inventory = null;
            }

            if(this.pet != null){
                this.movePet()
            }

            if(!this.isDashing){
                if (Phaser.Input.Keyboard.JustUp(this.a) || Phaser.Input.Keyboard.JustUp(this.d)) {
                    this.stopHorizontal();
                }
    
                if (Phaser.Input.Keyboard.JustUp(this.w) || Phaser.Input.Keyboard.JustUp(this.s)) {
                    this.stopVertical();
                }
            }

            if ((this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown) && t > this.lastFired) {
                this.flipX = true;
                if (!this.isDead() && !this.isDashing) {
                    this.attack();
                    this.lastFired = t + this.cadence;
                }
            }

            // if(this.isStatic()){
            //     this.play('mainChar_static', true);
            // }

            if(this.dashTimer){
                const remaining = (5000 - this.dashTimer.getElapsed()) / 1000;
    
                if (this.lastTime != remaining) {
                    this.scene.events.emit('updatePowerupCount', 'dash_char', remaining.toFixed(0));
                }
    
                this.lastTime = remaining
            }
        }
    }

    attack() {

        this.scene.sound.add("shoot_sound", {
            volume: 0.15,
            loop: false
        }).play();

        let dir = Directions.DOWN
        if (this.cursors.down.isDown && this.cursors.right.isDown) {
            // Diagonal abajo-derecha
            this.play('mainChar_shootlado', true);
            dir = Directions.DOWNRIGHT
        } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
            // Diagonal arriba-derecha
            this.play('mainChar_shootlado', true);
            dir = Directions.UPRIGHT
        } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
            // Diagonal abajo-izquierda
            this.play('mainChar_shootlado_izq', true);
            // this.flipX = true;
            dir = Directions.DOWNLEFT
        } else if (this.cursors.up.isDown && this.cursors.left.isDown) {
            // Diagonal arriba-izquierda
            this.play('mainChar_shootlado_izq', true);
            // this.flipX = true;
            dir = Directions.UPLEFT
        } else if (this.cursors.down.isDown) {
            // Movimiento hacia abajo
            this.play('mainChar_shootlado', true);
            dir = Directions.DOWN
        } else if (this.cursors.up.isDown) {
            // Movimiento hacia arriba
            this.play('mainChar_shootlado', true);
            dir = Directions.UP
        } else if (this.cursors.left.isDown) {
            // Movimiento hacia izq
            this.play('mainChar_shootlado_izq', true);
            this.flipX = true;
            dir = Directions.LEFT
        } else if (this.cursors.right.isDown) {
            this.play('mainChar_shootlado', true);
            dir = Directions.RIGHT
        }

        this.currentPowerUp.run(this.x, this.y, this.passives, dir)
        if (this.pet != null) {
            this.pet.attack(this.currentPowerUp, this.passives, dir)
        }
    }

    isAttackInProcess() {
        return this.isAttacking;
    }

    dieMe() {
        this.play('mainChar_die');
    }

    getHp() {
        return this.hp;
    }

    setHp(health) {
        this.hp = health;
    }

    getHit(dmg) {
        if (!this.isDashing && !this.invicible) {
            this.hp -= dmg;
			this.scene.sound.add("hit", {
                volume: 0.2,
                loop: false
            }).play();
            if (this.hp <= 0) {
                this.hp = 0;
                this.dieMe();
            }else{
                this.setInvincible2secs()
            }
        }

    }

    isDead() {
        return this.hp === 0;
    }

    dash() {
        this.flipX = this.body.velocity.x < 0;
        let speed = this.speed;

        if (!this.isDead()) {
            this.speed *= 1.3;
            this.isDashing = true;
            this.play('mainChar_dash', true);

            this.applyLastDir();
            this.speed = speed;
        }
    }

    getDash() {
        return this.isDashing;
    }

    isInvicible() {
        return this.invicible;
    }

    collectCoin(value) {
        this.wallet += value;
    }

    getWallet() {
        return this.wallet;
    }

    setWallet(coins){
        this.wallet = coins;
    }

    getSpeed(){
        return this.speed;
    }

    setSpeed(speed){
        this.speed = speed;
    }

    getBulletDmg(){
        return this.bulletDmg;
    }

    setBulletDmg(dmg){
        console.log("BULLETDMG", this.bulletDmg, dmg)
        this.bulletDmg = dmg;
    }

    collectPowerUp(powerUp) {
        if(this.inventory == null){
            console.log("inventarioooooooooo")
            this.inventory = powerUp
            this.scene.events.emit('savePowerUp', powerUp.getKey())
            powerUp.collect()
        }
        else if (!powerUp.getCollected()) {
            console.log(" noo inventarioooooooooo")
            this.checkPowerUpAlreadyActive(powerUp)
            powerUp.collect()
            powerUp.initTimer()
            if (powerUp.isPet()){
                this.petPowerUp = powerUp;
                this.petPowerUp.run()
            } else if (!powerUp.isPassive()) {
                this.activatePowerUp(powerUp)
            } else {
                this.passives.push(powerUp)
            }
        }
    }

    activatePowerUp(powerUp) {
        let combo = PowerUpFactory.getCombo(powerUp, this.currentPowerUp)
        if (combo === "none") {
            this.currentPowerUp = powerUp
        }
        else {
            const powerCombo = PowerUpFactory.create(combo, this.scene)
            this.checkPowerUpAlreadyActive(powerCombo)
            this.currentPowerUp = powerCombo
        }
    }

    checkPowerUps() {
        if (this.currentPowerUp && !this.currentPowerUp.isEnabled()) { 
            this.currentPowerUp = this.nonePowerUp 
        }

        if (this.petPowerUp && !this.petPowerUp.isEnabled()) {
            console.log("ADIOS PET sadadaasdassssssssssssssssssssssssssssssssssssda")
            this.petPowerUp.hidePet();
            this.petPowerUp = null;
            this.pet = null;
        }

        if (this.passives) {
            this.passives.forEach(e => {
                if (!e.isEnabled()) {
                    this.passives.splice(this.passives.indexOf(e), 1)
                }
            })
        }
    }
    
    checkPowerUpAlreadyActive(powerUp){

        console.log("YA HAY PET")

        if(powerUp.isPet() && this.pet != null){
            console.log("YA HAY PET")
            this.petPowerUp.hidePet()
            this.petPowerUp.disable(true);
        }else if(powerUp.getKey() === this.currentPowerUp.getKey()){
            this.currentPowerUp.disable(true);
        }
        else{
            const powerExist = this.passives.find(p => {return p.getKey() === powerUp.getKey()})
            if(powerExist){
                powerExist.disable(true);
            }
        }
        
    }
    
    collectFood(value) {
        if (this.hp < this.maxHp) {
            this.hp += value;
        }
    }
    
    getMaxHp(){
        return this.maxHp;
    }

    incrementHp(){
        if(this.maxHp < 7){
            this.maxHp++;
        }
    }

    getCadence(){
        return this.cadence;
    }

    setCadence(c){
        this.cadence = c;
    }

    getPlayerStats(){
        return {
            hp: this.hp,
            maxHp: this.maxHp,
            coins: this.wallet,
            cadence: this.cadence,
            speed: this.speed
        }
    }

    setInvincible2secs(){
        this.invicible = true;

        this.scene.tweens.add({
            targets: this,
            alpha: {from:1, to: 0},
            duration: 500,
            loop: 1,
            ease: 'Sine.easeInOut',
            yoyo: true,
            onComplete: ()=>{
                console.log("Tween fin");
            }
        })

        this.scene.time.addEvent({
            delay: 2000,
            callback: ()=>{this.invicible = false;},
            callbackScope: this,
            loop: false
        });
    }

    setPet(pet){
        this.pet = pet
    }

    movePet(){
        this.pet.follow(this.x + 50, this.y)
    }
}