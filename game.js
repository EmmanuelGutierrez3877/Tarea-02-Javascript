var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }

};



var player;
var platforms;
var cursors;
var stars;
var score = 0;
var scoreText;

var bombs;
var gameOver = false;

var game = new Phaser.Game(config);
var p = [];
var ob = [];
var distancia;
var velocidad = 300;
var velocidadObj = 300;
var prob = 0.995;

function preload() {
    this.load.image('sky', 'assets/fondo.gif');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/apple.png');
    this.load.image('Off', 'assets/Off.png');
    this.load.spritesheet('dude', 'assets/ninja.png', { frameWidth: 32, frameHeight: 32 });

}

function create() {

    this.add.image(400, 300, 'sky');
    platforms = this.physics.add.group({ immovable: true, allowGravity: false });
    stars = this.physics.add.group({ immovable: true, allowGravity: false });
    bombs = this.physics.add.group({ immovable: true, allowGravity: false });

    player = this.physics.add.sprite(100, 200, 'dude').setScale(1.4);
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    aux = platforms.create(1, 500, 'ground');
    p.push(aux);
    distancia = 140;
    for (var i = 0; i < distancia; i++) {
        drawTerrain(p[i]);
    }

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

    this.physics.add.collider(player, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
    if (gameOver) {
        return;
    }


    if (cursors.left.isDown) {
        player.setVelocityX(-150);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(100);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('right', true);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
        player.setVelocityX(0);
        is_jump = true;
    }



    var dt = 5e-3;
    var offset = dt * velocidad;
    p.forEach(function (item) {
        item.x -= offset;
        if (item.x < -1) {
            drawTerrain(p[p.length - 1]);
            item.disableBody(true, true);
            p.shift();
        }
    })

    offset = dt * velocidadObj;
    ob.forEach(function (item) {
        item.x -= offset;
        if (item.x < -1) {
            item.disableBody(true, true);
            ob.shift();
        }
    })

    generaEstrella();
    generaEnemigo();
}

var dir = -1;
function drawTerrain(item) {
    if (Math.random() > 0.95) {
        dir = dir * -1;
    }
    else {
        if (item.y < 300) {
            dir = 1;
        } else if (item.y > 500) {
            dir = -1;
        }
    }

    aux = platforms.create(item.x + 6, item.y + dir, 'ground');
    p.push(aux);
}

function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);
    if (score % 50 == 0) {
        velocidadObj += 250;
        prob -= 0.005;
    }
}


function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}

function generaEstrella() {

    if (Math.random() > prob) {
        y = randomNumber(150, p[p.length - 1].y - 30);
        aux = stars.create(790, y, 'star');
        ob.push(aux);
    }

}

function generaEnemigo() {
    if (Math.random() > prob) {
        y = randomNumber(150, p[p.length - 1].y - 30);
        aux = bombs.create(790, y, 'Off').setScale(0.8);
        ob.push(aux);
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}