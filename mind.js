class Mind extends Phaser.Scene {

constructor(){
    super({
        key: "Mind", // Chave a ser chamada para que essa cena se inicie
        backgroundColor: '#000' // Cor do fundo do frame
    });
}

init() {
    this.ground = { // Cria o objeto chão
        obj: null // Objeto do chão
    }

    this.player = { //Cria o objeto player
        width: 74, // Largura do frame do jogador na spritesheet
        height: 87, // Altura do frame do jogador na spritesheet
        obj: null, // Objeto do jogador
        speed: 250, // Define a velocidade horizontal do jogador
        jumpVelocity: -200, // Define a velocidade do pulo do jogador
        isFacingLeft: false // Propriedade que define qual direção o jogador está virado
    }

    this.brains = null; // Grupo dos cérebros que caem
    this.hearts = null; // Grupo dos corações que caem
    this.scoreBrain = 0; // Contador para a quantidade de cérebros que foram pegos
    this.scoreHeart = 0; // Contador para a quantidade de corações que foram pegos
    this.scoreTextBrain = null; // Texto para o contador de cérebros
    this.scoreTextHeart = null; // Texto para o contador de corações
    this.caecai = []; // Lista para armazenar os cérebros e corações que caem
}

preload() {
    this.load.image('bgFase', 'assets/fundoFase.png'); // Carregamento da imagem do plano de fundo
    this.load.spritesheet('player', 'assets/player.webp', {frameWidth: 74, frameHeight: 87}); // Carregamento do spritesheet do personagem
    this.load.image('ground', "assets/gorundBrick.png"); // Carregamento da imagem do chão
    this.load.image('brain', 'assets/brain.png'); // Carregamento da imagem do cérebro
    this.load.image('heart', 'assets/heart.png'); // Carregamento da imagem do coração
}

create() {
    this.add.image(480, 270, 'bgFase'); // Adiciona a imagem do plano de fundo
    this.ground.obj = this.physics.add.staticImage(500, 500, 'ground').setScale(2); // Adiciona a imagem do chão
    this.player.obj = this.physics.add.sprite(100, 300, 'player').setScale(1.3); // Adiciona o sprite do jogador
    this.player.obj.setCollideWorldBounds(true); // Colisão do personagem com a borda do mundo
    
    // Ajusta o tamanho e a posição do player
    this.player.obj.setSize(50, 80).setOffset(12, 5); // Adjust values as needed
    
    this.anims.create({ // Animação do jogador parado
        key: 'stand',
        frames: this.anims.generateFrameNumbers('player', { start: 7, end: 7 }),
        frameRate: 30,
        repeat: -1
    });

    this.anims.create({ // Animação do jogador andando
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 26 }),
        frameRate: 30,
        repeat: -1
    });

    this.player.obj.anims.play('stand'); // Inicia a animação do jogador parado
    this.cursors = this.input.keyboard.createCursorKeys(); // Cria as teclas para o controle do personagem
    this.physics.add.collider(this.player.obj, this.ground.obj); // Colisão entre jogador e chão

    // Cria um grupo para os cérebros e os corações
    this.brains = this.physics.add.group(); // Física dos cérebros
    this.hearts = this.physics.add.group(); // Física dos corações

    // Display dos contadores
    this.scoreTextBrain = this.add.text(16, 16, 'Brain: 0', { fontSize: '32px', fill: '#fff' });
    this.scoreTextHeart = this.add.text(16, 56, 'Heart: 0', { fontSize: '32px', fill: '#fff' });

    // Gera os objetos que caem a cada entre 1 a 3 segundos
    this.time.addEvent({ delay: Phaser.Math.Between(1000, 3000), callback: this.generatebrain, callbackScope: this, loop: true });
    this.time.addEvent({ delay: Phaser.Math.Between(1000, 3000), callback: this.generateheart, callbackScope: this, loop: true });
    
    // Colisão entre o jogador e os objetos
    this.physics.add.overlap(this.player.obj, this.brains, this.collectbrain, null, this);
    this.physics.add.overlap(this.player.obj, this.hearts, this.collectheart, null, this);

    // Colisão da borda do frame
    this.physics.world.setBoundsCollision(true, true, true, false);
}

