// two mini games
// 1. bug game - catch the bug from the net (make sure the bug is close to the loop of the net)
// 2. archery game - use wasd or arrow keys to move the archer, space to shoot. try to shoot as much as arrows you can.
// Ranu Jayawickrama
// March 10th
//
// Extra for Experts:
// I added music
// 


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
let bugScore = 0;

let introMusic;
let volumeChangeAmount = 0.05; // sound

// get the game start times
let archeryGameStartTime; 
let bugGameStartTime;

//bug variables and arrays 
let theBugs = [];
let bugX;
let bugY;
let bug;
let bugWidth;
let bugHeight;
let bugBg;

let bugSpawnInterval; // Store the interval ID

// net variables 
let net;
let netWidth;
let netHeight;
let inWhatMode = "in intro"; //  intro screen
let cheerPlayed = false;
let booingPlayed = false;
let whatScore;
let randomKey; // Store the randomly chosen key
let possibleKeys = "cdefghijklmnopqrstuvwxyz"; // Define keys to choose from




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
  introMusic = loadSound("introS.mp3");   // Intro screen music
  archeryMusic = loadSound("archeryS.mp3"); // Archery game music
  bugMusic = loadSound("bugS.mp3");       // Bug catching game music
  

  bowSound = loadSound("bowRelease.mp3");   // Bow shooting sound
  bugCatchSound = loadSound("pop.mp3");     // Bug catching sound
  cheerSound = loadSound("winnerS.mp3");      // Cheer sound for high score
  booingSound = loadSound("looserS.mp3"); 
  memeSound = loadSound("araAra.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pickRandomKey(); // Pick the first random key

  //the bug game 
  bugWidth = bug.width * height * 0.0002;
  bugHeight = bug.width * height * 0.0002;
  netWidth = net.width * height * 0.0004;
  netHeight = net.height * height * 0.0005;
  bugGameStartTime = millis();// Start the timer
  

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

  //setting up values for target variables
  targetWidth = target.width * height * 0.00035;
  targetHeight = target.height * height * 0.00035;
  targetX = width / 1.5;
  targetY = height / 2;
  targetDx = height / 100;
  targetDy = height / 100;
  textSize(height * 0.06); // Set text size for the scoreboard

  // Play intro music at the start
  introMusic.loop();
  introMusic.setVolume(0.5);

  // Set volumes for other tracks but don't play them yet
  archeryMusic.setVolume(0.5);
  bugMusic.setVolume(0.5);

  // sound effects 
  bowSound.setVolume(1.0);
  bugCatchSound.setVolume(0.8);
  cheerSound.setVolume(6.0);
  memeSound.setVolume(0.1);
}

function mousePressed() {
  for (let insect of theBugs) {
    // if the bug is clicked on
    if (dist(mouseX, mouseY, insect.x, insect.y) < bugWidth / 2) {
      let index = theBugs.indexOf(insect);
      theBugs.splice(index, 1);
      bugScore++;
      bugCatchSound.play(); // Play pop sound when catching a bug
    }
  }
}

