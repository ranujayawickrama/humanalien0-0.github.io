


// images
let archer;
let target;
let arrow;
let myBackground;

// variables of archer
let x;
let y;
let dx;
let dy;
let archerWidth;
let archerHeight;

// variables of archer arrow
let arrowX;
let arrowY;
let arrowDx;
let arrowDy;
let arrowWidth;
let arrowHeight;
let moving = false; // Track movement
let arrowState = "outside target"; //state of arrow

//variables of target
let targetX;
let targetY;
let targetDx;
let targetDy;
let targetWidth;
let targetHeight;

//score and music variables
let score = 0;
let bgMusic;
let volumeChangeAmount = 0.05; // sound

let showIntro = true; //  intro screen
let showOutro = false; //  if the outro screen is active
let archeryGameStartTime; // get the game start time


//loading images
function preload() {
  archer = loadImage("archer2.png");
  target = loadImage("target2.png");
  arrow = loadImage("arrow.png");
  myBackground = loadImage("background.jpg");

  //loading music
  bgMusic = loadSound("gameSound.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  archeryGameStartTime = millis(); // Start the timer

  //setting vaules for archer variables
  x = height / 20;
  y = height / 2.5;
  archerWidth = archer.width * height * 0.001;
  archerHeight = archer.height * height * 0.001;
  dx = height / 57;
  dy = height / 57;

  //setting up values for arrow variables
  arrowWidth = arrow.width * height * 0.000125;
  arrowHeight = arrow.height * height * 0.000125;
  arrowX = width / 2 + width * height * 0.000125; // angle the arrow to fit archer
  arrowY = height / 2 + height * height * 0.0002; //angle the arrow to fit archer
  arrowDx = height / 57;
  arrowDy = height / 57;

  //setting up values for arrow variables
  targetWidth = target.width * height * 0.00035;
  targetHeight = target.height * height * 0.00035;
  targetX = width / 1.5;
  targetY = height / 2;
  targetDx = height / 100;
  targetDy = height / 100;

  textSize(height * 0.06); // Set text size for the scoreboard
  bgMusic.loop(); // Loop the background music
  bgMusic.setVolume(0.5); //setting volume

}

function draw() {
  if (showIntro) {
    displayIntroScreen(); // Show the intro screen
  }
  else if (showOutro) {
    displayOutroScreen(); // Show the outro screen
  }
  else {

    // show gameplay
    image(myBackground, 0, 0, width, height); //display background
    archerMovement();
    targetMovement();
    bounceIfNeeded();
    displayScore();
    displayVolume();
    displayImages();
    isArrowMoving();
    withinTarget();

    checkGameTime(); // Check if time is up
  }
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

      //if the arrow is in hand move it left with archer
      if (!moving) {
        arrowX -= arrowDx;
      }
    }
  }

  // d or right arrow key moves archer right within the screen
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
    if (x < width / 2 - archerWidth / 2) {
      x += dx;

      //if the arrow is in hand move it right with archer
      if (!moving) {
        arrowX += arrowDx;
      }
    }
  }

  // w or up arrow key moves the archer up within the screen
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
    if (y > height / 80) {
      y -= dy;

      //if the arrow is in hand move it up with archer
      if (!moving) {
        arrowY -= arrowDy;
      }
    }
  }

  // s or down arrow key moves archer down within the screen
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
    if (y < height - archerHeight + height / 25) {
      y += dy;
      
      //if the arrow is in hand move it down with archer
      if (!moving) {
        arrowY += arrowDy;
      }
    }
  }
}

// movement of the target
function targetMovement() {
  //move target
  targetX += targetDx;
  targetY += targetDy;
}

function bounceIfNeeded() {

  // Bounce horizontally when tagert hits the boundary
  if (targetX < width / 1.5 || targetX > width - targetWidth / 1.5) {
    targetDx *= -1;
  }

  // Bounce vertically when tagert hits the boundary
  if (targetY <= 0 || targetY >= height - targetHeight) {
    targetDy *= -1;
  }
}

// check if the arrow is mving and it hit the target
function isArrowMoving() {

  // if the archer shot the arrow
  if (moving) {

    //if it has not hit anything
    if (
      arrowX + arrowWidth - height * 0.0125 <= width &&
      arrowState === "outside target"
    ) {
      arrowX += arrowDx;
    }

    // if it hits the target make reappear at archers hand
    else if (arrowState === "inside target") {
      arrowState = "outside target";
      moving = false;
      score++;
    }

    // if it hit the target make reappear at archers hand
    else {
      moving = false;
    }
  }

  //if not moving, make the arrow reappear at archers hand
  else if (!moving) {
    arrowX = x + width * 0.05;
    arrowY = y + height * 0.08;
  }
}

