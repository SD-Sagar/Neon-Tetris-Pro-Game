/**
 * Game Setup - Initializes canvas elements and contexts
 * @type {HTMLCanvasElement} canvas - Main game canvas element
 * @type {CanvasRenderingContext2D} ctx - Main game canvas context
 * @type {HTMLCanvasElement} nextCanvas - Next piece preview canvas
 * @type {CanvasRenderingContext2D} nextCtx - Next piece canvas context
 */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.scale(20, 20);

const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
nextCtx.scale(30, 30);

/**
 * Sound Effects - Audio objects for game sounds
 * @type {Object} sounds - Collection of game sound effects
 * @property {Audio} lineClear - Sound when clearing lines
 * @property {Audio} drop - Sound when piece drops
 * @property {Audio} rotate - Sound when piece rotates
 * @property {Audio} gameOver - Sound when game ends
 */
const sounds = {
  lineClear: new Audio('sounds/line-clear.wav'),
  drop: new Audio('sounds/drop.wav'),
  rotate: new Audio('sounds/rotate.wav'),
  gameOver: new Audio('sounds/game-over.wav')
};

/**
 * Plays a sound effect
 * @param {Audio} audio - Audio object to play
 */
function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
}

/**
 * Background Music - Audio object for game music
 * @type {Audio} bgMusic - Background music audio object
 * @property {boolean} loop - Whether music should loop
 * @property {number} volume - Music volume level (0.0 to 1.0)
 */
