// window.onload = function() {
// };
const canvas = document.getElementById('canvas1');
var playButton = document.getElementById('playB');
var stopButton = document.getElementById('stopB');

stopButton.disabled = true;

const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

var hasExtraEnergy = false;
var isDead = false;
var updateFrame = true;

let frameId;
var stopNow = false;

let gameFrame = 0;
let gameSpeed = 0;
let rightArrow = false;
let stopGame = false;


let targetFrame = 0;
let targetFrame2 = 0;
let gameLevel = 1;

const numberOfEnemies = 5;
var enemiesArray = [];


var score = 0;
const maxScore = 300;
var life = 100;


const startImage = new Image();
startImage.src = 'images/start.png';

const winImage = new Image();
winImage.src = 'images/win.png';

const loseImage = new Image();
loseImage.src = 'images/lose.png';

const scoreImage = new Image();
scoreImage.src = 'images/score.png';

const lifeI = new Image();
lifeI.src = 'images/lifeIcon2.png';


const coinImage = new Image();
coinImage.src = 'images/coin1.png';

const energyImage = new Image();
energyImage.src = 'images/energy.png';

const lifeImage = new Image();
lifeImage.src = 'images/lifeIcon.png';

let hitImage = new Image();
hitImage.src = "images/hit.png";


var jumpAudio = document.getElementById('jump');
var ponusAudio = document.getElementById('ponus');
var punchAudio = document.getElementById('punch');
var gameAudio = document.getElementById('game');
var hitAudio = document.getElementById('hit');

var winAudio = document.getElementById('win');
var loseAudio = document.getElementById('lose');
var energyAudio = document.getElementById('energy');
var lifeAudio = document.getElementById('life');
var roundAudio = document.getElementById('round');

gameAudio.volume = 0.5;



// bar code
const barX = 400;
const barY = 20;
const barWidth = 150;
const barHeight = 20;


function backHome(){
    window.open('../home.html', '_self', '', true);
}



let booms = [];

let shakeDuration = 0;
let shakeIntensity = 10;

let boomImage = new Image();
boomImage.src = "images/boom.png";


class Boom {
    constructor(x, y, image) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.spriteWidth = 500 / 5;
        this.spriteHeight = 90;
        this.width = 100;
        this.height = 90;
        this.frame = 0;
        this.gameFrame = 0;
    }

    update(collection) {
        if (this.gameFrame % 3 == 0) {
            if (this.frame > 5) {
                this.destroy(collection);

            } else {
                this.frame++;
            }

        }
        this.gameFrame++;
    }

    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
    }

    destroy(collection) {
        const index = collection.indexOf(this);
        if (index > -1) {
            collection.splice(index, 1);
        }
    }
}





const backgroundLayer1 = new Image();
backgroundLayer1.src = "images/backgroundLayers/layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "images/backgroundLayers/layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "images/backgroundLayers/layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "images/backgroundLayers/layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "images/backgroundLayers/layer-5.png";


class layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }

    update() {
        this.speed = gameSpeed * this.speedModifier;
        this.x = (this.x - this.speed) % this.width;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
};



const layer1 = new layer(backgroundLayer1, 0.2);
const layer2 = new layer(backgroundLayer2, 0.5);
const layer3 = new layer(backgroundLayer3, 0.5);
const layer4 = new layer(backgroundLayer4, 0.5);
const layer5 = new layer(backgroundLayer5, 1);

const layers = [layer1, layer2, layer3, layer4, layer5];


class Player {
    constructor(images) {
        this.images = images;
        this.states = [
            { 'state': 'idel', 'start': 0, 'end': 20, 'source': 0 }, //0
            { 'state': 'ko', 'start': 0, 'end': 40, 'source': 3 },   //1
            { 'state': 'punch', 'start': 21, 'end': 30, 'source': 0 },//2
            { 'state': 'jump', 'start': 0, 'end': 32, 'source': 2 }, //3
            { 'state': 'run', 'start': 11, 'end': 29, 'source': 1 }, //4
        ];

        this.x = 0;
        this.y = CANVAS_HEIGHT - 350;
        this.stopping = false;
        this.currentFrame = 0;
        this.currentState = this.states[0];
        this.frameRate = 60;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / this.frameRate;
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = 0.5;
        this.jumpStrength = -11;
        this.grounded = true;
        this.isPunching = false;


    }