function keyPressed() {

  // if the intro screen is showing, make it dissappear when any key is pressed
  if (showIntro) {
    showIntro = false;
    archeryGameStartTime = millis(); // Reset timer when game starts
  }

  // if the outro screen is active and r or R is pressed, restart the game
  else if (showOutro && key === "r" || key === "R") {
    restartGame();
  }
  else {

    // arrow is shot when pressed space bar and when it is in archers hand
    if (keyCode === 32 && !moving) {
      moving = true;
      arrowDx = height * 0.0375; //arrow speed
      arrowDy = 0;
      arrowState = "outside target";
    }

    //if v or V pressed, pause the music if its playing and play the music if its paused
    if (key === "v" || key === "V") {
      if (bgMusic.isPlaying()) {
        bgMusic.pause();
      }
      else {
        bgMusic.loop();
      }
    }
  }
}

// check if the arrow hit the target
function withinTarget() {
  if (
    arrowX + arrowWidth >= targetX + height * 0.1 &&
    arrowY > targetY - height * 0.035 &&
    arrowY < targetY + targetHeight - height * 0.021
  ) {
    if (arrowState === "outside target") {

      // Change target speed after hitting
      targetDx = random(height / 90, height / 70);
      targetDy = random(height / 90, height / 70);

      // stop target from getting stuck on the left side
      if (targetX + height * 0.1 <= width / 1.5) {
        targetX = width / 1.4;
      }

      // Prevent target from getting stuck on the right side
      if (targetX + targetWidth >= width) {
        targetX = width - targetWidth - height / 40;
      }
    }

    arrowState = "inside target"; //change the state of the arrow
  }
}

//volume control
function mouseWheel(event) {
  if (event.delta > 0) {

    // Scroll down to decrease volume
    bgMusic.setVolume(max(0, bgMusic.getVolume() - volumeChangeAmount));
  }
  else {

    // Scroll up to increase volume
    bgMusic.setVolume(min(1, bgMusic.getVolume() + volumeChangeAmount));
  }
  return false; // stop the default action of scrolling (like page scroll)
}

// Displays the volume level on the screen for any winodw size
function displayVolume() {

  //setting up varibles so that the background (rectangle) for the volume will be drawn in any winodw size
  let rectWidth = width * 0.12;
  let rectHeight = height * 0.05;
  let rectX = width - rectWidth - width * 0.02;
  let rectY = height * 0.02;

  // drawing rectangle
  fill("lightgreen");
  rect(rectX, rectY, rectWidth, rectHeight);

  //text for volume
  fill(0);
  textSize(width / 55);
  textAlign(CENTER, CENTER);
  text(
    "Volume: " + Math.round(bgMusic.getVolume() * 100),
    rectX + rectWidth / 2,
    rectY + rectHeight / 2
  );
}

// Displays the player's score on the screen for any winodw size
function displayScore() {

  //setting up varibles so that the background (rectangle) for the score  will be drawn in any winodw size
  let rectWidth = width * 0.2;
  let rectHeight = height * 0.05;
  let rectX = width * 0.02;
  let rectY = height * 0.02;

  // drawing rectangle
  fill("lightgreen");
  rect(rectX, rectY, rectWidth, rectHeight);

  //text for score
  fill(0);
  textSize(width / 55);
  textAlign(CENTER, CENTER);
  text("Score: " + score, rectX + rectWidth / 2, rectY + rectHeight / 2); // Display score text
}

//dispaly intro screen with instructions
function displayIntroScreen() {
  background(0);
  fill(255);
  textSize(height * 0.05);
  textAlign(CENTER, CENTER);
  text("Welcome to the Star Shooter", width / 2, height / 4);
  text("Instructions:", width / 2, height / 2 - height * 0.1);
  text("- Move with W A S D or arrow keys", width / 2, height / 2);
  text("- Press Space to shoot", width / 2, height / 2 + height * 0.1);
  text("- Press V to toggle music", width / 2, height / 2 + height * 0.2);
  text(
    "- Use scroll wheel to change volume",
    width / 2,
    height / 2 + height * 0.3
  );
  text("Press any key to start!", width / 2, height * 0.875);
}

//displays the outro screen after 60 seconds
function displayOutroScreen() {
  background(0);
  fill(255);
  textSize(height * 0.0625);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, height / 3);
  text("Your Score: " + score, width / 2, height / 2);
  text("Press R to Restart", width / 2, height * 2 / 3);
}

//if 60 seconds have passed show the outro screen
function checkGameTime() {
  let elapsedTime = millis() - archeryGameStartTime;
  for (let i = 0; i < 1; i++) {
    if (elapsedTime >= 25000) {
      showOutro = true;
    }
  }
}

// resets the game when restarting after pressing r
function restartGame() {
  showOutro = false;

  score = 0;
  archeryGameStartTime = millis(); // reset timer

  x = height / 20;
  y = height / 2.5;

  arrowX = width / 2 + width * height * 0.000125;
  arrowY = height / 2 + height * height * 0.0002;
  
  targetX = width / 1.5;
  targetY = height / 2;
}
