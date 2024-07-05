var board;
var score = 0;
var rows = 4;
var columns = 4;
let alertText = "start";
var mainAudio;

window.onload = function () {
    setGame();
}

function playAudio() {
    mainAudio = document.getElementById("mainAudio");
    mainAudio.play();
}

function pauseAudio() {
    mainAudio = document.getElementById("mainAudio");
    mainAudio.pause();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // board = [
    //     [0, 0, 0, 0],
    //     [32, 16, 8, 4],
    //     [16, 64, 2, 32],
    //     [2, 8, 64, 128]
    // ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

//game at beginning
function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        //random r, c
        let r = Math.floor(Math.random() * rows); //random number between 0 and 4
        let c = Math.floor(Math.random() * columns); //random number between 0 and 4
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("num2");
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("num" + num.toString())
        }
        else {
            tile.classList.add("num8192")
        }
    }
}

document.addEventListener("keyup", e => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    } else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    } else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    } else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
    handleGameOver();
});

function filterZero(row) {
    return row.filter(num => num != 0); //create a new array without zeros
}

function slide(row) {
    row = filterZero(row); //get rid of zeros
    //slide
    for (let i = 0; i < row.length; i++) {
        //check every repeated number
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row) //get rid of zeros after sliding
    //add zeros at row end
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function canMoveLeft(board) {
    for (let r = 0; r < rows; r++) {
        for (let c = 1; c < columns; c++) {
            if (board[r][c] != 0) {
                if (board[r][c - 1] == 0 || board[r][c - 1] == board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(board) {
    for (var r = 0; r < rows; r++) {
        for (var c = 2; c > -1; c--) {
            if (board[r][c] != 0) {
                if (board[r][c + 1] == 0 || board[r][c + 1] == board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp(board) {
    for (let c = 0; c < columns; c++) {
        for (let r = 1; r < rows; r++) {
            if (board[r][c] !== 0) {
                if (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(board) {
    for (let c = 0; c < columns; c++) {
        for (let r = rows - 2; r >= 0; r--) {
            if (board[r][c] !== 0) {
                if (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function nomove(board) {
    return (!canMoveDown(board) && !canMoveLeft(board) && !canMoveRight(board) && !canMoveUp(board));
}

function nospace(board) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return false;
            }
        }
    }
    return true;
}

function handleGameOver() {
    if (nospace(board) && nomove(board)) {
        alertText = "game over";
        //change status
        var statusElement = document.getElementById("status");
        statusElement.innerText = alertText;
        statusElement.style.color = "red";
    }
}