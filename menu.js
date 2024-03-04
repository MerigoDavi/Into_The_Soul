class Menu extends Phaser.Scene {

    constructor(){
        super({
            key: "Menu",
            backgroundColor: '#000'
        });
    }

    preload() {
        this.load.image('background', 'assets/mind_heart.jpg');
        this.load.image('mind', 'assets/btMind.png')
    }

    create() {
        const self = this;
        this.add.image(480, 270, 'background').setScale(0.5).setTint(0x897874);
        const sprite = this.add.sprite(480, 400, 'mind').setInteractive().setScale(0.8);
        sprite.on('pointerdown', function(pointer){
            self.scene.start("Mind");
        });
    }

    update() {

    }
}