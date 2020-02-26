
class Paddle {
    constructor(gameHeight, gameWidth) {
        this.paddleWidth = 100;
        this.paddleHeight = 20;
        this.paddleStartX = gameWidth / 2 - this.paddleWidth / 2;
        this.paddleStartY = gameHeight - this.paddleHeight - 2;

        this.paddleSpeed = 10;
        this.gameDimensions = [gameWidth, gameHeight];
    }

    draw(ctx, factor) {

        this.paddleStartX += this.paddleSpeed * factor;
        if (this.paddleStartX < 5) this.paddleStartX = 5;
        if (this.paddleStartX > this.gameDimensions[0] - this.paddleWidth - 5)
            this.paddleStartX = this.gameDimensions[0] - this.paddleWidth - 5;

        ctx.beginPath();
        ctx.fillStyle = "#00f";
        ctx.rect(
            this.paddleStartX,
            this.paddleStartY,
            this.paddleWidth,
            this.paddleHeight
        );
        ctx.fill();
        ctx.closePath();
    }
}


class Ball {
    constructor(gameHeight, gameWidth, paddle) {
        this.ballRadius = 10;
        this.ballX = Math.ceil(gameWidth / 2);
        this.ballY = Math.ceil(gameHeight - paddle.paddleHeight - this.ballRadius - 5);

        this.ballSpeed = { x: 2, y: -2 };
        this.gameDimensions = [gameWidth, gameHeight];
        this.paddle = paddle;
    }

    moveBall(ctx, paddle) {
        this.ballX = paddle.paddleStartX + paddle.paddleWidth / 2;
        this.ballY = paddle.paddleStartY - paddle.paddleHeight / 2;

        ctx.beginPath();
        ctx.arc(this.ballX,
            this.ballY,
            this.ballRadius,
            0,
            2 * Math.PI);
        ctx.fillStyle = "#f00";
        ctx.fill();
        ctx.closePath();
    }

    draw(ctx, gameStatus, lives) {
        if (this.ballX + this.ballRadius > this.gameDimensions[0] - 2 ||
            this.ballX - this.ballRadius < 2)
            this.ballSpeed.x = -this.ballSpeed.x;

        if (this.ballY - this.ballRadius < 2 ||
            this.ballY + this.ballRadius > this.gameDimensions[1] - this.paddle.paddleHeight - 1)
            this.ballSpeed.y = -this.ballSpeed.y;


        if (gameStatus === 2) {
            this.ballX += this.ballSpeed.x;
            this.ballY += this.ballSpeed.y;
        }

        ctx.beginPath();
        ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#f00";
        ctx.fill();
        ctx.closePath();

        if ((this.ballX < this.paddle.paddleStartX && (this.ballY + this.ballRadius === this.gameDimensions[1] - this.paddle.paddleHeight - 2)) ||
            (this.ballX > this.paddle.paddleStartX + this.paddle.paddleWidth && (this.ballY + this.ballRadius === this.gameDimensions[1] - this.paddle.paddleHeight - 2))) {
            document.getElementById('lives').innerText = lives -= 1;
        }
        return lives;
    }

}

class Block {
    constructor(gameHeight, gameWidth, paddle, x, y, blockWidth) {
        this.blockHeight = 20;
        this.blockWidth = blockWidth;
        this.blockX = x;
        this.blockY = y;
        this.broke = false;
        this.gameDimensions = [gameHeight, gameWidth];
        this.paddle = paddle;

    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "#0ff";
        ctx.rect(
            this.blockX,
            this.blockY,
            this.blockWidth,
            this.blockHeight
        );
        ctx.fill();
        ctx.strokeStyle = "fff";
        ctx.stroke();
        ctx.closePath();
    }

