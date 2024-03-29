import MovableObject from "./movableObject";
import NonePowerUp from "./powerUps/nonePowerUp";
import { PowerUpFactory } from "./powerUps/powerUpFactory";
import { Directions } from "./utils/directions"

// CLASE DEL PERSONAJE

export default class Character extends MovableObject {

    constructor(scene, x, y, instruction, speed, hp, maxHp, wallet, cadence, bulletDmg, inventory) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);
        this.instruction = instruction;

        // EN FUNCION DE SI ES UN PERSONAJE DE LA ESCENA DE CONTROLES TIENE UN CONSTRUCTOR U OTRO
        if (this.instruction === null) {

            // INICIALIZAS LOS VALORES POR DEFECTO DEL PERSONAJE
            this.wallet = wallet;
            this.isAttacking = false;
            this.isDashing = false;
            this.invicible = false;
            this.lastDash = 0;
            this.nonePowerUp = new NonePowerUp(this.scene)
            this.currentPowerUp = this.nonePowerUp
            this.inventory = inventory
            if(this.inventory !== null){
                this.scene.events.emit('savePowerUp', this.inventory.getKey())
            }
            this.petPowerUp = null
            this.pet = null
            this.passives = []
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

            // SE AJUSTA SU CAJA DE COLISIONES
            this.scene.physics.add.existing(this);
            this.setCollideWorldBounds();
            this.bodyOffsetWidth = this.body.width / 4.2;
            this.bodyOffsetHeight = this.body.height / 4.8;
            this.bodyWidth = this.body.width / 5.8;
            this.bodyHeight = this.body.height / 1.45;

            this.body.setOffset(this.bodyOffsetWidth, this.bodyOffsetHeight);
            this.body.width = this.bodyWidth;
            this.body.height = this.bodyHeight;

            // SE AÑADEN LAS ANIMACIONES
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

            // SE COMPRUEBAN UNA ANIMACIONES EN CONCRETO PARA ESPERAR A QUE TERMINEN PARA PODER REALIZAR OTRA ACCION
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
        } // CONTROL DE DASHEO
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
        } // CONTROL DE MOVIMIENTO
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
        } // CONTROL DE DISPARO
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

        // COMPRUEBA LA DIRECCION DEL MOVIMIENTO DEL PERSONAJE SIEMPRE QUE NO ESTE MUERTO
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

            // ACTIVA EL INVENTARIO
            if (this.inventoryKey.isDown && this.inventory != null) {
                this.inventory.setCollected(false)
                this.collectPowerUp(this.inventory)
                console.log("entro")
                this.scene.events.emit("usePowerUpInventory")
                this.inventory = null;
            }

            // SI TIENE MASCOTA SE MOVERA CON EL PERSONAJE
            if(this.pet != null){
                this.movePet()
            }

            // CUANDO YA NO DASHEA PARARA LAS VELOCIDADES
            if(!this.isDashing){
                if (Phaser.Input.Keyboard.JustUp(this.a) || Phaser.Input.Keyboard.JustUp(this.d)) {
                    this.stopHorizontal();
                }

                if (Phaser.Input.Keyboard.JustUp(this.w) || Phaser.Input.Keyboard.JustUp(this.s)) {
                    this.stopVertical();
                }
            }

            // DISPARAR
            if ((this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown) && t > this.lastFired) {
                this.flipX = true;
                if (!this.isDead() && !this.isDashing) {
                    this.attack();
                    this.lastFired = t + this.cadence;
                }
            }

            // TEMPORIZADOR DEL DASH PARA VOLVER A HACERLO
            if(this.dashTimer){
                const remaining = (5000 - this.dashTimer.getElapsed()) / 1000;

                if (this.lastTime != remaining) {
                    this.scene.events.emit('updatePowerupCount', 'dash_char', remaining.toFixed(0));
                }

                this.lastTime = remaining
            }
        }
    }

    // FUNCION PARA REALIZAR EL DISPARO
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

    // FUNCION QUE COMPRUEBA SI SE ESTA ATACANDO
    isAttackInProcess() {
        return this.isAttacking;
    }

    // FUNCION PARA MATAR EL PERSONAJE
    dieMe() {
        this.play('mainChar_die');
    }

    // SETTER Y GETTER DE LA VIDA
    getHp() {
        return this.hp;
    }

    setHp(health) {
        this.hp = health;
    }

    // FUNCION PARA CUANDO RECIBE DAÑO
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

    // FUNCION PARA CUANDO ESTA MUERTO
    isDead() {
        return this.hp === 0;
    }

    // FUNCION PARA REALIZAR EL DASH
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

    // FUNCION PARA SABER SI ESTA DASHEANDO
    getDash() {
        return this.isDashing;
    }

    // FUNCION PARA SABER SI ESTA EN MODO INVENCIBLE (AL DASHEAR)
    isInvicible() {
        return this.invicible;
    }

    // FUNCION PARA AÑADIR MONEDAS
    collectCoin(value) {
        this.wallet += value;
    }

    // SETTER Y GETTER DE LAS MONEDAS
    getWallet() {
        return this.wallet;
    }

    setWallet(coins){
        this.wallet = coins;
    }

    // SETTER Y GETTER DE LA VELOCIDAD
    getSpeed(){
        return this.speed;
    }

    setSpeed(speed){
        this.speed = speed;
    }

    // SETTER Y GETTER DEL DAÑO REALIZADO CON LAS BALAS
    getBulletDmg(){
        return this.bulletDmg;
    }

    setBulletDmg(dmg){
        this.bulletDmg = dmg;
    }
    
    // SETTER Y GETTER DE LA CADENCIA DE DISPARO
    getCadence(){
        return this.cadence;
    }

    setCadence(c){
        this.cadence = c;
    }

    // GETTER DEL INVENTARIO
    getInventory(){
        return this.inventory;
    }

    // FUNCION PARA ALMACENAR UN POWER-UP
    collectPowerUp(powerUp) {
        if(this.inventory == null){
            this.inventory = powerUp
            this.scene.events.emit('savePowerUp', powerUp.getKey())
            powerUp.collect()
        }
        else if (!powerUp.getCollected()) {
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

    // FUNCION PARA ACTIVAR UN POWER-UP
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

    // FUNCION PARA COMPROBAR LOS POWER-UPS
    checkPowerUps() {
        if (this.currentPowerUp && !this.currentPowerUp.isEnabled()) {
            this.currentPowerUp = this.nonePowerUp
        }

        if (this.petPowerUp && !this.petPowerUp.isEnabled()) {

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

    // FUNCION PARA COMPRIBAR SI UN POWER-UP YA ESTA ACTIVO
    checkPowerUpAlreadyActive(powerUp){

        if(powerUp.isPet() && this.pet != null){
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

    // FUNCION PARA INCREMENTAR LA VIDA POR LOS MUSLITOS
    collectFood(value) {
        if (this.hp < this.maxHp) {
            this.hp += value;
        }
    }

    // FUNCION PARA OBTENER LA VIDA MAXIMA ACTUAL
    getMaxHp(){
        return this.maxHp;
    }

    // FUNCION PARA INCREMENTAR LA VIDA MAXIMA (MAXIMO 7)
    incrementHp(){
        if(this.maxHp < 7){
            this.maxHp++;
        }
    }

    // FUNCION PARA OBTENER LAS ESTADISTICAS ACTUALES DEL PERSONAJE
    getPlayerStats(){
        return {
            hp: this.hp,
            maxHp: this.maxHp,
            coins: this.wallet,
            cadence: this.cadence,
            speed: this.speed
        }
    }

    // FUNCION PARA GENERAR UNA ANIMACION DE INVENCIBILIDAD
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

            }
        })

        this.scene.time.addEvent({
            delay: 2000,
            callback: ()=>{this.invicible = false;},
            callbackScope: this,
            loop: false
        });
    }

    // FUNCION PARA AÑADIR UNA MASCOTA
    setPet(pet){
        this.pet = pet
    }

    // FUNCION PARA LA MASCOTA SIGA AL PERSONAJE
    movePet(){
        this.pet.follow(this.x + 50, this.y)
    }
}