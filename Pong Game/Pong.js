//:)
//getting elements from html file
const gameBoard = document.querySelector('#gameBoard');
const scoreText = document.querySelector('#score');
const button = document.querySelector('#button');
//to use canvas 
const context = gameBoard.getContext('2d');
//needed variables
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
let intervalId;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let paddle1 = { width: 25, height: 160, x: 10, y: 0 };
let paddle2 = { width: 25, height: 160, x: gameWidth - 25 - 10, y: gameHeight - 160 };

button.addEventListener('click', resetGame);

gameStart();

function gameStart() {
    createBall();
    nextTick();
};

function nextTick() {
    intervalId = setTimeout(() => {
        clearBoard();
        drawPaddles();
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        nextTick();
    }, 10)
};

function clearBoard() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, gameWidth, gameHeight);
    context.fillStyle = 'white';
    context.fillRect(gameWidth / 2 - 2, 0, 4, gameHeight);
};

function drawPaddles() {
    context.strokeStyle = 'gray';
    context.fillStyle = 'white';
    context.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    context.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    context.strokeStyle = 'gray';
    context.fillStyle = 'white';
    context.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    context.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
};

function createBall() {
    if (Math.round(Math.random()) == 1) { //gives o or 1
        ballXDirection = 2;
    } else {
        ballXDirection = -2;
    }
    if (Math.round(Math.random()) == 1) {
        ballYDirection = 2;
    } else {
        ballYDirection = -2;
    }
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    drawBall(ballX, ballY);
};

function moveBall() {
    ballX += ballXDirection;
    ballY += ballYDirection;
};

function drawBall(ballX, ballY) {
    context.fillStyle = 'white';
    context.strokeStyle = 'gray';
    context.beginPath();
    context.arc(ballX, ballY, 16, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
};

function checkCollision() {
    //if the ball touches the walls
    if (ballY <= 0 + 16) { //16 is the ball's radius
        ballYDirection *= -1;
    }
    if (ballY >= gameHeight - 16) {
        ballYDirection *= -1;
    }
    if (ballX <= -16) {
        player2Score++;
        updateScore();
        createBall();
        return;
    }
    if (ballX >= gameWidth + 16) {
        player1Score++;
        updateScore();
        createBall();
        return;
    }
    //if the ball touches the paddles
    if (ballX <= (paddle1.x + paddle1.width + 16)) {
        if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
            ballXDirection *= -1;
            ballX = paddle1.x + paddle1.width + 16; //so the ball doesnt get stuck behind the paddle
        }
    }
    if (ballX >= (paddle2.x - 16)) {
        if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
            ballXDirection *= -1;
            ballX = paddle2.x - 16;
        }
    }
};

window.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const paddle1Up = 87;
    const paddle1Down = 83;
    const paddle2Up = 38;
    const paddle2Down = 40;

    switch (keyPressed) {
        case (paddle1Up):
            if (paddle1.y > 0) { paddle1.y -= 40; }
            break;
        case (paddle1Down):
            if (paddle1.y < gameHeight - paddle1.height) { paddle1.y += 40; }
            break;
        case (paddle2Up):
            if (paddle2.y > 0) { paddle2.y -= 40; }
            break;
        case (paddle2Down):
            if (paddle2.y < gameHeight - paddle2.height) { paddle2.y += 40; }
            break;
    }
};

function updateScore() {
    scoreText.textContent = `${player1Score} : ${player2Score}`;
};

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    paddle1 = { width: 25, height: 160, x: 10, y: 0 };
    paddle2 = { width: 25, height: 160, x: gameWidth - 25 - 10, y: gameHeight - 160 };
    ballX = 0;
    ballY = 0;
    updateScore();
    clearInterval(intervalId);
    gameStart();
};