    updateBroke(ctx, ball, score, currentLevel) {
        if (!this.broke) {

            const ballTop = ball.ballY - ball.ballRadius;
            const ballBottom = ball.ballY + ball.ballRadius;
            const ballLeft = ball.ballX - ball.ballRadius;
            const ballRight = ball.ballX + ball.ballRadius;

            const blockTop = this.blockY;
            const blockBottom = this.blockY + this.blockHeight;
            const blockLeft = this.blockX;
            const blockRight = this.blockX + this.blockWidth;

            // if touches block

            if ((ballTop <= blockBottom && ballTop >= blockTop) && (ballLeft >= blockLeft && ballLeft <= blockRight) ||
                (ballBottom >= blockTop && ballBottom <= blockBottom) && (ballRight >= blockLeft && ballRight <= blockRight)
            ) {
                this.broke = !this.broke;
                score++;
                document.getElementById('score').innerText = score;


                ball.ballSpeed = { x: ball.ballSpeed.x, y: -ball.ballSpeed.y };
            }
        }
        if (!this.broke) this.draw(ctx);

        return score;
    }
}


function changeBlocks(currentLevel, gameWidth, gameHeight, Levels) {
    let blocks = [];
    let noOfBricks = (typeof (Levels[currentLevel - 1][0]) === "number") ? Levels[currentLevel - 1].length : Levels[currentLevel - 1][0].length;
    let blockWidth = Math.ceil((gameWidth - 20) / noOfBricks);
    Levels[currentLevel - 1].map((row, rowNo) => {
        if (typeof (row) === "number") {
            if (row === 1)
                blocks.push(new Block(gameHeight, gameWidth, paddle, rowNo * blockWidth + 5, 10, blockWidth));
        } else
            row.map((column, colNo) => {
                if (column === 1)
                    blocks.push(new Block(gameHeight, gameWidth, paddle, (colNo) * blockWidth + 5, (rowNo + 1) * 20, blockWidth));
            });
    })
    return blocks
}

let canvas = document.querySelector('#paddleGame');
let scoreSpan = document.getElementById('score');
let livesSpan = document.getElementById('lives');
let levelSpan = document.getElementById('level');

let gameWidth = canvas.width = 3 * (window.innerWidth / 4);
let gameHeight = canvas.height = window.innerHeight / 2;


let ctx = canvas.getContext('2d');

let blocks = [];
let Levels = [
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],

    [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
];



let score = 0;
let lives = 3;
let currentLevel = 1;

let gameStatus = 0;

const GAMESTATE = {
    NOTSTARTED: 0,
    PAUSED: 1,
    RUNNING: 2,
    LEVELCHANGE: 3,
    GAMEOVER: 4,
    WON: 5
}

let paddle = new Paddle(gameHeight, gameWidth);
let ball = new Ball(gameHeight, gameWidth, paddle);

blocks = changeBlocks(currentLevel, gameWidth, gameHeight, Levels);

document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode === 39) {
        if (gameStatus !== GAMESTATE.GAMEOVER && gameStatus !== GAMESTATE.WON) paddle.draw(ctx, +1);
        if (gameStatus === GAMESTATE.NOTSTARTED && gameStatus !== GAMESTATE.WON)
            ball.moveBall(ctx, paddle);
    }
    else if (e.keyCode === 37) {
        if (gameStatus !== GAMESTATE.GAMEOVER && gameStatus !== GAMESTATE.WON) paddle.draw(ctx, -1);
        if (gameStatus === GAMESTATE.NOTSTARTED && gameStatus !== GAMESTATE.WON)
            ball.moveBall(ctx, paddle);
    }
    else if (e.keyCode === 32) {
        spaceHandler(e)
    }
}

function spaceHandler(e) {
    if (gameStatus !== GAMESTATE.GAMEOVER && gameStatus !== GAMESTATE.WON) {
        gameStatus = GAMESTATE.RUNNING;
        lives = ball.draw(ctx, gameStatus, lives);
    }
}

scoreSpan.innerText = score;
livesSpan.innerText = lives;
levelSpan.innerText = currentLevel;



