const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Canvas settings (read-only)
const canvasCtrX = canvas.width / 2;
const canvasCtrY = canvas.height / 2;

let gameActive = false;

let x = canvas.width / 2;                           //ball x pos
let y = canvas.height - 30;                         //ball y pos

let speed = 4.5;                                      //ball speed
let dx = speed;
let dy = -speed;

let paddleSpeed = 15;                               //paddle speed

const ballRadius = 10;                              //ball radius

const paddleHeight = 10;                            //paddle height
const paddleWidth = 100;                            //paddle width
const paddleGrace = 10;
let paddleX = (canvas.width - paddleWidth) / 2;     //paddle position
let rightPressed = leftPressed = false;             //Controls user input

//Brick information
let brickRowCount = 3;
const brickColumnCount = 10;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 17;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Button information
const buttonWidth = 150;
const buttonHeight = 80;
const buttonSpacing = 250;

const bEasy = document.getElementById('easy');
const pEasy = new Path2D();
pEasy.rect(canvasCtrX - buttonSpacing - buttonWidth / 2, canvasCtrY - buttonHeight / 2, buttonWidth, buttonHeight);

const bMedium = document.getElementById('medium');
const pMedium = new Path2D();
pMedium.rect(canvasCtrX - buttonWidth / 2, canvasCtrY - buttonHeight / 2, buttonWidth, buttonHeight);

const bHard = document.getElementById('hard');
const pHard = new Path2D();
pHard.rect(canvasCtrX + buttonSpacing - buttonWidth / 2, canvasCtrY - buttonHeight / 2, buttonWidth, buttonHeight);

// Draw the buttons and difficulty select
ctx.font = '50px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = 'black';
ctx.fillText("Select a difficulty:", canvasCtrX, canvasCtrY - buttonWidth);
drawButton(bEasy, canvasCtrX - buttonSpacing - buttonWidth / 2, canvasCtrY - buttonHeight / 2, pEasy);
drawButton(bMedium, canvasCtrX - buttonWidth / 2, canvasCtrY - buttonHeight / 2, pMedium);
drawButton(bHard, canvasCtrX + buttonSpacing - buttonWidth / 2, canvasCtrY - buttonHeight / 2, pHard);

let score = 0;
let lives = 3;
let scoreMult = 1;
const bricks = [];

// Variable for pause function
let paused = false;

let amogus = new Image();
amogus.src = "images/amogus.png";

document.addEventListener("click", function (e) {
  if(!gameActive) {
    if (ctx.isPointInPath(pEasy, e.offsetX, e.offsetY)) {
      setDifficulty(0);
    }
    if (ctx.isPointInPath(pMedium, e.offsetX, e.offsetY)) {
      setDifficulty(1);
    }
    if (ctx.isPointInPath(pHard, e.offsetX, e.offsetY)) {
      setDifficulty(2);
    }
  }
}, false);

// Draws difficulty select buttons
function drawButton(e, x, y, path) {
  ctx.fillStyle = 'lightgray';
  ctx.fill(path);
  ctx.font = '25px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(e.textContent, x + buttonWidth / 2, y + buttonHeight / 2);
}

// Sets the variables based on difficulty and starts the game
// 0 - Easy
// 1 - Medium
// 2 - Hard
function setDifficulty(diff) {
  switch(diff) {
    case 0:
      scoreMult = 1;
      speed = 3;
      lives = 10;
      break;
    case 1:
      scoreMult = 2;
      lives = 5;
      brickRowCount = 4;
      break;
    case 2:
      scoreMult = 3;
      lives = 3;
      brickRowCount = 5;
      speed = 7;
      break;
  }
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r <= brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };       //status determines whether brick is painted or not
    }
  }
  gameActive = true;
  draw();
}

//draws the ball onto the canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawAmogus(){
  ctx.drawImage(amogus, x - amogus.width/2, y - amogus.height/2);
}

//draws the paddle onto the canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

//draws the bricks onto the canvas
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#B44C43";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//draws the score onto the canvas
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 50, 20);
}

//draws lives onto the canvas
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

//Main function to draw everything into the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  drawLives();
  drawAmogus();
  collisionDetection();

  //Bounce ball off the left and right (walls)
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
  }
  if (y + dy < ballRadius) {
      dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX - paddleGrace && x < paddleX + paddleGrace + paddleWidth) {
          dx = speed * (x - (paddleX + paddleWidth/2))/(paddleWidth/3);
          console.log(x - (paddleX + paddleWidth/2));
          console.log(dx);
          dy = -dy;
      } else {
          lives--;
          if (!lives) {
              alert("GAME OVER");
              document.location.reload();
          } else {
              x = canvas.width / 2;
              y = canvas.height - 30;
              dx = speed;
              dy = -speed;
              paddleX = (canvas.width - paddleWidth) / 2;
          }
      }
  }

  //Change ball position every frame
  x += dx;
  y += dy;

  //Move paddle if keyboard button is pressed down
  if (rightPressed) {
      paddleX = Math.min(paddleX + paddleSpeed, canvas.width - paddleWidth);    //position is limited based on canvas size
    } else if (leftPressed) {
      paddleX = Math.max(paddleX - paddleSpeed, 0);
    }

  //calls draw every frame (frame rate depends on browser)
  if (!paused) {
    requestAnimationFrame(draw);
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//check if keyboard button is pressed
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  } else if (e.key === "27" || e.key === "Escape"){ // If escape is pressed, the game will pause
    togglePause();
  }
}

//check if keyboard button is released
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var rect = canvas.getBoundingClientRect();
  const relativeX = e.clientX - rect.left;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// Function for pausing while in game
function togglePause() {
  paused = !paused;
  if (paused == false){
    requestAnimationFrame(draw);
  }
}

//collision detection function for colliding with bricks
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score += scoreMult;
          if (score === brickRowCount * brickColumnCount) {
              alert("YOU WIN, CONGRATULATIONS!");
              document.location.reload();
          }
        }
      }
    }
  }
}