    update() {

        if (life <= 0) {
            if (updateFrame) {
                this.currentFrame = 0;
                updateFrame = false;
            }

            if (!this.grounded) {
                this.velocityY += this.gravity;
            } else {

                this.velocityY = 0;
            }


            if (this.y >= CANVAS_HEIGHT - 350) {
                this.y = CANVAS_HEIGHT - 350;
                this.grounded = true;


            } else {
                this.grounded = false;
            }

            this.y += this.velocityY;
            life = 0;
            this.currentState = this.states[1];
        } else {


            if (!this.isPunching) {
                if (!rightArrow && this.grounded) {
                    gameSpeed = 0;

                    this.currentState = this.states[0];
                } else if (this.grounded) {
                    if (targetFrame > gameFrame) { gameSpeed = 12; } else { gameSpeed = 6; }
                    this.currentState = this.states[4];
                }
            }

            if (!this.grounded) {
                this.velocityY += this.gravity;
            } else {

                this.velocityY = 0;
            }

            this.x += this.velocityX;
            this.y += this.velocityY;

            if (targetFrame > gameFrame) {
                this.jumpStrength = -20
            } else {
                this.jumpStrength = -11
            }

            if (!this.grounded & this.y >= CANVAS_HEIGHT - 350) {
                this.currentState = this.states[0];
                this.currentFrame = 0;
            }


            if (this.y >= CANVAS_HEIGHT - 350) {
                this.y = CANVAS_HEIGHT - 350;
                this.grounded = true;


            } else {
                this.grounded = false;
            }
        }

    }

    jump() {
        if (this.grounded) {
            this.velocityY = this.jumpStrength;
            this.grounded = false;
        }
    }



    handleInput(input) {
        switch (input) {
            case 'jump':
                this.currentFrame = 0;
                this.currentState = this.states[3];
                this.jump();
                break;

            case 'run':
                if (this.grounded) {
                    this.currentState = this.states[4];
                    gameSpeed = 6;
                }
                break;
            case 'stop':

                this.stopping = true;
                break;

            case 'punch':
                this.isPunching = true;
                this.frameRate = 10;
                this.currentState = this.states[2];
                break;
            case 'stop_punch':
                this.isPunching = false;
                break;

            default:

        }
    }

    draw(timestamp) {
        const frameWidth = 796;
        const frameHeight = 719;

        const sourceIndex = this.currentState.source;
        const frameX = (this.currentFrame + this.currentState.start) * frameWidth;
        const frameY = 0;
        const size = this.currentState.end - this.currentState.start + 1;

        ctx.drawImage(
            this.images[sourceIndex],
            frameX, frameY, frameWidth, frameHeight,
            this.x, this.y, frameWidth / 3, frameHeight / 3
        );
        if (life <= 0) {
            this.frameRate = 5;
            this.frameInterval = 1000 / this.frameRate;
            if (timestamp - this.lastFrameTime > this.frameInterval) {
                gameSpeed = 0;
                this.currentFrame++;
                if (this.currentFrame >= size) {
                    this.currentFrame = size - 1;
                    stopNow = true;
                    playButton.disabled = false;
                    stopButton.disabled = true;
                    isDead = true;
                    playButton.innerHTML = `play<br>again`;
                }
                this.lastFrameTime = timestamp;

            }


        } else {

            if (timestamp - this.lastFrameTime > this.frameInterval) {
                this.currentFrame++;
                if (this.currentFrame >= size) {
                    this.currentFrame = 0;
                }
                this.lastFrameTime = timestamp;
            }
        }
    }
}




const images = [
    new Image(), // idel_punch image
    new Image(), // run image
    new Image(), // jump image
    new Image()  // ko image
];

images[0].src = 'images/player1/idel&bunch.png';
images[1].src = 'images/player1/run.png';
images[2].src = 'images/player1/jump.png';
images[3].src = 'images/player1/ko.png';