const bgMusic = new Audio('sounds/bg-music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;

/**
 * Game State - Variables tracking current game status
 * @type {number} score - Current player score
 * @type {number} level - Current game level
 * @type {number} highScore - Highest score from localStorage
 * @type {number} dropInterval - Time between automatic drops (ms)
 * @type {number} dropCounter - Counter for drop timing
 * @type {number} lastTime - Timestamp of last frame
 * @type {boolean} gameRunning - Whether game is active
 * @type {boolean} gamePaused - Whether game is paused
 * @type {number} animationFrame - ID for animation frame
 * @type {boolean} flashEffect - Flag for screen flash effect
 * @type {number} flashTimer - Counter for flash effect
 * @type {boolean} spaceKeyPressed - Flag for space bar state
 * @type {Array} particles - Array for particle effects
 */
let score = 0;
let level = 1;
let highScore = localStorage.getItem('tetrisHighScore') || 0;
let dropInterval = 1000;
let dropCounter = 0;
let lastTime = 0;
let gameRunning = false;
let gamePaused = false;
let animationFrame;
let flashEffect = false;
let flashTimer = 0;
let spaceKeyPressed = false;
const particles = [];

/**
 * Game Elements - Core game objects and structures
 * @type {Array} arena - 2D array representing game board (12x20)
 * @type {Object} player - Current active piece
 * @property {Object} pos - Piece position {x, y}
 * @property {Array} matrix - Piece shape matrix
 * @property {string} color - Piece color
 * @type {Object} nextPiece - Next piece to appear
 * @property {Array} matrix - Next piece shape
 * @property {string} color - Next piece color
 */
const arena = createMatrix(12, 20);
const player = {
  pos: {x: 0, y: 0},
  matrix: null,
  color: null
};
const nextPiece = {
  matrix: null,
  color: null
};

/**
 * Colors and Pieces - Game piece definitions
 * @type {Array} colors - Available piece colors in hex format
 * @type {Object} tetrominoes - All tetromino shapes
 * @property {Array} T - T-shaped piece
 * @property {Array} O - O-shaped piece
 * @property {Array} L - L-shaped piece
 * @property {Array} J - J-shaped piece
 * @property {Array} I - I-shaped piece
 * @property {Array} S - S-shaped piece
 * @property {Array} Z - Z-shaped piece
 */
const colors = ['#0ff', '#f0f', '#ff0', '#0f0', '#00f', '#f00', '#fa0'];
const tetrominoes = {
  'T': [[0,1,0],[1,1,1],[0,0,0]],
  'O': [[1,1],[1,1]],
  'L': [[0,0,1],[1,1,1],[0,0,0]],
  'J': [[1,0,0],[1,1,1],[0,0,0]],
  'I': [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  'S': [[0,1,1],[1,1,0],[0,0,0]],
  'Z': [[1,1,0],[0,1,1],[0,0,0]]
};

/**
 * Initializes and starts a new game session
 * - Resets game state variables
 * - Clears the game arena
 * - Starts background music
 * - Generates initial game pieces
 * - Begins game loop
 */
function startGame() {
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('pauseScreen').classList.add('hidden');
  document.getElementById('gameOverScreen').classList.add('hidden');

  arena.forEach(row => row.fill(0));
  score = 0;
  level = 1;
  dropInterval = 1000;
  gameRunning = true;
  gamePaused = false;
  
  // Initialize high score from localStorage
  highScore = localStorage.getItem('tetrisHighScore') || 0;
  updateScore();
  document.getElementById('highScore').textContent = highScore;

  bgMusic.currentTime = 0;
  bgMusic.play();

  const pieces = 'TOLJSZI';
  nextPiece.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  nextPiece.color = colors[Math.floor(Math.random() * colors.length)];
  resetPlayer();

  lastTime = 0;
  dropCounter = 0;
  particles.length = 0;
  if (animationFrame) cancelAnimationFrame(animationFrame);
  update();
}

/**
 * Creates a 2D matrix for the game arena
 * @param {number} width - Width of matrix
 * @param {number} height - Height of matrix
 * @returns {Array} 2D array filled with zeros
 */
/**
 * Creates a 2D matrix for the game arena
 * @param {number} width - Width of matrix in blocks
 * @param {number} height - Height of matrix in blocks
 * @returns {Array} 2D array filled with zeros representing empty blocks
 */
function createMatrix(width, height) {
  const matrix = [];
  while (height--) matrix.push(new Array(width).fill(0));
  return matrix;
}

/**
 * Gets the matrix for a specific tetromino type
 * @param {string} type - Tetromino type (T, O, L, J, I, S, Z)
 * @returns {Array} 2D array representing the piece
 */
/**
 * Gets the matrix for a specific tetromino type
 * @param {string} type - Tetromino type (T, O, L, J, I, S, Z)
 * @returns {Array} 2D array representing the piece's block structure
 */
function createPiece(type) {
  return tetrominoes[type];
}

/**
 * Checks for collision between player piece and arena
 * @param {Array} arena - Game board matrix
 * @param {Object} player - Player piece object
 * @returns {boolean} True if collision detected, false otherwise
 */
/**
 * Checks for collision between player piece and arena
 * @param {Array} arena - Game board matrix
 * @param {Object} player - Player piece object
 * @returns {boolean} True if collision detected, false otherwise
 */
function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] !== 0 && 
          (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Rotates the player piece with collision detection
 * @param {Array} matrix - Piece matrix to rotate
 * @param {number} dir - Rotation direction (1 for clockwise, -1 for counter-clockwise)
 */
/**
 * Rotates the player piece with wall kick and collision detection
 * @param {Array} matrix - Piece matrix to rotate
 * @param {number} dir - Rotation direction (1=clockwise, -1=counter-clockwise)
 */
function rotate(matrix, dir) {
  const originalX = player.pos.x;
  const originalY = player.pos.y;
  const clonedMatrix = matrix.map(row => [...row]);

  for (let y = 0; y < clonedMatrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [clonedMatrix[x][y], clonedMatrix[y][x]] = [clonedMatrix[y][x], clonedMatrix[x][y]];
    }
  }
  if (dir > 0) {
    clonedMatrix.forEach(row => row.reverse());
  } else {
    clonedMatrix.reverse();
  }

  const offsets = [0, 1, -1, 2, -2];
  for (const offset of offsets) {
    player.pos.x = originalX + offset;
    if (!collide(arena, {matrix: clonedMatrix, pos: player.pos})) {
      player.matrix = clonedMatrix;
      playSound(sounds.rotate);
      return;
    }
  }

  player.pos.x = originalX;
  player.pos.y = originalY;
}

/**
 * Moves the player piece horizontally
 * @param {number} dir - Movement direction (-1 for left, 1 for right)
 */
function playerMove(dir) {
  if (gamePaused) return;
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

/**
 * Drops the player piece down one row
 * Handles collision, merging, and triggering line clears
 */
function playerDrop() {
  if (gamePaused) return;
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playSound(sounds.drop);
    resetPlayer();
    sweep();
  }
  dropCounter = 0;
}

/**
 * Calculates the ghost piece position (where current piece would land)
 * @returns {Object} Ghost piece object with position, matrix and color
 */
function calculateGhostPosition() {
  const ghost = {
    pos: {x: player.pos.x, y: player.pos.y},
    matrix: player.matrix,
    color: player.color
  };
  
  while (!collide(arena, ghost)) {
    ghost.pos.y++;
  }
  ghost.pos.y--;
  return ghost;
}

/**
 * Merges player piece into the arena at current position
 * @param {Array} arena - Game board matrix
 * @param {Object} player - Player piece object to merge
 */
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = {
          val: value,
          color: player.color
        };
      }
    });
  });
}

