const canvas       = document.getElementById('gameCanvas');
const ctx          = canvas.getContext('2d');
const startBtn     = document.getElementById('startBtn');
const restartBtn   = document.getElementById('restartBtn');
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
  if (keys[e.key]) {
    direction = keys[e.key];
  }
});

function draw(state) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'lime';
  for (let i = 1; i < state.snake.length; i++) {
    const [x, y] = state.snake[i];
    ctx.fillRect(x * size, y * size, size - 1, size - 1);
  }

  const [hx, hy] = state.snake[0];
  ctx.fillStyle = 'lime';
  ctx.fillRect(hx * size, hy * size, size - 1, size - 1);

  const [dx, dy] = state.direction;  
  let eyeOffsets;
  if (dx === 1) {           
    eyeOffsets = [[0.7, 0.3], [0.7, 0.7]];
  } else if (dx === -1) {   
    eyeOffsets = [[0.3, 0.3], [0.3, 0.7]];
  } else if (dy === 1) {    
    eyeOffsets = [[0.3, 0.7], [0.7, 0.7]];
  } else {                  
    eyeOffsets = [[0.3, 0.3], [0.7, 0.3]];
  }

  ctx.fillStyle = 'black';
  const eyeR = size * 0.12;
  for (const [ox, oy] of eyeOffsets) {
    ctx.beginPath();
    ctx.arc(
      hx * size + ox * size,
      hy * size + oy * size,
      eyeR, 0, Math.PI * 2
    );
    ctx.fill();
  }

  ctx.fillStyle = 'red';
  const [fx, fy] = state.food;
  ctx.fillRect(fx * size, fy * size, size - 1, size - 1);

  ctx.fillStyle = 'white';
  for (const [bx, by] of state.bombs) {
    ctx.beginPath();
    ctx.arc(
      bx * size + size / 2,
      by * size + size / 2,
      size / 2.5, 0, Math.PI * 2
    );
    ctx.fill();
  }

  scoreElement.innerText = `Score: ${state.score}`;

  if (state.game_over) {
    ctx.fillStyle = 'white';
    ctx.font      = '30px Arial';
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
  const difficulty = document.getElementById('difficulty').value;
  fetch(`/start?difficulty=${difficulty}`)
    .then(res => res.json())
    .then(() => {
      startBtn.style.display   = 'none';
      restartBtn.style.display = 'inline-block';
      startGameLoop();
    });
});

restartBtn.addEventListener('click', () => {
  const mode = document.getElementById('difficulty').value;
  fetch('/restart', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({mode})
  })
  .then(() => fetch(`/start?difficulty=${mode}`))
  .then(res => res.json())
  .then(() => {
    direction = 'RIGHT';
    restartBtn.style.display = 'none';
    startGameLoop();
  });
});