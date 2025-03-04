let archer;
let target;
let arrow;
let myBackground;

let x;
let y;
let dx;
let dy;
let archerWidth;
let archerHeight;

let arrowX;
let arrowY;
let arrowDx;
let arrowDy;
let arrowWidth;
let arrowHeight;
let moving = false; // Track movement state

let targetX;
let targetY;
let targetDx;
let targetDy;
let targetWidth;
let targetHeight;

let arrowState = "outside target";
let score = 0; // Initialize score

let bgMusic;
let volumeChangeAmount = 0.05;

function preload() {
  archer = loadImage("archer2.png");
  target = loadImage("target2.png");
  arrow = loadImage("arrow.png");
  myBackground = loadImage("background.jpg");
  bgMusic = loadSound("gameSound.mp3");
}

function setup() {
  createCanvas(550, 400);

  x = height / 20;
  y = height / 2.5;
  archerWidth = archer.width * height * 0.001;
  archerHeight = archer.height * height * 0.001;
  dx = height / 57;
  dy = height / 57;
  arrowWidth = arrow.width * height * 0.000125;
  arrowHeight = arrow.height * height * 0.000125;
  arrowX = width / 2 + width * height * 0.000125; // angle the arrow to fit archer
  arrowY = height / 2 + height * height * 0.0002; //angle the arrow to fit archer
  arrowDx = height / 57;
  arrowDy = height / 57;
  targetWidth = target.width * height * 0.00035;
  targetHeight = target.height * height * 0.00035;
  targetX = width / 1.5;
  targetY = height / 2;
  targetDx = height / 100;
  targetDy = height / 100;
  textSize(height * 0.06); // Set text size for the scoreboard
  bgMusic.loop(); // Loop the background music
  bgMusic.setVolume(0.5);
}

function draw() {
  image(myBackground, 0, 0, width, height);
  archerMovement();
  targetMovement();
  bounceIfNeeded();
  displayScore();
  displayVolume();
  displayImages();
  isArrowMoving();
  withinTarget();
}

// display images
function displayImages() {
  image(archer, x, y, archerWidth, archerHeight);
  image(arrow, arrowX, arrowY, arrowWidth, arrowHeight);
  image(target, targetX, targetY, targetWidth, targetHeight);
}

// archer movement
function archerMovement() {
  // a or left arrow key moves archer left within the screen
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
    if (x > 0) {
      x -= dx;
      if (!moving) {
        arrowX -= arrowDx;
      }
    }
  }

  // d or right arrow key moves archer right within the screen
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
    if (x < width / 2 - archerWidth / 2) {
      x += dx;
      if (!moving) {
        arrowX += arrowDx;
      }
    }
  }

  // w or up arrow key moves the archer up within the screen
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
    if (y > height / 80) {
      y -= dy;
      if (!moving) {
        arrowY -= arrowDy;
      }
    }
  }
  // s or down arrow key moves archer down within the screen
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
    // s - moves down
    if (y < height - archerHeight + height / 25) {
      y += dy;
      if (!moving) {
        arrowY += arrowDy;
      }
    }
  }
}

// movement of the target sssssssssssssssssssssssss

function targetMovement() {
  //move target
  targetX += targetDx;
  targetY += targetDy;
}

function bounceIfNeeded() {
  // Bounce horizontally
  if (targetX < width / 1.5 || targetX > width - targetWidth / 1.5) {
    targetDx *= -1;
  }

  // Bounce vertically
  if (targetY <= 0 || targetY >= height - targetHeight) {
    targetDy *= -1;
  }
}


// sssssssssssssssssssssssssssssssssssssssssssss

function isArrowMoving() {
  // Move only when the left mouse button is clicked
  if (moving) {
    if (
      arrowX + arrowWidth - height * 0.0125 <= width &&
      arrowState === "outside target"
    ) {
      arrowX += arrowDx;
    } else if (arrowState === "inside target") {
      arrowState = "outside target";
      moving = false;
      score++;
    } else {
      moving = false;
    }
  } else if (!moving) {
    arrowX = x + width * 0.05;
    arrowY = y + height * 0.08;
  }
}

function keyPressed() {
  if (keyCode === 32 && !moving) {
    // Spacebar to shoot
    moving = true;
    arrowDx = height * 0.0375;
    arrowDy = 0;
    arrowState = "outside target";
  }
  if (key === "v" || key === "V") {

    if (bgMusic.isPlaying()) {
      bgMusic.pause(); // Pause if playing
      console.log("Music Paused");
    } else {
      bgMusic.loop(); // play if paused
      console.log("Music Playing");
    }
  }
}
console.log(targetX, targetY);


// Fix target position to prevent it from getting stuck at the left and right boundaries
function withinTarget() {
  if (
    arrowX + arrowWidth >= targetX + height * 0.1 &&
    arrowY > targetY - height * 0.035 &&
    arrowY < targetY + targetHeight - height * 0.021
  ) {
    if (arrowState === "outside target") {
      // Change target speed after hitting
      targetDx = random(height / 100, height / 40);
      targetDy = random(height / 100, height / 40);

      
      if (abs(targetDx) < height / 80)
        targetDx = (height / 50) * (targetDx > 0 ? 1 : -1);

      if (targetX + height * 0.1 <= width / 1.5) targetX = width / 1.4;// change to 1.5

      if (targetX + targetWidth >= width) targetX = width - targetWidth - 10;// cut off - 10
    }

    arrowState = "inside target";
  }
}

function displayScore() {
  fill("lightgreen");
  rect(0, 0, height * 0.325, height / 10);
  fill(0); // Black text color
  text("Score: " + score, height / 20, height * 0.075); // Display score at the top-left
}

function mouseWheel(event) {
  if (event.delta > 0) {
    // Scroll down, decrease volume
    bgMusic.setVolume(max(0, bgMusic.getVolume() - volumeChangeAmount));
  } 
  else {
    // Scroll up, increase volume
    bgMusic.setVolume(min(1, bgMusic.getVolume() + volumeChangeAmount));
  }
  return false; // Prevent the default action of scrolling (like page scroll)
}

function displayVolume() {
  fill("lightgreen");
  rect((height * 1.05), 0, height * 0.325, height / 10);
  fill(0); // Black text color
  text("volume: " + score , height * 1.075, height * 0.075); // Display score at the top-left
}
