const canvas = document.getElementById('breakoutCanvas');
        const ctx = canvas.getContext('2d');

        const ball = { x: canvas.width / 2, y: canvas.height - 15, dx: 4, dy: -4, radius: 10 };
        const paddle = { height: 10, width: 75, x: (canvas.width - 75) / 2 };

        let rightPressed = false;
        let leftPressed = false;
        let isPaused = false;
        let gameWon = false;
        let score = 0;

        const brickRowCount = 4;
        const brickColumnCount = 5;
        const brickWidth = 75;
        const brickHeight = 20;
        const brickPadding = 10;
        const brickOffsetTop = 30;
        const brickOffsetLeft = 30;

        const hitSound = new Audio('assets/mixkit-game-ball-tap-2073.wav');
        const winSound = new Audio('assets/mixkit-game-level-completed-2059.wav');

        let bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);
        document.addEventListener("keydown", pauseHandler);

        function keyDownHandler(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = true;
            } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = true;
            }
        }

        function keyUpHandler(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = false;
            } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = false;
            }
        }

        function pauseHandler(e) {
            if (e.key === " ") {
                isPaused = !isPaused;
                if (!isPaused && !gameWon) {
                    draw();
                }
            }
        }

        function drawBall() {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }

        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }

        function drawBricks() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status == 1) {
                        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = "#0095DD";
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }

        function collisionDetection() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    const b = bricks[c][r];
                    if (b.status == 1) {
                        if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                            ball.dy = -ball.dy;
                            b.status = 0;
                            score++;
                            hitSound.play();
                            if (checkWin()) {
                                gameWon = true;
                                isPaused = true;
                                winSound.play();
                            }
                        }
                    }
                }
            }
        }

        function checkWin() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status == 1) {
                        return false;
                    }
                }
            }
            return true;
        }

        function drawWinMessage() {
            ctx.font = "24px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.textAlign = "center";
            ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
        }

        function drawScore() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText("Score: " + score, 8, 20);
        }

        function draw() {
            if (isPaused) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawBricks();
                drawBall();
                drawPaddle();
                drawScore();
                if (gameWon) {
                    drawWinMessage();
                }
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            drawScore();
            collisionDetection();

            if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
                ball.dx = -ball.dx;
            }
            if (ball.y + ball.dy < ball.radius) {
                ball.dy = -ball.dy;
            } else if (ball.y + ball.dy > canvas.height - ball.radius) {
                if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                    ball.dy = -ball.dy;
                } else {
                    document.location.reload();
                }
            }

            ball.x += ball.dx;
            ball.y += ball.dy;

            if (rightPressed && paddle.x < canvas.width - paddle.width) {
                paddle.x += 7;
            } else if (leftPressed && paddle.x > 0) {
                paddle.x -= 7;
            }

            requestAnimationFrame(draw);
        }

        draw();