// set up canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, size, color) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true; // track whether the ball exists
  }

  draw() {
    if (this.exists) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  update() {
    if (!this.exists) return; // do not update if the ball does not exist

    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball && this.exists && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20); 
    this.color = "white";
    this.size = 10;

    // event listener for controlling the evil circle
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
      this.checkBounds(); // check bounds after moving
    });
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3; // set line width for stroke
    ctx.strokeStyle = this.color; // set stroke color
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // draw circle path
    ctx.stroke(); // outline the circle
  }

  checkBounds() {
    // check if the evil circle is going off the edges of the canvas
    if (this.x + this.size >= width) {
      this.x = width - this.size; // adjust position if it exceeds right boundary
    }

    if (this.x - this.size <= 0) {
      this.x = this.size; // adjust position if it exceeds left boundary
    }

    if (this.y + this.size >= height) {
      this.y = height - this.size; // adjust position if it exceeds bottom boundary
    }

    if (this.y - this.size <= 0) {
      this.y = this.size; // adjust position if it exceeds top boundary
    }
  }

  collisionDetect() {
    for (const ball of balls) {
      // check if the ball exists
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // check for collision
        if (distance < this.size + ball.size) {
          ball.exists = false; // set the ball to not exist when it collides with the evil circle
          ballCount--; // decrement the ball count
          updateBallCount(); // update the displayed ball count
        }
      }
    }
  }
}

const balls = [];
let ballCount = 0;

// create balls
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    size,
    randomRGB()
  );

  balls.push(ball);
  ballCount++; // increment the ball count
}

const ballCountParagraph = document.createElement("p");
ballCountParagraph.style.color = "white"; 
document.body.appendChild(ballCountParagraph);
updateBallCount();

const evilCircle = new EvilCircle(random(0 + 10, width - 10), random(0 + 10, height - 10));

function updateBallCount() {
  ballCountParagraph.textContent = `Balls on screen: ${ballCount}`; // update the paragraph text
}

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  evilCircle.draw(); // draw the evil circle
  evilCircle.checkBounds(); // check bounds for the evil circle
  evilCircle.collisionDetect(); // check for collisions with the balls

  requestAnimationFrame(loop);
}

loop();