const player = new Player(images);

document.addEventListener('keydown', function (event) {
    if (!stopGame) {
        switch (event.key) {
            case 'ArrowRight':
                rightArrow = true;
                player.handleInput('run')
                break;
            case 'ArrowLeft':
                break;
            case 'ArrowUp':

                jumpAudio.play();
                player.handleInput('jump');

                break;
            case 'ArrowDown':
                player.handleInput('down')
                break;
            case ' ':
                punchAudio.play();
                player.handleInput('punch')
                break;
            default:
        }
    }
});





document.addEventListener('keyup', function (event) {
    switch (event.key) {
        case 'ArrowRight':
            rightArrow = false;
            player.handleInput('stop');
            break;
        case 'ArrowLeft':
            break;
        case 'ArrowUp':
            break;
        case ' ':
            player.handleInput('stop_punch')
            break;
        case 'ArrowDown':
            break;

        default:
            break;
    }
});



let enemy1Image = new Image();
enemy1Image.src = "images/enemy1.png";

let enemy2Image = new Image();
enemy2Image.src = "images/enemy2.png";


let enemy3Image = new Image();
enemy3Image.src = "images/enemy3.png";


let enemy4Image = new Image();
enemy4Image.src = "images/enemy4.png";


let enemy5Image = new Image();
enemy5Image.src = "images/enemy5.png";


let enemy6Image = new Image();
enemy6Image.src = "images/enemy6.png";


let enemy7Image = new Image();
enemy7Image.src = "images/enemy7.png";




var enemies = [
    {
        'ew': 293,
        'eh': 155,
        'count': 6,
        'image': enemy1Image
    },

    {
        'ew': 1917 / 9,
        'eh': 212,
        'count': 9,
        'image': enemy2Image
    },
    {

        'ew': 1596 / 6,
        'eh': 188,
        'count': 6,
        'image': enemy3Image
    }
    , {
        'ew': 1904 / 8,
        'eh': 167,
        'count': 8,
        'image': enemy4Image
    }
    ,
    {

        'ew': 1626 / 6,
        'eh': 155,
        'count': 6,
        'image': enemy5Image
    },
    {

        'ew': 1308 / 6,
        'eh': 177,
        'count': 6,
        'image': enemy6Image
    }

    // , {

    //     'ew': 499 / 6,
    //     'eh': 44,
    //     'count':6,
    //     'image':enemy7Image
    // }

]




class Enemy {
    constructor(size, image, spriteWidth, spriteHeight) {
        this.image = image;
        this.spriteWidth = spriteWidth;//293;
        this.spriteHeight = spriteHeight;//155;
        this.size = size;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - 200 - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);

    }
    update() {
        score

        this.x += Math.random() * 5 - 2.5 - gameSpeed * 0.6;
        this.y += Math.random() * 5 - 2.5;
        if (gameFrame % this.flapSpeed === 0) {
            this.frame > this.size ? this.frame = 0 : this.frame++;
        }
        if (this.x < 0) {
            this.updatePostion()
        }
    }
    updatePostion() {
        this.x = CANVAS_WIDTH;
        this.y = Math.random() * (canvas.height - 200 - this.height);

    }
    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
    }
};



for (let i = 0; i < numberOfEnemies; i++) {
    var n = getRandomInRange(0, 5);
    enemiesArray.push(new Enemy(enemies[n].count - 2,
        enemies[n].image,
        enemies[n].ew,
        enemies[n].eh
    ));
}





class Coin {
    constructor() {
        this.x = CANVAS_WIDTH;
        this.y = getRandomInRange(200, CANVAS_HEIGHT - 200);
        this.spriteWidth = 563;
        this.spriteHeight = 700;
        this.width = 50;
        this.height = 55;
        this.frame = 0;
        this.angle = 0;
        this.speed = Math.random() * 3 + 1;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    }

    update() {
        this.x -= gameSpeed * 0.8;
        this.y += Math.sin(this.angle);
        this.angle += 0.2;

        if (gameFrame % 3 == 0) {
            if (this.frame > 8) {
                this.frame = 1;
            } else {
                this.frame++;
            }
        }
        if (this.x < 0) {
            this.x = CANVAS_WIDTH;
            this.y = getRandomInRange(200, CANVAS_HEIGHT - 200);

        }
    }

