const canvas = document.getElementById("game");
var playButton = document.getElementById('playB');
var stopButton = document.getElementById('stopB');

const ctx = canvas.getContext("2d");

let canW = canvas.width = 1450;
let canH = canvas.height = 600;
let tank = new Image();
let stopGame = false;
let numberOfBullets = 100;
let numberOfRockets = 10;
let score = 0;
let life = 100;

const heartImage = new Image();
heartImage.src = "images/heart.png";

const winImage = new Image();
winImage.src = "images/win.png";

const loseImage = new Image();
loseImage.src = "images/lose.png";

const coin = new Image();
coin.src = "images/coin.png";
const scoreImage = new Image();
scoreImage.src = "images/score.png";

tank.src = "images/tank.png"
const missile = new Image();
missile.src = "images/missile.png";
let bg = new Image();
bg.src = "images/bg.jpg"
let bulletImage = new Image();
bulletImage.src = "images/bullet.png";
let weaponItemImage2 = new Image();
weaponItemImage2.src = "images/rocket.png";

let planes = [];
let rockets = [];
for (var i = 0; i < 9; i++) {
    planes.push(new Image());
}





var lunch = document.getElementById('lunch');
var exp = document.getElementById('exp');
var fire = document.getElementById('fire');
var metal = document.getElementById('metal');
var gameAudio = document.getElementById('gameSound');
var winAudio = document.getElementById('win');
var loseAudio = document.getElementById('lose');
var reloadAudio = document.getElementById('reload');
let weaponItems = [];
let weaponItems2 = [];
let healthItems = [];
let attackPlanes = [];
let gunBullets = [];
let booms = [];

let boomImage = new Image();
boomImage.src = "images/boom.png";

lunch.volume = 0.3;
exp.volume = 0.3;




planes[0].src = "images/planes/plane1.png";
planes[1].src = "images/planes/plane2.png";
planes[2].src = "images/planes/plane3.png";
planes[3].src = "images/planes/plane4.png";
planes[4].src = "images/planes/plane5.png";
planes[5].src = "images/planes/plane6.png";
planes[6].src = "images/planes/plane7.png";
planes[7].src = "images/planes/plane8.png";
planes[8].src = "images/planes/plane9.png";

let healthPlaneImage = new Image;
healthPlaneImage.src = "images/Fly.png";

const healthItemImage = new Image();
healthItemImage.src = 'images/health.png';


const weaponPlanesImage = new Image();
weaponPlanesImage.src = 'images/weaponPlane.png';

const weaponItemImage = new Image();
weaponItemImage.src = 'images/supply.png';
stopButton.disabled = true;

var myInterval;
let firstTime =true;

playButton.addEventListener('click', function () {
    if (stopGame || firstTime) {
        firstTime =false;
        weaponItems = [];
weaponItems2 = [];
 healthItems = [];
 attackPlanes = [];
 gunBullets = [];
 booms = [];
        
for (var i = 0; i < 9; i++) {
    var n = getRandomIntBetween(0, 8);
    attackPlanes.push(new attackPlane(planes[n]));
}

        score = 0;
        life = 100;
        numberOfBullets = 100;
        numberOfRockets = 10;
        stopGame = false;
    }
    myInterval = setInterval(gameloop, 1000 / 60);
    gameAudio.play();
    playButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener('click', function () {
    clearInterval(myInterval);
    gameAudio.pause();
    playButton.innerText='Resum';
    stopButton.disabled = true;
    playButton.disabled = false;
});



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
        // console.log(booms)
        // console.log('here ')
        const index = collection.indexOf(this);
        if (index > -1) {
            collection.splice(index, 1);
        }
    }
}


class weaponPlane {

    constructor(type) {
        if (type === 0) {
            this.x = canW + getRandomIntBetween(300, 700);
        } else {
            this.x = -1 * getRandomIntBetween(300, 700);
        }

        this.y = getRandomIntBetween(30, 150);
        this.width = 70;
        this.height = 70;
        this.speed = 2;
        this.dropPos = getRandomIntBetween(100, canW - 100);
        this.drop = true;
        this.type = type;
    }

