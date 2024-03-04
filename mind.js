class Mind extends Phaser.Scene {

    constructor(){
        super({
            key: "Mind",
            backgroundColor: '#000'
        });
    }

    init() {
        this.player = {
            width: 74,
            height: 87,
            obj: null
        }
    }

    preload() {
        this.load.image('bgFase', 'assets/fundoFase.png')
        this.load.spritesheet('player', 'assets/player.webp', {frameWidth: 74, frameHeight: 85});
    }

    create() {
        const self = this;
        this.add.image(480, 270, 'bgFase');
        this.player.obj = this.physics.add.sprite(100, 300, 'player').setScale(1.3)
        this.player.obj.setCollideWorldBounds(true);
        this.anims.create({
            key: 'stand',
            frames: this.anims.generateFrameNumbers('player', { start: 7, end: 7 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 26 }),
            frameRate: 30,
            repeat: -1
        })
        this.player.obj.anims.play('stand')
        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update() {
        if (this.cursors.left.isDown)
            this.player.obj.setX(this.player.obj.x - 5);
        else if (this.cursors.right.isDown)
            this.player.obj.setX(this.player.obj.x + 5);
        else if (this.cursors.up.isDown)
            this.player.obj.setY(this.player.obj.y - 5);
    }
    
}