    draw() {
        ctx.drawImage(coinImage, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height)
    }
}




class LifeIcon {
    constructor() {
        this.x = CANVAS_WIDTH * 2;
        this.y = getRandomInRange(200, CANVAS_HEIGHT - 200);
        this.width = 100;
        this.height = 100;
        this.angle = 5;

    }

    update() {
        this.x -= gameSpeed * 0.6;
        this.y += Math.sin(this.angle);
        this.angle += 0.2;
        if (this.x < 0) {
            this.x = CANVAS_WIDTH * 2;
            this.y = getRandomInRange(200, CANVAS_HEIGHT - 200);
        }
    }
    draw() {
        ctx.drawImage(lifeImage, this.x, this.y, this.width, this.height);
    }
}


class EnergyIcon {
    constructor() {
        this.x = CANVAS_WIDTH * 2.5;
        this.y = getRandomInRange(200, CANVAS_HEIGHT - 200);
        this.width = 100;
        this.height = 100;
        this.angle = 5;

    }

    update() {
        this.x -= gameSpeed * 0.5;
        this.y += Math.sin(this.angle);
        this.angle += 0.2;
        if (this.x < 0) {
            this.x = CANVAS_WIDTH * 2.5;
            this.y = getRandomInRange(200, CANVAS_HEIGHT - 200);
        }
    }
    draw() {
        ctx.drawImage(energyImage, this.x, this.y, this.width, this.height);
    }
}


const coin1 = new Coin();
const lifeIcon = new LifeIcon();
const energyIcon = new EnergyIcon();

function animateBackground(timestamp) {

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (life <= 0) {

    }
    if (score >= maxScore && gameLevel === 1) {
        targetFrame2 = gameFrame + 300;
        score = 0;
        roundAudio.play();
        gameLevel = 2;

        while (enemiesArray.length < 50) {

            var n = getRandomInRange(0, 5);
            enemiesArray.push(new Enemy(enemies[n].count - 2,
                enemies[n].image,
                enemies[n].ew,
                enemies[n].eh
            ));
        }
    }



    layers.forEach((layer) => {
        layer.update();
        layer.draw();
    });
    if (!(targetFrame2 >= gameFrame) && !stopGame) {

        enemiesArray.forEach(enemy => {
            enemy.update();
            enemy.draw();

        });

    }
    gameFrame++;

    coin1.update();
    coin1.draw();

    lifeIcon.update();
    lifeIcon.draw();

    energyIcon.update();
    energyIcon.draw();


    player.update();
    player.draw(timestamp);


    booms.forEach(boom => {
        boom.update(booms);
        boom.draw();

    });

    drawScoreBar()
    drawEnergyBar();

    if (!stopGame) {
        detectCollesion(player, enemiesArray, coin1);
    }
    if (score >= maxScore && gameLevel === 2) {

        gameAudio.pause();
        winAudio.play();
        gameSpeed = 0;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        stopGame = true;
        playButton.disabled = false;
        stopButton.disabled = true;
        isDead = true;

        playButton.innerHTML = `play<br>again`;

        ctx.drawImage(winImage, 100, 100);


    }
    if (life <= 0) {

        gameAudio.pause();
        loseAudio.play();
        player.frameRate = 60;
        player.frameInterval = 1000 / player.frameRate;
        gameSpeed = 0;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(loseImage, 0, 80, 785, 400);


    }

    // console.log("stop now:::" + stopNow)
    // console.log("stop game:::" + stopGame)

    if (!stopNow && !stopGame) {

        requestAnimationFrame(animateBackground);
    }
}



playButton.addEventListener('click', function () {
    if (isDead) {
        enemiesArray = [];


        for (let i = 0; i < numberOfEnemies; i++) {
            var n = getRandomInRange(0, 5);
            enemiesArray.push(new Enemy(enemies[n].count - 2,
                enemies[n].image,
                enemies[n].ew,
                enemies[n].eh
            ));
        }


        score = 0;
        life = 100;
        isDead = false;
        gameLevel = 1;
    }
    stopNow = false;
    stopGame = false;
    animateBackground();
    gameAudio.play();
    stopButton.disabled = false;
    this.disabled = true;


});


