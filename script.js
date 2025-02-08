/* script.js */

// Get the canvas and set up the drawing context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define the grid – each cell is 20x20 pixels (matching our image sizes)
const gridSize = 20;
const canvasSize = canvas.width; // assuming square canvas (400x400)
const totalCells = canvasSize / gridSize; // 20 cells per row/column

// Preload the images for the snake and food
const snakeHeadImg = new Image();
snakeHeadImg.src = "images/snake-head.png"; // Make sure this file is in the images folder

const snakeBodyImg = new Image();
snakeBodyImg.src = "images/snake-body.png"; // Make sure this file is in the images folder

const foodImg = new Image();
foodImg.src = "images/apple.png"; // Make sure this file is in the images folder

// Initial game state
let snake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];
let dx = 1; // Initial movement: right (1 cell per update on x-axis)
let dy = 0;
let food = getRandomFoodPosition();
let changingDirection = false; // Prevents multiple direction changes in one tick
const gameIntervalTime = 100; // Milliseconds between game updates

// Start the game loop
let gameLoop = setInterval(updateGame, gameIntervalTime);

// Listen for keyboard input
document.addEventListener("keydown", changeDirection);

/**
 * The main game update function
 */
function updateGame() {
  if (hasGameEnded()) {
    alert("Game Over!");
    clearInterval(gameLoop);
    document.location.reload(); // Restart the game after a game over
    return;
  }

  // Reset the flag so a new direction can be chosen this tick
  changingDirection = false;

  // Create the new head based on the current direction
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Check if the snake has eaten the food
  if (head.x === food.x && head.y === food.y) {
    // Food has been eaten; get a new food position and keep the tail (grow the snake)
    food = getRandomFoodPosition();
  } else {
    // Remove the tail segment (snake moves without growing)
    snake.pop();
  }

  // Clear the canvas before drawing the new state
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food and snake
  drawFood();
  drawSnake();
}

/**
 * Draws the snake on the canvas.
 * The head is drawn with snakeHeadImg; all other segments use snakeBodyImg.
 */
function drawSnake() {
  // Draw the head
  const head = snake[0];
  ctx.drawImage(snakeHeadImg, head.x * gridSize, head.y * gridSize, gridSize, gridSize);

  // Draw each body segment
  for (let i = 1; i < snake.length; i++) {
    const segment = snake[i];
    ctx.drawImage(snakeBodyImg, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  }
}

/**
 * Draws the food on the canvas.
 */
function drawFood() {
  ctx.drawImage(foodImg, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

/**
 * Returns a random position on the grid for the food that is not occupied by the snake.
 */
function getRandomFoodPosition() {
  let foodX, foodY, collision;
  do {
    collision = false;
    foodX = Math.floor(Math.random() * totalCells);
    foodY = Math.floor(Math.random() * totalCells);

    // Check that the food does not appear on the snake
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === foodX && snake[i].y === foodY) {
        collision = true;
        break;
      }
    }
  } while (collision);

  return { x: foodX, y: foodY };
}

/**
 * Handles keydown events to change the snake’s direction.
 */
function changeDirection(event) {
  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  // Prevent the snake from reversing onto itself
  const goingRight = dx === 1;
  const goingLeft = dx === -1;
  const goingUp = dy === -1;
  const goingDown = dy === 1;

  if (keyPressed === LEFT && !goingRight) {
    dx = -1;
    dy = 0;
  } else if (keyPressed === UP && !goingDown) {
    dx = 0;
    dy = -1;
  } else if (keyPressed === RIGHT && !goingLeft) {
    dx = 1;
    dy = 0;
  } else if (keyPressed === DOWN && !goingUp) {
    dx = 0;
    dy = 1;
  }
}

/**
 * Checks whether the game has ended due to the snake hitting the wall or itself.
 */
function hasGameEnded() {
  const head = snake[0];

  // Check collision with walls
  if (head.x < 0 || head.x >= totalCells || head.y < 0 || head.y >= totalCells) {
    return true;
  }

  // Check collision with the snake's body
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}