function messageHandling() {
    if (gameStatus === GAMESTATE.GAMEOVER) {
        ctx.rect(0, 0, gameWidth, gameHeight);
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fill();
        ctx.font = "40px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
    }
    else if (gameStatus === GAMESTATE.NOTSTARTED) {
        ctx.rect(0, 0, gameWidth, gameHeight);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fill();
        ctx.font = "30px Arial";
        ctx.fillStyle = "Green";
        ctx.textAlign = "center";
        ctx.fillText("Press SPACEBAR to START", gameWidth / 2, gameHeight / 2);
        ctx.fillStyle = "green";
        requestAnimationFrame(play);
    }
    else
        if (gameStatus === GAMESTATE.PAUSED) {
            ctx.rect(0, 0, gameWidth, gameHeight);
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fill();
            ctx.font = "30px Arial";
            ctx.fillStyle = "green";
            ctx.textAlign = "center";
            ctx.fillText("Press SPACEBAR to Resume", gameWidth / 2, gameHeight / 2);
            requestAnimationFrame(play);
        }
        else
            if (gameStatus === GAMESTATE.LEVELCHANGE) {
                ctx.rect(0, 0, gameWidth, gameHeight);
                ctx.fillStyle = "rgba(0,0,0,0.1)";
                ctx.fill();
                ctx.font = "24px Arial";
                ctx.fillStyle = "green";
                ctx.textAlign = "center";
                ctx.fillText(`Cleared Level` + (currentLevel - 1) + `!!!`, gameWidth / 2, gameHeight / 2 - 12);
                ctx.fillText(`Press SPACEBAR To Play Next LEVEL. `, gameWidth / 2, gameHeight / 2 + 12);
                requestAnimationFrame(play);
                // gameStatus = GAMESTATE.PAUSED;
            }
            else
                if (blocks.length === 0 && currentLevel === Levels.length) {
                    ctx.rect(0, 0, gameWidth, gameHeight);
                    ctx.fillStyle = "rgba(0,0,0,0)";
                    ctx.fill();
                    ctx.font = "30px Arial";
                    ctx.fillStyle = "green";
                    ctx.textAlign = "center";
                    ctx.fillText("YOU WON!!!", gameWidth / 2, gameHeight / 2);
                    gameStatus = GAMESTATE.WON;
                }
                else if (blocks.length === 0) {
                    currentLevel++;
                    blocks = changeBlocks(currentLevel, gameWidth, gameHeight, Levels);
                    gameStatus = GAMESTATE.LEVELCHANGE;
                    paddle = new Paddle(gameHeight, gameWidth);
                    ball = new Ball(gameHeight, gameWidth, paddle);
                    ball.ballSpeed = { x: (currentLevel - 1) + Math.abs(ball.ballSpeed.x), y: -(currentLevel - 1) - Math.abs(ball.ballSpeed.y) };
                    requestAnimationFrame(play);
                }
                else
                    requestAnimationFrame(play);
}


function play() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    paddle.draw(ctx, 0);

    if (gameStatus === GAMESTATE.RUNNING && gameStatus !== GAMESTATE.PAUSED) {

        let tempLives = lives;
        lives = ball.draw(ctx, gameStatus, lives);

        // /* start */

        // // formula angle = 90 - 2 * ( x / L) * ( 90 - minimum angle)

        // if ((ball.ballY + ball.ballRadius >= gameHeight - paddle.paddleHeight - 2) &&
        //     (ball.ballX >= paddle.paddleStartX && ball.ballX <= paddle.paddleStartX + paddle.paddleWidth)) {

        //     let dist = paddle.paddleStartX + paddle.paddleWidth / 2 - ball.ballX;
        //     let angle = 90 - (dist / (paddle.paddleWidth)) * 120;  // minimum angle 30

        //     let magnitude = Math.sqrt(2 * (currentLevel + 1) ** 2)
        //     let X = magnitude * Math.cos(Math.ceil(90 - angle));
        //     let Y = magnitude * Math.sin(Math.ceil(90 - angle));

        //     ball.ballSpeed = { x: Math.ceil(X), y: -Math.ceil(Y) }

        //     console.log(angle, X, Y, ball.ballSpeed, ball.ballX, ball.ballY);
        // }
        // /*  end */


        if (lives !== tempLives) {
            gameStatus = GAMESTATE.PAUSED;
            ball.ballSpeed = { x: ball.ballSpeed.x, y: -ball.ballSpeed.y };
        }

        if (lives === 0) gameStatus = GAMESTATE.GAMEOVER;
    }
    else if (gameStatus === GAMESTATE.NOTSTARTED || gameStatus === GAMESTATE.PAUSED || GAMESTATE.LEVELCHANGE)
        ball.moveBall(ctx, paddle);

    blocks.forEach(block => {
        score = block.updateBroke(ctx, ball, score, currentLevel)
    });

    blocks = blocks.filter(block => !block.broke);
    messageHandling();
}

requestAnimationFrame(play);