stopButton.addEventListener('click', function () {
    stopGame = true;
    gameAudio.pause();
    playButton.disabled = false;
    this.disabled = true;
    playButton.style.fontSize = '15px';
    playButton.innerText = "RESUME";
});

function detectCollesion(player, enemies, coin) {
    const playerHeight = 200;
    const playerWidth = 130;
    const playerX = player.x + 50;
    const playerY = player.y + 50;
    const coinHeight = 50;
    const coinrWidth = 50;

    const energyHeight = 60;
    const energyWidth = 60;
    const energyX = energyIcon.x + 20;
    const energyY = energyIcon.y + 20;



    const lifeHeight = 50;
    const lifeWidth = 50;
    const lifeX = lifeIcon.x + 25;
    const lifeY = lifeIcon.y + 25;


    if (
        playerX < energyX + energyHeight &&
        playerX + playerWidth > energyX &&
        playerY < energyY + energyWidth &&
        playerY + playerHeight > energyY
    ) {
        energyAudio.play();
        targetFrame = gameFrame + 100;
        energyIcon.x = CANVAS_WIDTH * 2.5;
        energyIcon.y = getRandomInRange(200, CANVAS_HEIGHT - 200);
    }

    if (
        playerX < lifeX + lifeHeight &&
        playerX + playerWidth > lifeX &&
        playerY < lifeY + lifeWidth &&
        playerY + playerHeight > lifeY
    ) {
        lifeAudio.play();
        if (life <= 90) life += 10;
        lifeIcon.x = CANVAS_WIDTH * 2;
        lifeIcon.y = getRandomInRange(200, CANVAS_HEIGHT - 200);

    }


    if (
        playerX < coin.x + coinHeight &&
        playerX + playerWidth > coin.x &&
        playerY < coin.y + coinrWidth &&
        playerY + playerHeight > coin.y
    ) {
        if (score <= maxScore - 10) score += 10;
        ponusAudio.play();
        coin.x = CANVAS_WIDTH;
        coin.y = getRandomInRange(200, CANVAS_HEIGHT - 200);
    }
    enemies.forEach(enemy => {
        const enmHeight = 70;
        const enmWidth = 120;

        if (
            playerX < enemy.x + enmWidth &&
            playerX + playerWidth > enemy.x &&
            playerY < enemy.y + enmHeight &&
            playerY + playerHeight > enemy.y
        ) {

            if (player.currentState.state == 'punch') {
                let boom = new Boom(enemy.x, enemy.y, boomImage);
                booms.push(boom);
                if (score <= maxScore) score++;
                enemy.updatePostion();
            } else {
                enemy.x += 10;
                life -= 1;
                hitAudio.play();
                for (var i = 0; i < 10; i++) {
                    ctx.drawImage(hitImage, i * 5271 / 10, 0, 5271 / 10, 635,
                        player.x, player.y + 60, 200, 200)
                }

            }
        }


    });

}



function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}






function drawScoreBar() {
    ctx.drawImage(scoreImage, barX + 160, 0, 50, 50);

    const red = Math.floor(255 - (2.55 * score));
    const green = Math.floor(2.55 * score);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(barX + 220, barY, barWidth, barHeight);
    const fillWidth = (score / maxScore) * barWidth;
    ctx.fillStyle = `rgb(${red}, ${green}, 255)`;
    ctx.fillRect(barX + 220, barY, fillWidth, barHeight);

}

function drawEnergyBar() {
    ctx.drawImage(lifeI, barX - 100, 5, 50, 50);
    const red = Math.floor(255 - (2.55 * life));
    const green = Math.floor(2.55 * life);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(barX - 50, barY, barWidth, barHeight);
    const fillWidth = (life / 100) * barWidth;
    ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
    ctx.fillRect(barX - 50, barY, fillWidth, barHeight);

}

startImage.onload = function () {
    ctx.drawImage(startImage, 0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
};