function draw() {
  // if the mode is intro, show the cursor and display intro screen
  if (inWhatMode === "in intro") {
    cursor();
    displayIntroScreen();
    displayVolume();
  } 

  // if the mode is bug, hide the cursor and display bug screen
  else if (inWhatMode === "in bug") {
    noCursor();
    background(220);
    displayImages(); // Only calls displayImages() for the bug game
    displayVolume();
    bugMovement();
    bugDisplayScore();
    bugCheckGameTime();
  }

  // if the mode is archery, hide the cursor and display archery screen
  else if (inWhatMode === "in archery") {
    noCursor();
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

  // if the mode is outro, show the cursor and display outro screen
  else if (inWhatMode === "in outro") {
    cursor();
    displayOutroScreen();
  }
}

function displayImages() {
  // show the images of bug game if inside it
  if (inWhatMode === "in bug") {
    imageMode(CORNER);
    image(bugBg, 0, 0, windowWidth, windowHeight);
    image(net, mouseX - 30, mouseY - 50, netWidth, netHeight);// move the net by moving your cursor
  }

  // show the images of archery game if inside it
  else if (inWhatMode === "in archery") {
    imageMode(CORNER); 
    image(myBackground, 0, 0, width, height);
    image(archer, x, y, archerWidth, archerHeight);
    image(arrow, arrowX, arrowY, arrowWidth, arrowHeight);
    image(target, targetX, targetY, targetWidth, targetHeight);
  }
}

function spawnBug(){
  let someb = {
    timeX: random(0, 1000),  
    timeY: random(0, 1000),
    
    bugSpeed: random(0.004, 0.008),

    x: random(width),  // Start at random x
    y: random(height), // Start at random y
  };
  theBugs.push(someb);

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
    if (key.toLowerCase() === randomKey) {
      memeSound.play(); // Play the sound
      pickRandomKey(); // Pick a new random key after playing
    }
    if (key === 'b' || key === 'B') {
      inWhatMode = "in bug";
      whatScore = "bug score"
      bugGameStartTime = millis(); // Reset bug game timer
      theBugs = []; // Reset bugs

      // Stop intro music, start bug music
      introMusic.stop();
      archeryMusic.stop();
      bugMusic.loop();

      // Stop any previous bug spawn interval before starting a new one
      if (bugSpawnInterval) {
        clearInterval(bugSpawnInterval);
      }

      for (let i = 0; i < 3; i++) {
        spawnBug();
      }
      
      bugSpawnInterval = setInterval(spawnBug, 1000); // Start bug spawning
    }

    if (key === 'a' || key === 'A') {
      inWhatMode = "in archery";
      archeryGameStartTime = millis(); // Reset archery game timer
      theBugs = []; // Clear bugs when switching to archery
      whatScore = "archery score"

      introMusic.stop();
      bugMusic.stop();
      archeryMusic.loop();
    }
  }
 if (inWhatMode === "in archery" && keyCode === 32 && !moving) {
    bowSound.play(); // Play bowstring release sound
    moving = true;
    arrowDx = height * 0.0375;
    arrowDy = 0;
    arrowState = "outside target";
  }
  else if (inWhatMode === "in outro" && (key === "r" || key === "R")) {
    goHome(); // Return to the intro screen
  }
  //if v or V pressed, pause the music if its playing and play the music if its paused
  if (key === "v" || key === "V") {
    if (inWhatMode === "in intro") {
      if (introMusic.isPlaying()) {
        introMusic.pause();
      } else {
        introMusic.loop();
      }
    } else if (inWhatMode === "in bug") {
      if (bugMusic.isPlaying()) {
        bugMusic.pause();
      } else {
        bugMusic.loop();
      }
    } else if (inWhatMode === "in archery") {
      if (archeryMusic.isPlaying()) {
        archeryMusic.pause();
      } else {
        archeryMusic.loop();
      }
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
  let currentMusic;

  if (inWhatMode === "in intro") {
    currentMusic = introMusic;
  } else if (inWhatMode === "in bug") {
    currentMusic = bugMusic;
  } else if (inWhatMode === "in archery") {
    currentMusic = archeryMusic;
  }

  if (currentMusic) {
    if (event.delta > 0) {
      // Scroll down to decrease volume
      currentMusic.setVolume(max(0, currentMusic.getVolume() - volumeChangeAmount));
    } else {
      // Scroll up to increase volume
      currentMusic.setVolume(min(1, currentMusic.getVolume() + volumeChangeAmount));
    }
  }

  return false; // Stop the default scrolling behavior
}

// Displays the volume level on the screen for any winodw size
function displayVolume() {
  let currentMusic;
  let volumeText = "Volume: ";

  if (inWhatMode === "in bug") {
    currentMusic = bugMusic;
  } else if (inWhatMode === "in archery") {
    currentMusic = archeryMusic;
  } else {
    currentMusic = introMusic;
  }

  // If the music is paused, show volume as 0
  if (currentMusic && !currentMusic.isPlaying()) {
    volumeText += "0";
  } else {
    volumeText += Math.round(currentMusic.getVolume() * 100);
  }

  // Setting up variables for the volume display box
  let rectWidth = width * 0.12;
  let rectHeight = height * 0.05;
  let rectX = width - rectWidth - width * 0.02;
  let rectY = height * 0.02;

  // Drawing rectangle
  fill("lightgreen");
  rect(rectX, rectY, rectWidth, rectHeight);

  // Display volume text
  fill(0);
  textSize(width / 55);
  textAlign(CENTER, CENTER);
  text(volumeText, rectX + rectWidth / 2, rectY + rectHeight / 2);
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
    if (elapsedTime >= 30000) {
      inWhatMode = "in outro";
    }
  }
}

function bugCheckGameTime() {
  let elapsedTime = millis() - bugGameStartTime;
  if (elapsedTime >= 30000) { // 30 seconds
    inWhatMode = "in outro";
  }
}

// resets the game when restarting after pressing r
function goHome() {
  inWhatMode = "in intro";
  cheerPlayed = false;
  booingPlayed = false;
  
  // Stop all game music and restart intro music
  bugMusic.stop();
  archeryMusic.stop();
  introMusic.loop();
  
  archeryScore = 0;
  bugScore = 0;
  archeryGameStartTime = millis();
  bugGameStartTime = millis();
  theBugs = [];
}

function displayIntroScreen() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(height * 0.05);
  fill(0);
  text("Welcome to the Mini Games!", width / 2, height * 0.2);

  textSize(height * 0.04);
  text("Press 'B' to play the Bug Catching game", width / 2, height * 0.35);
  text("Press 'I' to play the Archery game", width / 2, height * 0.4);
  
  textSize(height * 0.035);
  text("Bug Catching Game:", width / 2, height * 0.5);
  text("move the net with your mouse and click on the bugs as much as you can for 30 seconds", width / 2, height * 0.55);
  text("(make sure the bug is close to the net loop and you are not moving while clicking) ", width / 2, height * 0.6);
  
  
  text("Archery Game:", width / 2, height * 0.7);
  text("Use W/A/S/D or arrow keys to move", width / 2, height * 0.75);
  text("Press SPACE to shoot an arrow at the moving target as much as you can for 30 seconds", width / 2, height * 0.8);
}
function displayOutroScreen() {
  background(0);
  textAlign(CENTER, CENTER);
  textSize(height * 0.06);
  fill(220);
  text("Game Over!", width / 2, height * 0.3);

  textSize(height * 0.04);
  text("Press 'R' to return to the main menu", width / 2, height * 0.45);

  let finalScore = 0;

  // Determine which game was played and display the correct score
  if (whatScore === "bug score") {
    finalScore = bugScore;
  } else if (whatScore === "archery score") {
    finalScore = archeryScore;
  }

  // Display only the relevant score
  textSize(height * 0.05);
  text(`Score: ${finalScore}`, width / 2, height * 0.4);

  // Play cheer sound if the player reaches the score threshold
  // Play cheer sound if the player gets 10+ points, but only once
  if ((archeryScore >= 15 || bugScore >= 10) && !cheerPlayed) {
    cheerSound.play();
    cheerPlayed = true;
  }

  // Play booing sound if the player gets less than 10 points, but only once
  if ((archeryScore < 15 && bugScore < 10) && !booingPlayed) {
    booingSound.play();
    booingPlayed = true;
  }
}

function pickRandomKey() {
  randomKey = possibleKeys.charAt(floor(random(possibleKeys.length)));
  console.log("Press '" + randomKey + "' to play the meme sound!"); // Debugging message
}