    draw() {
        if (this.type === 0) {
            ctx.drawImage(weaponPlanesImage, this.x, this.y, this.width, this.height);
        } else {
            this.speed = 3;
            ctx.drawImage(healthPlaneImage, this.x, this.y, this.width, this.height);
        }

    }
    update() {
        if (this.x < this.dropPos && this.drop && this.type == 0) {
            this.drop = false;
            dropWeaponItem(this);

        } else if (this.x > this.dropPos && this.drop && this.type == 1) {
            this.drop = false;
            drophealthItem(this);

        }
        if (this.type === 0) {
            this.x -= this.speed;
            this.y += Math.sin(this.x / 10) * 2;
        } else {
            this.x += this.speed;
        }
        if (this.x + this.width < 0 && this.type === 0) {
            this.x = canvas.width + getRandomIntBetween(300, 700);
            this.drop = true;
            this.dropPos = getRandomIntBetween(100, canW - 100);
        } else if (this.x > canW + this.width && this.type == 1) {

            this.x = -1 * getRandomIntBetween(300, 700);
            this.drop = true;
            this.dropPos = getRandomIntBetween(100, canW - 100);
        }
    }
}




class attackPlane {

    constructor(image) {
        this.x = canvas.width + getRandomIntBetween(canW, canW + 300);
        this.y = getRandomIntBetween(30, 150);
        this.width = 70;
        this.height = 70;
        this.image = image;
        this.speed = getRandomIntBetween(1, 5);
        this.currentFrame = 0;
        this.target = getRandomIntBetween(50, 200);
        this.power = 3;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update() {

        if (this.power <= 0) {

            let boom = new Boom(this.x, this.y, boomImage);
            booms.push(boom);
            exp.play();
            score += 1;
            this.power = 3;
            var n = getRandomIntBetween(0, 8);
            this.image = planes[n];

            this.speed = getRandomIntBetween(1, 5);
            this.x = canvas.width + getRandomIntBetween(0, 50);
            // console.log(attackPlanes);
        }

        this.currentFrame++;
        if (this.currentFrame >= this.target) {
            this.currentFrame = 0;
            this.target = getRandomIntBetween(50, 200);
            dropWeaponItem2(this);
        }

        this.x -= this.speed;
        if (this.x + this.width < 0) {
            var n = getRandomIntBetween(0, 8);
            this.image = planes[n];

            this.speed = getRandomIntBetween(1, 5);
            this.x = canvas.width + getRandomIntBetween(300, 700);
        }
    }
}


class Bullet {
    constructor(x, y, speed, damage) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.damage = damage;
        this.height = 60
        this.width = this.height * 0.1317;
    }
    draw(ctx) {
        this.y -= this.speed;
        ctx.drawImage(missile, this.x, this.y, this.width, this.height);
    }
}

class gunbullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.height = 20;
        this.width = 20;
        this.speed = 5;

    }
    draw() {
        ctx.drawImage(bulletImage, this.x + 16, this.y, this.width, this.height);
        ctx.drawImage(bulletImage, this.x + 51, this.y, this.width, this.height);
    }
    update() {
        this.y -= this.speed;
        if (this.y < 0) {
            const index = gunBullets.indexOf(this);
            gunBullets.splice(index, 1);
        }

    }
}
class BulletControler {
    // bullets = [];
    timeTillNextBullet = 0;
    constructor(canvas) {
        this.canvas = canvas;
    }

    shoot(x, y, speed, damage, delay) {
        if (this.timeTillNextBullet <= 0) {
            rockets.push(new Bullet(x, y, speed, damage));
            lunch.play();
            this.timeTillNextBullet = delay;
        }
        this.timeTillNextBullet--;
    }

    draw(ctx) {
        rockets.forEach((bullet) => {
            if (this.isBulletOffScreen(bullet)) {
                const index = rockets.indexOf(bullet);
                rockets.splice(index, 1);
            }
            bullet.draw(ctx)
        }
        )
    }

    isBulletOffScreen(bullet) {
        return bullet.y <= -bullet.height;
    }
}

class Tank {
    constructor(x, bulletControler) {
        this.sizeFactor = 5
        this.height = 568 / this.sizeFactor;
        this.width = 439 / this.sizeFactor;
        this.x = (canW / 2) - (this.width / 2);
        this.y = (canH) - this.height;
        this.tankSpeed = 5;
        this.counter = 0;
        this.bulletControler = bulletControler;
        document.addEventListener('keyup', this.keyup)
        document.addEventListener('keydown', this.keydown)
    }
    draw(ctx) {
        this.move();
        ctx.drawImage(tank, this.x, this.y, this.width, this.height);
        this.shoot();
    }
    move() {
        this.height = 568 / this.sizeFactor;
        this.width = 439 / this.sizeFactor;

        if (this.leftPressed) {
            if (this.x > 0) {
                this.x -= this.tankSpeed;
            }
            else if (this.x = 0) {
                this.tankSpeed = 0;
            }
        }
        if (this.rightPressed) {
            if (this.x < canW - this.width) {
                this.x += this.tankSpeed;
            }
        }
    }

