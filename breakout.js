const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;                           //ball x pos
let y = canvas.height - 30;                         //ball y pos

let speed = 4;                                      //ball speed
let dx = speed;
let dy = -speed;

let paddleSpeed = 4;                                //paddle speed

const ballRadius = 10;                              //ball radius

const paddleHeight = 10;                            //paddle height
const paddleWidth = 100;                            //paddle width
const paddleGrace = 10;
let paddleX = (canvas.width - paddleWidth) / 2;     //paddle position
let rightPressed = leftPressed = false;             //Controls user input

//Brick information
const brickRowCount = 3;
const brickColumnCount = 10;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 17;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0 };
  }
}

//draws the ball onto the canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
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
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
}

//Main function to draw everything into the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();

    //Bounce ball off the top and bottom
    if (y + dy > canvas.height || y + dy < 0) {
        dy = -dy;
    }
    
    //Bounce ball off the left and right (walls)
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX - paddleGrace && x < paddleX + paddleGrace + paddleWidth) {
          dy = -dy;
        } else {
          alert("GAME OVER");
          document.location.reload();
          clearInterval(interval);
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
  }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  //check if keyboard button is pressed
  function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
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

  //canvas updates every (10) milliseconds
  const interval = setInterval(draw, 10);