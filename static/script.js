const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreElement = document.getElementById('score');

let direction = 'RIGHT';
let intervalId = null;
const size = 20;

document.addEventListener('keydown', (e) => {
    const keys = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT'
    };
    if (keys[e.key]) direction = keys[e.key];
});

function draw(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'lime';
    for (let [x, y] of state.snake) {
        ctx.fillRect(x * size, y * size, size - 1, size - 1);
    }

    ctx.fillStyle = 'red';
    let [fx, fy] = state.food;
    ctx.fillRect(fx * size, fy * size, size - 1, size - 1);

    scoreElement.innerText = `Score: ${state.score}`;

    if (state.game_over) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2);
        stopGameLoop();
        restartBtn.style.display = 'inline-block';
    }
}

function update() {
    fetch('/move', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({direction})
    })
    .then(() => fetch('/state'))
    .then(res => res.json())
    .then(draw);
}

function startGameLoop() {
    if (!intervalId) {
        intervalId = setInterval(update, 150);
    }
}

function stopGameLoop() {
    clearInterval(intervalId);
    intervalId = null;
}

startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    startGameLoop();
});

restartBtn.addEventListener('click', () => {
    fetch('/restart').then(() => {
        direction = 'RIGHT';
        restartBtn.style.display = 'none';
        startGameLoop();
    });
});