    keydown = (e) => {
        if (e.code === "ArrowRight") {
            this.rightPressed = true;
        }
        if (e.code === "ArrowLeft") {
            this.leftPressed = true;
        }
        if (e.code === "KeyX") {

            this.rshootPressed = true;
            numberOfRockets -= 1;
        }
        if (e.code === "Space") {
            this.counter += 1;
            numberOfBullets -= 1;

        }

    }
    keyup = (e) => {
        if (e.code === "ArrowRight") {
            this.rightPressed = false;
        }
        if (e.code === "ArrowLeft") {
            this.leftPressed = false;
        }
        if (e.code === "KeyX") {
            this.rshootPressed = false;
        }
        // if (e.code === "Space") {
        //     this.shootPressed = false;
        // }
    }
    shoot() {

        if (this.counter > 0 && numberOfBullets > 0) {
            this.counter = 0;
            fire.play();
            gunBullets.push(new gunbullet(this.x, this.y));
        }

        if (this.rshootPressed && numberOfRockets > 0) {
            const speed = 10;
            const delay = 7;
            const damage = 10;
            const bulletx = this.x + (this.width / 2) - 4;
            const bullety = this.y;
            this.bulletControler.shoot(bulletx, bullety, speed, delay, damage,)
        }
    }
}

let supplyPlane = new weaponPlane(0);

let healthPlane = new weaponPlane(1);

const bulletControler = new BulletControler(canvas);
Tank = new Tank(100, bulletControler);

function gameloop() {
 
    if (score >= 100) {

        clearInterval(myInterval);
        // playButton.style.fontSize='15px';
        playButton.innerText='Replay!';
        gameAudio.pause();
        playButton.disabled = false;
        stopButton.disabled = true;
        stopGame = true;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canW, canH);
        winAudio.play();
        ctx.drawImage(winImage, 450, 50, 500, 500);

    } else if (life <= 0) {
        gameAudio.pause();
        playButton.style.fontSize='15px';
        playButton.innerText='Replay!';
        playButton.disabled = false;
        stopButton.disabled = true;
        clearInterval(myInterval);
        stopGame = true;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canW, canH);
        loseAudio.play();
        ctx.drawImage(loseImage, 10, 10, canW - 20, 500);
    } else {


        ctx.drawImage(bg, 0, 0, canW, canH)
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canW, canH);
        bulletControler.draw(ctx);
        Tank.draw(ctx);


        ctx.strokeStyle = 'red';

        healthPlane.draw();
        healthPlane.update();

        supplyPlane.draw();
        supplyPlane.update();

        updatehealthItems()
        updateWeaponItems2();
        updateWeaponItems();

        booms.forEach(boom => {
            boom.update(booms);
            boom.draw();

        });

        gunBullets.forEach((item) => {
            item.draw();
            item.update();
            // ctx.strokeRect(item.x, item.y, item.width, item.height);
        });

        attackPlanes.forEach((item) => {
            item.draw();
            item.update();
            // ctx.strokeRect(item.x, item.y, item.width, item.height);
        });
        drawRockets();
        drawHearts();
        drawBullets();
        drawScore();
        collesionDetection();

    }
}




function drawWeaponItem(item) {
    ctx.drawImage(weaponItemImage, item.x, item.y, item.width, item.height);
}

function drawhealthItem(item) {
    ctx.drawImage(healthItemImage, item.x, item.y, item.width, item.height);
}

function updateWeaponItems() {
    weaponItems.forEach((item, index) => {
        // ctx.strokeRect(item.x, item.y, item.width, item.height);
        item.y += item.speed;
        drawWeaponItem(item);
        if (item.y > canH) {
            weaponItems.splice(index, 1);
        }
    });
}



function dropWeaponItem(plane) {
    weaponItems.push({
        x: plane.x + plane.width / 2 - 12.5,
        y: plane.y + plane.height,
        width: 70,
        height: 70,
        speed: 3
    });
}

function drophealthItem(plane) {
    healthItems.push({
        x: plane.x + plane.width / 2 - 12.5,
        y: plane.y + plane.height,
        width: 50,
        height: 50,
        speed: 3
    });

}
function updatehealthItems() {
    healthItems.forEach((item, index) => {
        // ctx.strokeRect(item.x, item.y, item.width, item.height);
        item.y += item.speed;
        drawhealthItem(item);
        if (item.y > canvas.height) {
            healthItems.splice(index, 1);
        }
    });
}


function getRandomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function drawWeaponItem2(item) {
    ctx.drawImage(weaponItemImage2, item.x, item.y, item.width, item.height);
}
function updateWeaponItems2() {
    weaponItems2.forEach((item, index) => {
        item.y += item.speed;

        drawWeaponItem2(item);
        if (item.y > canvas.height) {
            weaponItems2.splice(index, 1);
        }
    });
}

function dropWeaponItem2(plane) {
    weaponItems2.push({
        x: plane.x + plane.width / 2 - 12.5,
        y: plane.y + plane.height,
        width: 25,
        height: 50,
        speed: 3
    });
}
function drawBullets() {
    let x = 10;
    let y = 10;
    for (var i = 0; i < numberOfBullets; i++) {
        ctx.drawImage(bulletImage, x + (i * 2), y, 20, 20);
    }
}

function drawRockets() {
    let x = 10;
    let y = 50;
    for (var i = 0; i < numberOfRockets; i++) {
        ctx.drawImage(missile, x + (i * 10), y, 10, 50);
    }
}
function drawHearts() {
    let x = canW - 50;
    let y = 0;

    for (var i = 0; i < life; i++) {
        ctx.drawImage(heartImage, x - (i * 2), y, 60, 60);
    }
}

function drawScore() {
    let x = canW - 35;
    let y = 60;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(canW - 235, 60, 225, 30);

    ctx.drawImage(scoreImage, canW - 265, 50, 40, 40);
    for (var i = 0; i < score; i++) {
        ctx.drawImage(coin, x - (i * 2), y, 30, 30);
    }
}

let addPlanes = true;
// score =45;
function collesionDetection() {


    if (score >= 50 && addPlanes) {
        addPlanes = false;

        for (var i = 0; i < 5; i++) {
            var n = getRandomIntBetween(0, 8);
            attackPlanes.push(new attackPlane(planes[n]));
        }

    }
    weaponItems.forEach((item) => {
        if (
            item.x < Tank.x + Tank.width &&
            item.x + item.width > Tank.x &&
            item.y < Tank.y + Tank.height &&
            item.y + item.height > Tank.y
        ) {
            numberOfBullets = 100;
            numberOfRockets = 20;
            const index = weaponItems.indexOf(item);
            weaponItems.splice(index, 1);
            reloadAudio.play();

        }
    });

    weaponItems2.forEach((item) => {
        if (
            item.x < Tank.x + Tank.width &&
            item.x + item.width > Tank.x &&
            item.y < Tank.y + Tank.height &&
            item.y + item.height > Tank.y
        ) {
            life -= 10;
            item.power -= 1;
            metal.play();
            const index = weaponItems2.indexOf(item);
            weaponItems2.splice(index, 1);

        }

    });
    healthItems.forEach((item) => {
        if (
            item.x < Tank.x + Tank.width &&
            item.x + item.width > Tank.x &&
            item.y < Tank.y + Tank.height &&
            item.y + item.height > Tank.y
        ) {
            life = 100;
            const index = healthItems.indexOf(item);
            healthItems.splice(index, 1);

        }
    });



    attackPlanes.forEach((item) => {
        gunBullets.forEach((gunItem) => {
            if (
                item.x < gunItem.x + gunItem.width &&
                item.x + item.width > gunItem.x &&
                item.y < gunItem.y + gunItem.height &&
                item.y + item.height > gunItem.y
            ) {
                item.power -= 1;
                const index = gunBullets.indexOf(gunItem);
                gunBullets.splice(index, 1);
            }

        });


        // ctx.strokeRect(item.x, item.y, item.width, item.height);
    });

    attackPlanes.forEach((item) => {
        rockets.forEach((gunItem) => {
            if (
                item.x < gunItem.x + gunItem.width + 40 &&
                item.x + item.width > gunItem.x &&
                item.y < gunItem.y + gunItem.height &&
                item.y + item.height > gunItem.y
            ) {

                let boom = new Boom(item.x, item.y, boomImage);
                booms.push(boom);
                exp.play();
                score += 1;

                item.power = 3;
                var n = getRandomIntBetween(0, 8);
                item.image = planes[n];

                item.speed = getRandomIntBetween(1, 5);
                item.x = canvas.width + getRandomIntBetween(0, 50);
                // console.log(attackPlanes);


            }

            // ctx.strokeRect(gunItem.x-20, gunItem.y, gunItem.width+40, gunItem.height);
        });



    });



}