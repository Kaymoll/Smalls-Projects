// Initialisation
const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.querySelector('#message');
const messageText = document.querySelector('#messageText');
const restartButton = document.querySelector('#restartButton');

let gameRunning = false;
let score = 0;
let lives = 3;

// Objets du jeu
const ball = {
    x: canvas.width / 2, y: canvas.height - 30,
    dx: 3, dy: -3, radius: 8, color: '#5a5a5a'
};

const paddle = {
    width: 80, height: 10,
    x: (canvas.width - 80) / 2, color: '#2ECCFA'
};

// Création des briques
const bricks = [];
const brickRows = 2;
const brickCols = 5;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 10;

function createBricks() {
    for (let c = 0; c < brickCols; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRows; r++) {
            bricks[c][r] = {
                x: c * (brickWidth + brickPadding) + 30,
                y: r * (brickHeight + brickPadding) + 30,
                status: 1
            };
        }
    }
}

// Contrôles
document.addEventListener('mousemove', e => {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    }
});

document.addEventListener('touchmove', e => {
    e.preventDefault();
    const relativeX = e.touches[0].clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    }
}, { passive: false });

restartButton.addEventListener('click', startGame);

// Fonctions de dessin
function draw() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les briques
    for (let c = 0; c < brickCols; c++) {
        for (let r = 0; r < brickRows; r++) {
            if (bricks[c][r].status === 1) {
                ctx.beginPath();
                ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                ctx.fillStyle = '#4943f5';
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    // Dessiner la balle
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    // Dessiner la raquette
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();

    // Afficher score et vies
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Score: ' + score, 8, 18);
    ctx.fillText('Vies: ' + lives, canvas.width - 60, 18);

    // Collision avec les briques
    for (let c = 0; c < brickCols; c++) {
        for (let r = 0; r < brickRows; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (ball.x > brick.x && ball.x < brick.x + brickWidth &&
                    ball.y > brick.y && ball.y < brick.y + brickHeight) {
                    ball.dy = -ball.dy;
                    brick.status = 0;
                    score++;

                    if (score === brickRows * brickCols) {
                        showMessage('Bien joué !');
                        gameRunning = false;
                    }
                }
            }
        }
    }

    // Rebonds sur les murs
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
            // Ajuster la direction horizontale
            ball.dx = (ball.x - (paddle.x + paddle.width / 2)) * 0.2;
        } else if (ball.y + ball.dy > canvas.height - ball.radius) {
            lives--;
            if (lives === 0) {
                showMessage('Perdu !');
                gameRunning = false;
            } else {
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 3;
                ball.dy = -3;
                paddle.x = (canvas.width - paddle.width) / 2;
            }
        }
    }

    // Déplacement de la balle
    ball.x += ball.dx;
    ball.y += ball.dy;

    requestAnimationFrame(draw);
}

function showMessage(text) {
    messageText.textContent = text;
    messageDiv.style.display = 'block';
}

function startGame() {
    createBricks();
    score = 0;
    lives = 3;
    messageDiv.style.display = 'none';

    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 3;
    ball.dy = -3;
    paddle.x = (canvas.width - paddle.width) / 2;

    gameRunning = true;
    draw();
}

// Démarrage initial
window.onload = function () {
    showMessage('Cliquez pour commencer');
    restartButton.textContent = 'Commencer';
};
