// TI-83 Snake Game - Complete Implementation

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Game variables
let snake: Array<{x: number, y: number}> = [{x: 8, y: 8}];
let direction = {x: 1, y: 0};
let nextDirection = {x: 1, y: 0};
let food = {x: 12, y: 10};
let score = 0;
let gameRunning = true;

const TILE_SIZE = 20;
const GRID_WIDTH = 16;
const GRID_HEIGHT = 16;

// Initialize canvas
canvas.width = GRID_WIDTH * TILE_SIZE;
canvas.height = GRID_HEIGHT * TILE_SIZE;

// Keyboard event listener
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            if(direction.y === 0) nextDirection = {x: 0, y: -1};
            e.preventDefault();
            break;
        case 'ArrowDown':
            if(direction.y === 0) nextDirection = {x: 0, y: 1};
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if(direction.x === 0) nextDirection = {x: -1, y: 0};
            e.preventDefault();
            break;
        case 'ArrowRight':
            if(direction.x === 0) nextDirection = {x: 1, y: 0};
            e.preventDefault();
            break;
    }
});

// Button listeners
document.getElementById('btn-up')?.addEventListener('click', () => {
    if(direction.y === 0) nextDirection = {x: 0, y: -1};
});
document.getElementById('btn-down')?.addEventListener('click', () => {
    if(direction.y === 0) nextDirection = {x: 0, y: 1};
});
document.getElementById('btn-left')?.addEventListener('click', () => {
    if(direction.x === 0) nextDirection = {x: -1, y: 0};
});
document.getElementById('btn-right')?.addEventListener('click', () => {
    if(direction.x === 0) nextDirection = {x: 1, y: 0};
});

function update() {
    if (!gameRunning) return;

    direction = nextDirection;

    // New head position
    const head = snake[0];
    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= GRID_WIDTH || newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
        gameRunning = false;
        return;
    }

    // Self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameRunning = false;
        return;
    }

    snake.unshift(newHead);

    // Food collision
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        spawnFood();
    } else {
        snake.pop();
    }
}

function spawnFood() {
    let validPosition = false;
    while (!validPosition) {
        food = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT)
        };
        validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= GRID_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(canvas.width, i * TILE_SIZE);
        ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#1a1a1a' : '#333333';
        ctx.fillRect(segment.x * TILE_SIZE + 1, segment.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(food.x * TILE_SIZE + TILE_SIZE / 2, food.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Game over screen
    if (!gameRunning) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '14px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    }
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        setTimeout(gameLoop, 100);
    }
}

// Start game
gameLoop();
