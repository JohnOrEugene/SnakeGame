const canvas      = document.getElementById('gameCanvas');
const ctx         = canvas.getContext('2d');
const startBtn    = document.getElementById('startBtn');
const restartBtn  = document.getElementById('restartBtn');
const scoreElement= document.getElementById('score');

let direction = 'RIGHT';
let intervalId;
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
  // очистка
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1) Тело (без головы)
  ctx.fillStyle = 'lime';
  for (let i = 1; i < state.snake.length; i++) {
    const [x, y] = state.snake[i];
    ctx.fillRect(x * size, y * size, size - 1, size - 1);
  }

  // 2) Голова
  const [hx, hy] = state.snake[0];
  ctx.fillStyle = 'lime';
  ctx.fillRect(hx * size, hy * size, size - 1, size - 1);

  // 3) Глазки
  ctx.fillStyle = 'black';
  const eyeR = size * 0.12;
  let eyeOffsets;

  // выясняем направление по второму сегменту
  if (state.snake.length > 1) {
    const [sx, sy] = state.snake[1];
    const dx = hx - sx, dy = hy - sy;
    if (dx === 1) {            // движемся вправо
      eyeOffsets = [[0.7,0.3],[0.7,0.7]];
    } else if (dx === -1) {    // влево
      eyeOffsets = [[0.3,0.3],[0.3,0.7]];
    } else if (dy === 1) {     // вниз
      eyeOffsets = [[0.3,0.7],[0.7,0.7]];
    } else {                   // вверх (dy === -1)
      eyeOffsets = [[0.3,0.3],[0.7,0.3]];
    }
  } else {
    // если всего один сегмент
    switch(direction) {
      case 'LEFT':
        eyeOffsets = [[0.3,0.3],[0.3,0.7]];
        break;
      case 'RIGHT':
        eyeOffsets = [[0.7,0.3],[0.7,0.7]];
        break;
      case 'UP':
        eyeOffsets = [[0.3,0.3],[0.7,0.3]];
        break;
      case 'DOWN':
        eyeOffsets = [[0.3,0.7],[0.7,0.7]];
        break;
      default:
        eyeOffsets = [[0.3,0.3],[0.7,0.7]];
    }
  }
  for (const [ox, oy] of eyeOffsets) {
    ctx.beginPath();
    ctx.arc(
      hx * size + ox * size,
      hy * size + oy * size,
      eyeR, 0, 2 * Math.PI
    );
    ctx.fill();
  }

  // 4) Еда
  ctx.fillStyle = 'red';
  const [fx, fy] = state.food;
  ctx.fillRect(fx * size, fy * size, size - 1, size - 1);

  // 5) Бомбы
  ctx.fillStyle = 'white';
  for (const [bx, by] of state.bombs) {
    ctx.beginPath();
    ctx.arc(
      bx * size + size/2,
      by * size + size/2,
      size/2.5, 0, 2 * Math.PI
    );
    ctx.fill();
  }

  // 6) Счёт
  scoreElement.innerText = `Score: ${state.score}`;

  // 7) Game Over
  if (state.game_over) {
    ctx.fillStyle = 'white';
    ctx.font      = '30px Arial';
    ctx.fillText("Game Over", canvas.width/2 - 70, canvas.height/2);
    stopGameLoop();
    restartBtn.style.display = 'inline-block';
  }
}

function update() {
  fetch('/move', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
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
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({mode})
  })
  .then(() => fetch(`/start?difficulty=${mode}`))
  .then(() => {
    direction = 'RIGHT';
    restartBtn.style.display = 'none';
    startGameLoop();
  });
});



/*
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

    ctx.fillStyle = 'white'; // или 'orange', 'blue', 'purple' — на выбор
    for (let [bx, by] of state.bombs) {
        ctx.beginPath();
        ctx.arc(bx * size + size / 2, by * size + size / 2, size / 2.5, 0, 2 * Math.PI);
        ctx.fill();
    }

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
    const difficulty = document.getElementById('difficulty').value;
    fetch(`/start?difficulty=${difficulty}`).then(() => {
        startBtn.style.display = 'none';
        startGameLoop();
    });
});

restartBtn.addEventListener('click', () => {
    const mode = document.getElementById('difficulty').value;    // читаем селектор
    fetch('/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })                            // передаём корректно
    })
    .then(() => fetch(`/start?difficulty=${mode}`))             // перезапускаем с тем же режимом
    .then(() => {
        direction = 'RIGHT';
        restartBtn.style.display = 'none';
        startGameLoop();
    });
});
*/