import MovableObject from "./movableObject";
import NonePowerUp from "./powerUps/nonePowerUp";
import { PowerUpFactory } from "./powerUps/powerUpFactory";
import { Directions } from "./utils/directions"
import MultipleDirectionShot from "./powerUps/multipleDirectionShot";

export default class Character extends MovableObject {

    constructor(scene, x, y, speed, instruction) {
        super(scene, x, y, 'character', speed, 20);
        this.speed = speed;
        this.scene.add.existing(this);
        this.instruction = instruction;

        if (this.instruction === null) {
            this.wallet = 0;
            this.isAttacking = false;
            this.isDashing = false;
            this.tripleShot = true;
            this.eightDirShot = false;
            this.nonePowerUp = new NonePowerUp(this.scene)
            this.currentPowerUp = this.nonePowerUp
            this.passives = []
            this.numDirections = 8;
            this.bulletMultiplier = 3;
            this.bulletSpread = 0.25;
            this.hp = 6;
            this.maxHp = 6;
            this.lastFired = 0;


            this.setScale(1.7);

            this.scene.physics.add.existing(this);
            this.setCollideWorldBounds();

            this.bodyOffsetWidth = this.body.width / 4.6;
            this.bodyOffsetHeight = this.body.height / 5;
            this.bodyWidth = this.body.width / 4;
            this.bodyHeight = this.body.height / 1.5;

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
                key: 'TAB_Press',
                frames: this.scene.anims.generateFrameNumbers('tab_key', { start: 0, end: 2 }),
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
                this.dash();
            }

            if (Phaser.Input.Keyboard.JustUp(this.a) || Phaser.Input.Keyboard.JustUp(this.d)) {
                this.stopHorizontal();
            }

            if (Phaser.Input.Keyboard.JustUp(this.w) || Phaser.Input.Keyboard.JustUp(this.s)) {
                this.stopVertical();
            }

            if ((this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown) && t > this.lastFired) {
                this.flipX = true;
                if (!this.isDead()) {
                    this.attack();
                    this.lastFired = t + 400;
                }
            }

            // if(this.isStatic()){
            //     this.play('mainChar_static', true);
            // }
        }
    }

    attack() {

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
        if (!this.isDashing) {
            this.hp -= dmg;

            if (this.hp <= 0) {
                this.hp = 0;
                this.dieMe();
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

    collectCoin(value) {
        this.wallet += value;
    }

    getWallet() {
        return this.wallet;
    }

    collectPowerUp(powerUp) {
        if (!powerUp.getCollected()) {
            this.checkPowerUpAlreadyActive(powerUp)
            powerUp.collect()
            if (!powerUp.isPassive()) {
                this.activatePowerUp(powerUp)
            }
            else {
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
        if (this.currentPowerUp && !this.currentPowerUp.isEnabled()) { this.currentPowerUp = this.nonePowerUp }
        console.log(this.passives)

        if (this.passives) {
            this.passives.forEach(e => {
                if (!e.isEnabled()) {
                    this.passives.splice(this.passives.indexOf(e), 1)
                }
            })
        }
    }

    collectFood(value) {
        if (this.hp < this.maxHp) {
            this.hp += value;
        }
    }

    checkPowerUpAlreadyActive(powerUp){

        if(powerUp.getKey() === this.currentPowerUp.getKey()){
            this.currentPowerUp.disable(true);
        }
        else{
            const powerExist = this.passives.find(p => {return p.getKey() === powerUp.getKey()})
            if(powerExist){
                powerExist.disable(true);
            }
        }

    }
}