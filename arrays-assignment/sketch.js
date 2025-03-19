// two or three mini games
// 1. click on the randomly moving ball and the colour change and add a score. add a game over screen and a time limit
// 2. dinosaur game 
// 3. maybe balll shooter
// Ranu Jayawickrama
// March 10th
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


//i didnt do the [ display intro screen, display outro screen, ]


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
let archeryScore = 0;
let bgMusic;
let volumeChangeAmount = 0.05; // sound

let archeryGameStartTime; // get the game start time

let theBugs = [];

let bugX;
let bugY;
let bug;
let bugWidth;
let bugHeight;

let net;
let netWidth;
let netHeight;

let bugBg;
let bugScore = 0;
let bugGameStartTime;
let inWhatMode = "in intro"; //  intro screen
let bugSpawnInterval; // Store the interval ID


//loading images
function preload() {
  bug = loadImage("firefly.png");
  bugBg = loadImage("bugBg.jpg");
  net = loadImage("net.png");
  archer = loadImage("archer2.png");
  target = loadImage("target2.png");
  arrow = loadImage("arrow.png");
  myBackground = loadImage("background.jpg");

  //loading music
  bgMusic = loadSound("gameSound.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //the bug game 
  bugWidth = bug.width * height * 0.0002;
  bugHeight = bug.width * height * 0.0002;
  netWidth = net.width * height * 0.0004;
  netHeight = net.height * height * 0.0005;
  bugGameStartTime = millis();
  noCursor();

  //the archery game
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
  // bgMusic.loop(); // Loop the background music
  // bgMusic.setVolume(0.5); //setting volume
}

function mousePressed(){
  for (let insect of theBugs){
    // if this bug is clicked on 
    if (dist(mouseX, mouseY, insect.x , insect.y ) < 28){
      let index = theBugs.indexOf(insect);
      theBugs.splice(index, 1);
      bugScore++;
    };
  }
}

function draw() {
  if (inWhatMode === "in intro") {
    displayIntroScreen();
  } 
  else if (inWhatMode === "in bug") {
    background(220);
    displayImages(); // Only calls displayImages() for the bug game
    displayVolume();
    bugMovement();
    bugDisplayScore();
    bugCheckGameTime();
  }
  else if (inWhatMode === "in archery") {
    displayImages(); // Only calls displayImages() for the archery game
    archerMovement();
    targetMovement();
    bounceIfNeeded();
    archeryDisplayScore();
    displayVolume();
    isArrowMoving();
    withinTarget();
    archeryCheckGameTime();
  }
  else if (inWhatMode === "in outro") {
    displayOutroScreen();
  }
}

function displayImages() {
  if (inWhatMode === "in bug") {
    imageMode(CORNER);
    image(bugBg, 0, 0, windowWidth, windowHeight);
    image(net, mouseX - 30, mouseY - 50, netWidth, netHeight);
  }
  else if (inWhatMode === "in archery") {
    imageMode(CORNER);  // Ensure correct mode
    image(myBackground, 0, 0, width, height);
    image(archer, x, y, archerWidth, archerHeight);
    image(arrow, arrowX, arrowY, arrowWidth, arrowHeight);
    image(target, targetX, targetY, targetWidth, targetHeight);
  }
}

function spawnBug(){
  let someb = {
    timeX: random(0, 1000),  // Still needed for movement
    timeY: random(0, 1000),
    
    bugSpeed: random(0.00004, 0.00008),
    x: random(width),  // Start at random x
    y: random(height), // Start at random y
  };
  theBugs.push(someb);
  console.log(theBugs.length);
}
function bugMovement(){
  for (let insect of theBugs){

    insect.x = noise(insect.timeX) * width;
    insect.y = noise(insect.timeY) * height;
    
    imageMode(CENTER);
    image(bug, insect.x, insect.y, bugWidth, bugHeight);
    

    // move bubble
    insect.timeX += insect.bugSpeed;
    insect.timeY += insect.bugSpeed;
  }
}
function bugDisplayScore() {
  //setting up varibles so that the background for the score  will be drawn in any winodw size
  let rectWidth = width * 0.2;
  let rectHeight = height * 0.05;
  let rectX = width * 0.02;
  let rectY = height * 0.02;

  fill("lightgreen");
  rect(rectX, rectY, rectWidth, rectHeight);

  fill(0);
  textSize(width / 55);
  textAlign(CENTER, CENTER);
  text("Score: " + bugScore, rectX + rectWidth / 2, rectY + rectHeight / 2); // Display score text
} 

function keyPressed() {
  if (inWhatMode === "in intro") {
    if (key === 'b' || key === 'B') {
      inWhatMode = "in bug";
      bugGameStartTime = millis(); // Reset bug game timer
      theBugs = []; // Reset bugs

      // Stop any previous bug spawn interval before starting a new one
      if (bugSpawnInterval) {
        clearInterval(bugSpawnInterval);
      }

      for (let i = 0; i < 3; i++) {
        spawnBug();
      }
      
      bugSpawnInterval = setInterval(spawnBug, 1500); // Start bug spawning
    }

    if (key === 'i' || key === 'I') {
      inWhatMode = "in archery";
      archeryGameStartTime = millis(); // Reset archery game timer
      theBugs = []; // Clear bugs when switching to archery
    }
  }
  else if (inWhatMode === "in archery"){
    // arrow is shot when pressed space bar and when it is in archers hand
    if (keyCode === 32 && !moving) {
      moving = true;
      arrowDx = height * 0.0375; //arrow speed
      arrowDy = 0;
      arrowState = "outside target";
    }
  }
  else if (inWhatMode === "in outro" && (key === "r" || key === "R")) {
    goHome(); // Return to the intro screen
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
      archeryScore++;
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

function archeryDisplayScore() {

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
  text("Score: " + archeryScore, rectX + rectWidth / 2, rectY + rectHeight / 2); // Display score text
}

//if 60 seconds have passed show the outro screen
function archeryCheckGameTime() {
  let elapsedTime = millis() - archeryGameStartTime;
  for (let i = 0; i < 1; i++) {
    if (elapsedTime >= 10000) {
      inWhatMode = "in outro";
    }
  }
}

function bugCheckGameTime() {
  let elapsedTime = millis() - bugGameStartTime;
  if (elapsedTime >= 15000) { // 30 seconds
    inWhatMode = "in outro";
  }
}

// resets the game when restarting after pressing r
function goHome() {
  inWhatMode = "in intro";

  archeryScore = 0;
  archeryGameStartTime = millis(); // Reset archery timer

  bugScore = 0;
  bugGameStartTime = millis(); // Reset bug timer

  theBugs = []; // Clear bugs when going back to intro

  x = height / 20;
  y = height / 2.5;

  arrowX = width / 2 + width * height * 0.000125;
  arrowY = height / 2 + height * height * 0.0002;
  
  targetX = width / 1.5;
  targetY = height / 2;

  myBackground = loadImage("background.jpg"); // Ensure background reloads properly
}

function displayIntroScreen() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(height * 0.05);
  fill(0);
  text("Welcome to the Game!", width / 2, height * 0.2);

  textSize(height * 0.04);
  text("Press 'B' to play the Bug Catching game", width / 2, height * 0.35);
  text("Press 'I' to play the Archery game", width / 2, height * 0.4);
  
  textSize(height * 0.035);
  text("Bug Catching Game:", width / 2, height * 0.5);
  text("Click on the moving bugs to catch them and increase your score!", width / 2, height * 0.55);
  
  text("Archery Game:", width / 2, height * 0.65);
  text("Use W/A/S/D or arrow keys to move.", width / 2, height * 0.7);
  text("Press SPACE to shoot an arrow at the moving target.", width / 2, height * 0.75);
}
function displayOutroScreen() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(height * 0.06);
  fill(0);
  text("Game Over!", width / 2, height * 0.3);

  textSize(height * 0.04);
  text("Press 'R' to return to the main menu", width / 2, height * 0.45);
}
// function displayOutroScreen(){

// }