/**
 * Resets player with next piece and checks for game over
 */
function resetPlayer() {
  const pieces = 'TOLJSZI';
  player.matrix = nextPiece.matrix;
  player.color = nextPiece.color;
  player.pos.y = 0;
  player.pos.x = Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);

  nextPiece.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  nextPiece.color = colors[Math.floor(Math.random() * colors.length)];
  drawNext();

  if (collide(arena, player)) {
    gameRunning = false;
    showGameOver();
  }
}

/**
 * Creates particle effects at specified row
 * @param {number} y - Row position to create particles
 */
function createParticles(y) {
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * canvas.width / 20,
      y: y,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: Math.random() * -1.5,
      life: 30 + Math.random() * 20
    });
  }
}

/**
 * Updates all particle positions and removes expired ones
 */
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

/**
 * Draws all active particles on canvas
 */
function drawParticles() {
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 50;
    ctx.fillRect(p.x, p.y, 0.5, 0.5);
    ctx.globalAlpha = 1;
  });
}

/**
 * Clears completed rows, updates score and level
 * @returns {number} Number of rows cleared
 */
function sweep() {
  let rowsCleared = 0;
  outer: for (let y = arena.length - 1; y >= 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) continue outer;
    }

    createParticles(y);
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    rowsCleared++;
    y++;
  }

  if (rowsCleared > 0) {
    playSound(sounds.lineClear);
    score += rowsCleared * 10;
    level = Math.floor(score / 30) + 1;
    dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    updateScore();
  }
}

/**
 * Draws a matrix (piece or arena) on specified context
 * @param {Array} matrix - Matrix to draw
 * @param {Object} offset - Position offset {x, y}
 * @param {string} color - Color to draw with
 * @param {CanvasRenderingContext2D} [context=ctx] - Drawing context
 * @param {boolean} [isGhost=false] - Whether to draw as ghost piece
 */
function drawMatrix(matrix, offset, color, context = ctx, isGhost = false) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        if (isGhost) {
          context.strokeStyle = color;
          context.globalAlpha = 0.5; // Slightly more visible for outlines
          context.setLineDash([0.2, 0.3]); // Dash pattern (small dash, small gap)
          context.lineWidth = 0.1;
          context.strokeRect(x + offset.x + 0.1, y + offset.y + 0.1, 0.8, 0.8); // Slightly smaller to fit dashes
          context.setLineDash([]); // Reset for other drawings
          context.globalAlpha = 1;
        } else {
          context.fillStyle = color;
          context.fillRect(x + offset.x, y + offset.y, 1, 1);
          context.strokeStyle = '#000';
          context.lineWidth = 0.05;
          context.strokeRect(x + offset.x, y + offset.y, 1, 1);
        }
      }
    });
  });
}

