var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('psych', 'assets/mind_heart.jpg')
}

function create() {
    this.add.image(480, 270, 'psych').setScale(0.5)
}

function update() { 

}