const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

let direction = 'RIGHT';
let intervalId = null;
const size = 20;

document.addEventListener('keydown', (e) => {
    const keys = {ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT'};
    if (keys[e.key]) direction = keys[e.key];
});

function draw(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (state.game_over) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2);
        stopGameLoop();
        restartBtn.style.display = 'inline-block';
        return;
    }

    ctx.fillStyle = 'lime';
    for (let [x, y] of state.snake) {
        ctx.fillRect(x * size, y * size, size - 1, size - 1);
    }

    ctx.fillStyle = 'red';
    let [fx, fy] = state.food;
    ctx.fillRect(fx * size, fy * size, size - 1, size - 1);
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

let scoreElement = document.getElementById('score');

function drawGame(state) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#0f0';
    state.snake.forEach(([x, y]) => {
        context.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    });
    context.fillStyle = '#f00';
    let [fx, fy] = state.food;
    context.fillRect(fx * gridSize, fy * gridSize, gridSize, gridSize);

    scoreElement.innerText = `Score: ${state.score}`;

    if (state.game_over) {
        context.fillStyle = '#fff';
        context.font = '20px Arial';
        context.fillText("Game Over", canvas.width / 2 - 50, canvas.height / 2);
        clearInterval(gameInterval);
        document.getElementById("restartButton").style.display = "block";
    }
}