/**
 * Draws the current game arena state
 */
function drawArena() {
  arena.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== 0) {
        ctx.fillStyle = cell.color;
        ctx.fillRect(x, y, 1, 1);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 0.05;
        ctx.strokeRect(x, y, 1, 1);
      }
    });
  });
}

/**
 * Main draw function - renders game state including arena, pieces and particles
 */
function draw() {
  ctx.fillStyle = flashEffect && flashTimer % 2 === 0 ? '#fff' : '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawArena();
  
  // Draw ghost piece
  if (gameRunning && !gamePaused && !spaceKeyPressed) {
    const ghost = calculateGhostPosition();
    drawMatrix(ghost.matrix, ghost.pos, ghost.color, ctx, true);
  }
  
  drawMatrix(player.matrix, player.pos, player.color);
  drawParticles();

  if (flashEffect) {
    flashTimer--;
    if (flashTimer <= 0) flashEffect = false;
  }
}

/**
 * Draws the next piece preview
 */
function drawNext() {
  nextCtx.fillStyle = '#000';
  nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
  const offsetX = (4 - nextPiece.matrix[0].length) / 2;
  const offsetY = (4 - nextPiece.matrix.length) / 2;
  drawMatrix(nextPiece.matrix, {x: offsetX, y: offsetY}, nextPiece.color, nextCtx);
}

/**
 * Updates score display and checks for new high score
 */
function updateScore() {
  document.getElementById('score').textContent = score;
  document.getElementById('level').textContent = level;
  
  // Update high score in real-time if current score surpasses it
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('tetrisHighScore', highScore);
    document.getElementById('highScore').textContent = highScore;
  }
}

/**
 * Main game update loop - handles piece dropping and animation
 * @param {number} [time=0] - Current timestamp
 */
function update(time = 0) {
  if (gamePaused) return;
  updateParticles();
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  animationFrame = requestAnimationFrame(update);
}

/**
 * Toggles game pause state
 */
function togglePause() {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  if (gamePaused) {
    bgMusic.pause();
    document.getElementById('pauseScreen').classList.remove('hidden');
    document.getElementById('pauseBtn').textContent = 'RESUME';
  } else {
    bgMusic.play();
    document.getElementById('pauseScreen').classList.add('hidden');
    document.getElementById('pauseBtn').textContent = 'PAUSE';
    lastTime = performance.now();
    dropCounter = 0;
    update();
  }
}

/**
 * Shows game over screen and stops game
 */
function showGameOver() {
  playSound(sounds.gameOver);
  bgMusic.pause();
  document.getElementById('gameOverScreen').classList.remove('hidden');
  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById('finalScore').textContent = score;
  cancelAnimationFrame(animationFrame);
}

document.addEventListener('keydown', e => {
  if (!gameRunning && e.key === 'Enter') {
    startGame();
    return;
  }
  if (!gameRunning) return;
  switch(e.key) {
    case 'p': togglePause(); break;
    case 'ArrowLeft': playerMove(-1); break;
    case 'ArrowRight': playerMove(1); break;
    case 'ArrowDown': playerDrop(); break;
    case 'ArrowUp': rotate(player.matrix, 1); break;
    case ' ':
      if (gamePaused) return;
      flashEffect = true;
      flashTimer = 5;
      while (!collide(arena, player)) player.pos.y++;
      player.pos.y--;
      merge(arena, player);
      playSound(sounds.drop);
      resetPlayer();
      sweep();
      break;
  }
});

document.addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
    e.preventDefault();
  }
  if (e.key === ' ') {
    spaceKeyPressed = true;
  }
});

document.addEventListener('keyup', e => {
  if (e.key === ' ') {
    spaceKeyPressed = false;
  }
});
