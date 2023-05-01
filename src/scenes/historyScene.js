import dialogBox from "../dialogs/dialogBox";
export default class historyScene extends Phaser.Scene {

    constructor() {
        super({ key: 'history' });
    }

    preload() {
        this.load.spritesheet('skip_sprite', './assets/ui/skip_sprite.png', { frameWidth: 336, frameHeight: 166 });
        this.load.image('room', './img/room2.png')
        this.load.image('historia', './img/sceneHistoria_final.png')
        this.load.audio("chat", "./assets/audio/chat.mp3");
        this.load.audio("rise", "./assets/audio/Rise of spirit.mp3");
        this.load.audio("chatTyping", "./assets/audio/Effects/chatTyping.mp3");
    }

    create(data) {
        this.isMuted = data.mute;
        if (!this.isMuted) {
            this.sound.add("chat", {
                volume: 0.2,
            }).play();
        }

        this.textList = "Un día Dieguiño estaba aburrido, no sabía que hacer en el verano.\nSe aburría tanto, que decidió preguntarle a su abuelo que podía hacer.";
        this.textD = [
            'Hola avó, estoy aburrido, ¿Qué estás haciendo?',
            'Perdón avó, es que como estoy aburrido no se me ocurre nada que hacer.',
            'Es que no me apetece eso, me apetece algo más divertido. Va avó dime algo que hacer.'
        ]
        this.textA = [
            'AHHH!!! Que susto, eres tú, ¿tú te crees que estoy para estos sustos mientras duermo?',
            'Y por eso vienes a molestar a tu abuelo. Si estás aburrido vete a jugar con la pelotiña o esas cosas.',
            'Pues vete a cazar Gamusiños y déjame en paz, que solo sabes molestar.'
        ]
        this.textEnd = "Así Dieguiño en un instante y sin dudarlo salío corriendo.\nSe fue a su habitación, cogió una mochila y empezó a llenarla.\nTras llenarla se fue a hurtadillas al despacho de su abuelo.\nAbrió un cajón con mucho cuidado y sacó una pistola que guardaba su \nabuelo. Antes de salir del despacho, cogió del perchero el sombrero de \narqueólogo de su padre. Sin pensárselo dos veces, salió de la casa\n adentrándose en el bosque. Sin saber todas las aventuras que le \nesperaban y los peligros que correría."
        this.textPreparado = "¿Estás preparado para la aventura tú también?"

        // SKIP BUTTON
        this.anims.create({
            key: 'hoverSkip',
            frames: this.anims.generateFrameNumbers('skip_sprite', { start: 0, end: 2 }),
            frameRate: 12,
            repeat: 0
        })

        // const skip_title = this.add.sprite(890, 600, 'skip_title').setScale(0.2);
        // skip_title.setInteractive({cursor: 'pointer'});
        this.skip = this.add.sprite(1000, 600, 'skip_sprite').setScale(0.5);
        this.skip.setDepth(3);
        this.skip.setInteractive({ cursor: 'pointer' });
        this.skip.on('pointerover', () => {
            this.skip.play('hoverSkip');
        });

        this.skip.on('pointerout', () => {
            this.skip.playReverse('hoverSkip');
        });
        this.skip.on('pointerup', () => {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once("camerafadeoutcomplete", function () {
                this.scene.stop();
                this.scene.start('instructions', { mute: this.isMuted });
            }, this);
        });

        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                this.cameras.main.fadeOut(500);
                this.cameras.main.once("camerafadeoutcomplete", function () {
                    this.scene.stop();
                    this.scene.start('instructions', { mute: this.isMuted });
                }, this);
            }
        });
        if (!this.isMuted) {
            this.rise = this.sound.add("rise", {
                volume: 0.2,
            });
        }

        this.chatting = false;
        this.final = false;
        this.pregunta = false;
        this.showTextList();
    }

    showTextList() {
        this.label = this.add.text(100, 250, '', { fontSize: '32px', fontFamily: 'Arial', lineSpacing: 20 });

        this.d = 0;
        this.a = 0;
        this.typewriteText(this.label, this.textList, () => {
            this.room = this.add.image(0, 0, 'room').setOrigin(0, 0).setScale(1.12).setDepth(0);
            this.chat = this.add.image(0, 0, 'historia').setOrigin(0, 0).setScale(1).setDepth(1);
            this.showDialogDieguinio();
        });
    }


    showDialogDieguinio() {
        this.skip.setPosition(1000, 100);
        if (this.d <= 2) {
            this.chatting = true;
            this.dialogDieguinio = new dialogBox(this, 300, 40, 420);
            this.dialogDieguinio.setDepth(2);
            this.dialogDieguinio.setFontSize(22);
            this.dialogDieguinio.setColor('FFFFFF');
            this.dialogDieguinio.clearText();

            this.typewriteText(this.dialogDieguinio, this.textD[this.d], () => {
                this.showDialogAbuelo();
                this.d++;
            });
        }
        else {
            this.chatting = false;
            this.sound.removeByKey('chat');
            if (!this.isMuted) {
                this.rise.play();
            }
            this.final = true;
            this.tweens.add({
                targets: [this.room.destroy(), this.chat.destroy()],
                alpha: 0,
                duration: 2000,
                onComplete: () => {
                    this.showFinalTextList();
                }
            });
        }
    }

    showDialogAbuelo() {
        this.dialogAbuelo = new dialogBox(this, 440, 165, 440);
        this.dialogAbuelo.setDepth(2);
        this.dialogAbuelo.setFontSize(22);
        this.dialogAbuelo.setColor('FFFFFF');
        this.dialogAbuelo.clearText();

        this.typewriteText(this.dialogAbuelo, this.textA[this.a], () => {
            this.showDialogDieguinio();
            this.a++;
        });
    }

    showFinalTextList() {
        this.skip.setPosition(1000, 600);
        this.Finallabel = this.add.text(100, 100, '', { fontSize: '32px', fontFamily: 'Arial', lineSpacing: 20 });
        this.typewriteText(this.Finallabel, this.textEnd, () => {
            this.tweens.add({
                targets: this.Finallabel,
                alpha: 0,
                duration: 2000,
                onComplete: () => {
                    this.showTextPreparado();
                }
            });
        });
    }

    showTextPreparado() {
        this.preLabel = this.add.text(100, 300, '', { fontSize: '45px', fontFamily: 'Arial', lineSpacing: 20 });
        this.pregunta = true;
        this.typewriteText(this.preLabel, this.textPreparado, () => {
            this.tweens.add({
                targets: this.preLabel,
                alpha: 0,
                duration: 3000,
                onComplete: () => {
                    if (!this.isMuted) {
                        this.rise.once('complete', () => {
                            this.scene.stop();
                            this.scene.start('instructions', { mute: this.isMuted });
                        });
                    } else {
                        this.scene.stop();
                        this.scene.start('instructions', { mute: this.isMuted });
                    }
                }
            });
        });
    }

    typewriteText(label, text, callback) {
        const length = text.length;
        let i = 0;
        let delay = this.final ? 120 : 60;
        let duration = this.pregunta ? 9000 : 1400;
        if (this.chatting) {
            if (!this.isMuted) {
                this.sound.add("chatTyping", {
                    volume: 0.4,
                }).play();
            }
        }
        this.time.addEvent({
            callback: () => {
                label.text += text[i];
                ++i;
                if (i === length) {
                    this.sound.removeByKey("chatTyping");
                    this.tweens.add({
                        targets: label,
                        alpha: 0,
                        duration: duration,
                        onComplete: () => {
                            label.text = '';
                            callback();
                        }
                    });
                }
            },
            repeat: length - 1,
            delay: delay
        });
    }

}