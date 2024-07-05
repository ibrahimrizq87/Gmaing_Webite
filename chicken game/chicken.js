//game screen
const gameWidth = 600;
const gameHeight = 600;
const playerSize = 60;
const enemySize = 70;
const bulletSize = 10;

// player movement
const playerSpeed = 6;
let playerX = gameWidth /2 - playerSize /2;
let playerY = gameHeight - playerSize - 20;
let isMovingLeft = false;
let isMovingRight = false;


//enemy
const enemySpeed = 1;
let enemies = [];

//bullet
const bulletSpeed = 5;
let bullets = [];

//score
let score = 0;

const gameScreen = document.getElementById('game-screen');
const scoreElement = document.getElementById("score");

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

let gameInterval = setInterval(updateGame, 20);


//functions

function handleKeyDown(event){
    if (event.code === "ArrowLeft") {
        isMovingLeft = true;
    } else if (event.code === "ArrowRight") {
        isMovingRight = true;
    } else if (event.code === "Space") {
        console.log("Shooting button pressed");
        shoot();
    }
}

function handleKeyUp(event) {
    if (event.code === 'ArrowLeft') {
        isMovingLeft = false;
    } else if (event.code === 'ArrowRight'){
        isMovingRight = false;
    }
}

function updateGame() {
    clearScreen();
    movePlayer();
    moveBullets();
    createEnemies();
    moveEnemies();
    checkCollisions();
    renderPlayer();
    renderBullets();
    renderEnemies();
    renderScore();
}

function clearScreen() {
    gameScreen.innerHTML = " ";
}

function movePlayer() {
    if (isMovingLeft && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (isMovingRight && playerX < gameWidth - playerSize) {
        playerX += playerSpeed;
    }
}

const shootSound = document.getElementById('shootSound');

function shoot(){
    const bullet = {
        x: playerX + playerSize / 2 - bulletSize / 2,
        y: playerY - bulletSize
    } ;
    bullets.push(bullet);
    shootSound.currentTime = 0;
    shootSound.play();
}

function moveBullets(){
    bullets = bullets.filter(bullet => bullet.y >0);
    bullets.forEach(bullet => bullet.y -= bulletSpeed);
}

function createEnemies() {
    if (Math.random() < 0.02) {
        const enemy = {
            x:Math.random() * (gameWidth - enemySize),
            y: -enemySize
        };
        enemies.push(enemy);
    }
}

function moveEnemies(){
    enemies = enemies.filter(enemy => enemy.y <gameHeight);
    enemies.forEach(enemy => enemy.y += enemySize/6);
}

function checkCollisions() {
    bullets.forEach(bullet => {
        enemies.forEach((enemy,enemyIndex) => {
            if (
                bullet.x < enemy.x + enemySize &&
                bullet.x + bulletSize > enemy.x &&
                bullet.y < enemy.y + enemySize &&
                bullet.y + bulletSize > enemy.y
            ) {
                bullets.splice(bullets.indexOf(bullet), 1);
                enemies.splice(enemyIndex, 1);
                score++;
            }
        })
    })

    enemies.forEach(enemy => {
        if (
            playerX < enemy.x + enemySize &&
            playerX + playerSize > enemy.x &&
            playerY < enemy.y + enemySize &&
            playerY + playerSize > enemy.y
        ) {
            gameOver();
        }
    });
}

function renderPlayer() { 
    const player = document.createElement('div');
    player.id = 'player';
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
    gameScreen.appendChild(player);
}

function renderBullets(){
    bullets.forEach(bullet => {
        const bulletElement = document.createElement('div');
        bulletElement.className = 'bullet';
        bulletElement.style.left= bullet.x + 'px';
        bulletElement.style.top = bullet.y + 'px';
        gameScreen.appendChild(bulletElement);
    });

}

function renderEnemies(){
    enemies.forEach(enemy => {
        const enemyElement = document.createElement('div');
        enemyElement.className = 'enemy';
        enemyElement.style.left = enemy.x + 'px';
        enemyElement.style.top = enemy.y + 'px';
        gameScreen.appendChild(enemyElement);
    })
}

function renderScore() { 
    scoreElement.textContent = 'score: ' + score;
}

function gameOver() {
    clearInterval(gameInterval);
    alert('Game Over! your score : ' + score);
}