update() {
    // Movimentação do personagem
    if (this.cursors.left.isDown) { // Movimentação do personagem para a esquerda
        this.player.obj.setVelocityX(-this.player.speed); // Velocdade do jogador (negativa para ir para o outro lado)
        this.player.obj.anims.play('walk', true); // COmeça a animação de andar
        if (!this.player.isFacingLeft) { // Verifica se o personagem estava andando para a direita andando para a esquerda
            this.player.obj.setFlip(true, false); // Espelha o sprite do personagem
            this.player.isFacingLeft = true; // Muda o valor para true de que o personagem está andando para a esquerda
        }
    } else if (this.cursors.right.isDown) { // Movimentação do personagem para a direita
        this.player.obj.setVelocityX(this.player.speed); //Velocidade do jogador
        this.player.obj.anims.play('walk', true); // Começa a animação de andar
        if (this.player.isFacingLeft) { // Verifica se o personagem estava andando para a esquerda 
            this.player.obj.setFlip(false, false); // Caso estivesse espalhado o sprite, muda para o lado original
            this.player.isFacingLeft = false; // MUda o valor para false, porque o jogador não está indo para a esquerda
        }
    } else {
        this.player.obj.setVelocityX(0); // Caso nenhum desses botões estejam apertados, o jogador fica parado
        this.player.obj.anims.play('stand', true); // MUda a animação para a de parado
    }

    // Pulo
    if (this.cursors.up.isDown && this.player.obj.body.touching.down) { // Verifica se o jogador está no chão e apertou para pular
        this.player.obj.setVelocityY(this.player.jumpVelocity); // Adiciona velocidade vertical para o pulo
    }
}

// Função para criar os cérebros
generatebrain() {
    const randomX = Phaser.Math.Between(0, this.sys.game.config.width); // Cria uma variável constante que assume um valor aleatório para X
    const fallingObject = this.brains.create(randomX, 0, 'brain').setScale(0.3); // Cria um cérebro na posição aleatória X
    fallingObject.setVelocityY(50); // Velocidade em que o cérebro cai
    fallingObject.setSize(300, 200) // Muda a hitbox do cérebro
}

// Função para criar os corações 
generateheart() {
    const randomX = Phaser.Math.Between(0, this.sys.game.config.width); // Cria uma variável constante que assume um valor aleatório para X
    const fallingObject = this.hearts.create(randomX, 0, 'heart').setScale(0.18); // Cria um coração na posição aleatória X
    fallingObject.setVelocityY(30); // Velocidade em que o coração cai
}

// Função para coletar os cérebros
collectbrain(player, fallingObject) {
    fallingObject.destroy(); // Destrói o cérebro
    this.scoreBrain += 2; // Aumenta o valor do contador do cérebro em 2
    this.scoreTextBrain.setText('Brain: ' + this.scoreBrain); // Atualiza o texto do contador dos cérebros
    this.scoreHeart -= 1; // Diminui o valor do contador do coração em 1
    this.scoreTextHeart.setText('Heart: ' + this.scoreHeart); // Atualiza o texto do contador dos corações
    this.checkEndGame(); // Verifica se o jogo deve acabar
}

//Função para coletar os corações
collectheart(player, fallingObject) {
    fallingObject.destroy(); // Destrói o coração
    this.scoreHeart += 2; // Aumenta o valor do contador do coração em 2
    this.scoreTextHeart.setText('Heart: ' + this.scoreHeart); // Atualiza o texto do contador dos corações
    this.scoreBrain -= 1; // Diminui o valor do contador do cérebro em 1
    this.scoreTextBrain.setText('Brain: ' + this.scoreBrain); // Atualiza o texto do contador dos cérebros
    this.checkEndGame(); // Verifica se o jogo deve acabar
}

//Função que verifica se o jogo acabou
  checkEndGame() {
    if (this.scoreBrain >= 20 || this.scoreHeart >= 20) { // Se o contador tanto dos cérebros ou dos corações for maior ou igual a 20, o jogo acaba
        this.scene.pause(); // Pausa a cena do jogo
        this.add.rectangle(480, 270, 960, 540, 0x000000, 0.5); // Adiciona um retângulo escuro com 50% de opacidade para escurecer a tela de fim de jogo
        let result = this.scoreBrain >= 20 ? 'Brain' : 'Heart'; // Determina qual contador que fez o jogador ganhar
        this.add.text(480, 270, 'You are more ' + result, { fontSize: '32px', fill: '#fff', align: 'center' }).setOrigin(0.5); // adiciona o texto da tela final
        }
    }

  generatecaecai() { // Gera os objetos que caem a cada entre 1 a 3 segundos
    this.time.addEvent({ delay: Phaser.Math.Between(1000, 3000), callback: this.generatebrain, callbackScope: this, loop: true });
    this.time.addEvent({ delay: Phaser.Math.Between(1000, 3000), callback: this.generateheart, callbackScope: this, loop: true });
  }
}