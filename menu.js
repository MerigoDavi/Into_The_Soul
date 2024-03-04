class Menu extends Phaser.Scene {

    constructor(){
        super({
            key: "Menu", // Chave dessa cena a ser chamada quando iniciar o jogo 
            backgroundColor: '#000' // Cor do fundo do frame
        });
    }

    preload() {
        this.load.image('background', 'assets/mind_heart.jpg'); // Adiciona a imagem de fundo
        this.load.image('mind', 'assets/btMind.png') // Adiciona o botão
        this.load.image('title', 'assets/title.png') // Adiciona o título do jogo
    }

    create() {
        const self = this;
        this.add.image(480, 270, 'background').setScale(0.5).setTint(0x897874);
        const sprite = this.add.sprite(480, 400, 'mind').setInteractive().setScale(0.8);
        sprite.on('pointerover', function(pointer){
            sprite.setTint(0xff0000), // Muda a cor do botão quando o mouse passa por cima
            self.hoverText.setVisible(true); // Display the hover text
        });

        // Event listener for when the mouse leaves the button
        sprite.on('pointerout', function(pointer){
            self.hoverText.setVisible(false); // Hide the hover text
            sprite.clearTint(); // Tira a cor do botão quando o mouse sai do botão
        });

        sprite.on('pointerdown', function(pointer){
            self.scene.start("Mind");
        });
        this.add.image(480, 200, 'title').setScale(1.5);

        // Add the hover text at the bottom of the screen
        this.hoverText = this.add.text(480, 500, 'You must reach 20 brains or hearts to know who you truly are!', { fontSize: '20px', fill: '#ffffff', align: 'center'});
        this.hoverText.setOrigin(0.5);
        this.hoverText.setVisible(false); // Initially hide the hover text
    }

    
    update() {

    }
}