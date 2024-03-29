// Esta clase se encarga de escribir texto de forma progresiva o instantaneamente, teniendo encuenta además la fuente, el ancho
// hasta el salto a la siguiente línea y la emisión de eventos
export default class dialogBox extends Phaser.GameObjects.Text {
	constructor(scene, x, y, width){
		super(scene,x,y);
		this.scene.add.existing(this);
		this.textToDisplay = ''; 		// El texto que va a escribir
		this.timePerLetter = 25; 		// Tiempo entre letras en milisegundos
		this.isWritting = false; 		// Indica si actualmente esta escribiendo
		this.letterPos = 0; 			// Indica la posicion actual de la letra que va a escribir
		this.setWordWrapWidth(width); 	// Indica cuando hace el salto de linea
		this.setLineSpacing(10); 		// Indica el espaciado entre lineas

    	// Cambia la fuente del texto
		this.setFontFamily('Silkscreen');
		this.setColor('#856127');
		/* Si quiereis cambiar el tamaño de la letra usar esta instruccion, 
		volver a contar los caracteres por linea y actualizar el comentario de setTextToDisplay */
		//this.setFontSize(70);
		this.setFontSize(12);
	//	this.emitter = EventDispatcher.getInstance();
	}

	// Este metodo sirve para pasarle el texto que se quiere escribir, el maximo de caracteres es de 160
	setTextToDisplay(text){
	// En caso de que se este escribiendo algo sale un error e impide que se pise el texto actual
		if (this.isWritting === false) {
			this.textToDisplay = text;
			this.isWritting = true;
		}
		else console.log('Ya se esta escribiendo un texto'); 
	}

	// Permite cambiar la velocidad de escritura
	setTimePerLetter(time){
		this.timePerLetter = time;
	}

	// Se llama en un update y escribe letra por letra el texto
	write(){
		// Si llega al final del texto devuelve la posicion a 0 y cambia el estado de escribiendo a false
		if (this.textToDisplay.length <= this.letterPos){
			this.isWritting = false;
			this.letterPos = 0;
			return;
		}
		let letter = this.textToDisplay.charAt(this.letterPos);
		this.text += letter;
		this.updateText();
		this.letterPos++;
		if (this.textToDisplay.length <= this.letterPos) {
			//this.scene.time.delayedCall(700, () => {this.emitter.emit('finishTexting')});
		}
	}

	// Este metodo imprime directamente todo el texto en pantalla
	printText(){
		this.text = this.textToDisplay;
		this.updateText();
		this.isWritting = false;
		//this.scene.time.delayedCall(700, () => {this.emitter.emit('finishTexting')});
	}

	// Limpia el texto escrito y el texto a escribir ¡¡IMPORTANTE LLAMAR A LA FUNCION CADA VEZ QUE SE QUIERA ESCRIBIR UN NUEVO TEXTO!!
	clearText(){
		this.text = '';
		this.textToDisplay = '';
		this.letterPos = 0;
		this.isWritting = false;
		this.timePerLetter = 25;
		this.updateText();
	}
	typewriteText(text) {
        const length = text.length
        let i = 0
        this.scene.time.addEvent({
            callback: () => {
                this.text += text[i]
                ++i
            },
            repeat: length - 1,
            delay: 50
        })
    }
}