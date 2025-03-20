// two mini games
// 1. bug game - catch the bug from the net (make sure the bug is close to the loop of the net)
// 2. archery game - use wasd or arrow keys to move the archer, space to shoot. try to shoot as much as arrows you can.
// Ranu Jayawickrama
// March 10th
//
// Extra for Experts:
// I added music and sound effects
// 

let myImages = {
  archer: null,
  target: null,
  arrow: null,
  myBackground: null,
};

let myArcher = {
  x: null,
  y: null,
  dx: null,
  dy: null,
  archerWidth: null,
  archerHeight: null,
};

let myArrow = {
  arrowX: null,
  arrowY: null,
  arrowDx: null,
  arrowDy: null,
  arrowWidth: null,
  arrowHeight: null,
  moving: false,
  arrowState: "outside target",
  
};

let myTarget = {
  targetX: null,
  targetY: null,
  targetDx: null,
  targetDy: null,
  targetWidth: null,
  targetHeight: null,
};

let myScores = {
  archeryScore: 0,
  bugScore: 0,
  whatScore: null,
};

let myGameStartTimes = {
  archeryGameStartTime: null,
  bugGameStartTime: null,
};

let myBug = {
  bugX: null,
  bugY: null,
  bug: null,
  bugWidth: null,
  bugHeight: null,
  bugBg: null,
  bugSpawnInterval: null,
};

let theBugs = [];

let myNet = {
  net: null,
  netWidth: null,
  netHeight: null,
};

let inWhatMode = "in intro"; //  intro screen
let cheerPlayed = false;
let booingPlayed = false;

let randomKey; // Store the randomly chosen key
let possibleKeys = "cdefghijklmnopqrstuvwxyz"; // Define keys to choose from
let volumeChangeAmount = 0.05; // sound



//loading images
function preload() {
  myBug.bug = loadImage("firefly.png");
  myBug.bugBg = loadImage("bugBg.jpg");
  myNet.net = loadImage("net.png");
  myImages.archer = loadImage("archer2.png");
  myImages.target = loadImage("target2.png");
  myImages.arrow = loadImage("arrow.png");
  myImages.myBackground = loadImage("background.jpg");

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
  myBug.bugWidth = myBug.bug.width * height * 0.0002;
  myBug.bugHeight = myBug.bug.width * height * 0.0002;
  myNet.netWidth = myNet.net.width * height * 0.0004;
  myNet.netHeight = myNet.net.height * height * 0.0005;
  myGameStartTimes.bugGameStartTime = millis();// Start the timer
  
  //the archery game
  myGameStartTimes.archeryGameStartTime = millis(); // Start the timer

  //setting vaules for archer variables
  myArcher.x = height / 20;
  myArcher.y = height / 2.5;
  myArcher.archerWidth = myImages.archer.width * height * 0.001;
  myArcher.archerHeight = myImages.archer.height * height * 0.001;
  myArcher.dx = height / 57;
  myArcher.dy = height / 57;

  //setting up values for arrow variables
  myArrow.arrowWidth = myImages.arrow.width * height * 0.000125;
  myArrow.arrowHeight = myImages.arrow.height * height * 0.000125;
  myArrow.arrowX = width / 2 + width * height * 0.000125; // angle the arrow to fit archer
  myArrow.arrowY = height / 2 + height * height * 0.0002; //angle the arrow to fit archer
  myArrow.arrowDx = height / 57;
  myArrow.arrowDy = height / 57;

  //setting up values for target variables
  myTarget.targetWidth = myImages.target.width * height * 0.00035;
  myTarget.targetHeight = myImages.target.height * height * 0.00035;
  myTarget.targetX = width / 1.5;
  myTarget.targetY = height / 2;
  myTarget.targetDx = height / 100;
  myTarget.targetDy = height / 100;
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
    if (dist(mouseX, mouseY, insect.x, insect.y) < myBug.bugWidth / 2) {
      let index = theBugs.indexOf(insect);
      theBugs.splice(index, 1);
      myScores.bugScore++;
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
    image(myBug.bugBg, 0, 0, windowWidth, windowHeight);
    image(myNet.net, mouseX - 30, mouseY - 50, myNet.netWidth, myNet.netHeight);// move the net by moving your cursor
  }

  // show the images of archery game if inside it
  else if (inWhatMode === "in archery") {
    imageMode(CORNER); 
    image(myImages.myBackground, 0, 0, width, height);
    image(myImages.archer, myArcher.x, myArcher.y, myArcher.archerWidth, myArcher.archerHeight);
    image(myImages.arrow, myArrow.arrowX, myArrow.arrowY, myArrow.arrowWidth, myArrow.arrowHeight);
    image(myImages.target, myTarget.targetX, myTarget.targetY, myTarget.targetWidth, myTarget.targetHeight);
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
    image(myBug.bug, insect.x, insect.y, myBug.bugWidth, myBug.bugHeight);
    

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
  text("Score: " + myScores.bugScore, rectX + rectWidth / 2, rectY + rectHeight / 2); // Display score text
} 

function keyPressed() {
  if (inWhatMode === "in intro") {
    if (key.toLowerCase() === randomKey) {
      memeSound.play(); // Play the sound
      pickRandomKey(); // Pick a new random key after playing
    }
    if (key === 'b' || key === 'B') {
      inWhatMode = "in bug";
      myScores.whatScore = "bug score";
      myGameStartTimes.bugGameStartTime = millis(); // Reset bug game timer
      theBugs = []; // Reset bugs

      // Stop intro music, start bug music
      introMusic.stop();
      archeryMusic.stop();
      bugMusic.loop();

      // Stop any previous bug spawn interval before starting a new one
      if (myBug.bugSpawnInterval) {
        clearInterval(myBug.bugSpawnInterval);
      }

      for (let i = 0; i < 3; i++) {
        spawnBug();
      }
      
      myBug.bugSpawnInterval = setInterval(spawnBug, 1000); // Start bug spawning
    }

    if (key === 'a' || key === 'A') {
      inWhatMode = "in archery";
      myGameStartTimes.archeryGameStartTime = millis(); // Reset archery game timer
      theBugs = []; // Clear bugs when switching to archery
      myScores.whatScore = "archery score";

      introMusic.stop();
      bugMusic.stop();
      archeryMusic.loop();
    }
  }
  if (inWhatMode === "in archery" && keyCode === 32 && !myArrow.moving) {
    bowSound.play(); // Play bowstring release sound
    myArrow.moving = true;
    myArrow.arrowDx = height * 0.0375;
    myArrow.arrowDy = 0;
    myArrow.arrowState = "outside target";
  }
  else if (inWhatMode === "in outro" && (key === "r" || key === "R")) {
    goHome(); // Return to the intro screen
  }
  //if v or V pressed, pause the music if its playing and play the music if its paused
  if (key === "v" || key === "V") {
    if (inWhatMode === "in intro") {
      if (introMusic.isPlaying()) {
        introMusic.pause();
      }
      else {
        introMusic.loop();
      }
    }
    else if (inWhatMode === "in bug") {
      if (bugMusic.isPlaying()) {
        bugMusic.pause();
      }
      else {
        bugMusic.loop();
      }
    }
    else if (inWhatMode === "in archery") {
      if (archeryMusic.isPlaying()) {
        archeryMusic.pause();
      }
      else {
        archeryMusic.loop();
      }
    }
  }
}

// archer movement
function archerMovement() {

  // a or left arrow key moves archer left within the screen
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
    if (myArcher.x > 0) {
      myArcher.x -= myArcher.dx;

      //if the arrow is in hand move it left with archer
      if (!myArrow.moving) {
        myArrow.arrowX -= myArrow.arrowDx;
      }
    }
  }

  // d or right arrow key moves archer right within the screen
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
    if (myArcher.x < width / 2 - myArcher.archerWidth / 2) {
      myArcher.x += myArcher.dx;

      //if the arrow is in hand move it right with archer
      if (!myArrow.moving) {
        myArrow.arrowX += myArrow.arrowDx;
      }
    }
  }

  // w or up arrow key moves the archer up within the screen
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
    if (myArcher.y > height / 80) {
      myArcher.y -= myArcher.dy;

      //if the arrow is in hand move it up with archer
      if (!myArrow.moving) {
        myArrow.arrowY -= myArrow.arrowDy;
      }
    }
  }

  // s or down arrow key moves archer down within the screen
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
    if (myArcher.y < height - myArcher.archerHeight + height / 25) {
      myArcher.y += myArcher.dy;
      
      //if the arrow is in hand move it down with archer
      if (!myArrow.moving) {
        myArrow.arrowY += myArrow.arrowDy;
      }
    }
  }
}

// movement of the target
function targetMovement() {
  //move target
  myTarget.targetX += myTarget.targetDx;
  myTarget.targetY += myTarget.targetDy;
}

function bounceIfNeeded() {

  // Bounce horizontally when tagert hits the boundary
  if (myTarget.targetX < width / 1.5 || myTarget.targetX > width - myTarget.targetWidth / 1.5) {
    myTarget.targetDx *= -1;
  }

  // Bounce vertically when tagert hits the boundary
  if (myTarget.targetY <= 0 || myTarget.targetY >= height - myTarget.targetHeight) {
    myTarget.targetDy *= -1;
  }
}

// check if the arrow is mving and it hit the target
function isArrowMoving() {

  // if the archer shot the arrow
  if (myArrow.moving) {

    //if it has not hit anything
    if (
      myArrow.arrowX + myArrow.arrowWidth - height * 0.0125 <= width &&
      myArrow.arrowState === "outside target"
    ) {
      myArrow.arrowX += myArrow.arrowDx;
    }

    // if it hits the target make reappear at archers hand
    else if (myArrow.arrowState === "inside target") {
      myArrow.arrowState = "outside target";
      myArrow.moving = false;
      myScores.archeryScore++;
    }

    // if it hit the target make reappear at archers hand
    else {
      myArrow.moving = false;
    }
  }

  //if not moving, make the arrow reappear at archers hand
  else if (!myArrow.moving) {
    myArrow.arrowX = myArcher.x + width * 0.05;
    myArrow.arrowY = myArcher.y + height * 0.08;
  }
}

// check if the arrow hit the target
function withinTarget() {
  if (
    myArrow.arrowX + myArrow.arrowWidth >= myTarget.targetX + height * 0.1 &&
    myArrow.arrowY > myTarget.targetY - height * 0.035 &&
    myArrow.arrowY < myTarget.targetY + myTarget.targetHeight - height * 0.021
  ) {
    if (myArrow.arrowState === "outside target") {

      // Change target speed after hitting
      myTarget.targetDx = random(height / 90, height / 70);
      myTarget.targetDy = random(height / 90, height / 70);

      // stop target from getting stuck on the left side
      if (myTarget.targetX + height * 0.1 <= width / 1.5) {
        myTarget.targetX = width / 1.4;
      }

      // Prevent target from getting stuck on the right side
      if (myTarget.targetX + myTarget.targetWidth >= width) {
        myTarget.targetX = width - myTarget.targetWidth - height / 40;
      }
    }

    myArrow.arrowState = "inside target"; //change the state of the arrow
  }
}

//volume control
function mouseWheel(event) {
  let currentMusic;

  if (inWhatMode === "in intro") {
    currentMusic = introMusic;
  }
  else if (inWhatMode === "in bug") {
    currentMusic = bugMusic;
  }
  else if (inWhatMode === "in archery") {
    currentMusic = archeryMusic;
  }

  if (currentMusic) {
    if (event.delta > 0) {
      // Scroll down to decrease volume
      currentMusic.setVolume(max(0, currentMusic.getVolume() - volumeChangeAmount));
    }
    else {
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
  }
  else if (inWhatMode === "in archery") {
    currentMusic = archeryMusic;
  }
  else {
    currentMusic = introMusic;
  }

  // If the music is paused, show volume as 0
  if (currentMusic && !currentMusic.isPlaying()) {
    volumeText += "0";
  }
  else {
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
  text("Score: " + myScores.archeryScore, rectX + rectWidth / 2, rectY + rectHeight / 2); // Display score text
}

//if 60 seconds have passed show the outro screen
function archeryCheckGameTime() {
  let elapsedTime = millis() - myGameStartTimes.archeryGameStartTime;
  for (let i = 0; i < 1; i++) {
    if (elapsedTime >= 30000) {
      inWhatMode = "in outro";
    }
  }
}

function bugCheckGameTime() {
  let elapsedTime = millis() - myGameStartTimes.bugGameStartTime;
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
  
  myScores.archeryScore = 0;
  myScores.bugScore = 0;
  myGameStartTimes.archeryGameStartTime = millis();
  myGameStartTimes.bugGameStartTime = millis();
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
  text("Press 'A' to play the Archery game", width / 2, height * 0.4);
  
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
  if (myScores.whatScore === "bug score") {
    finalScore = myScores.bugScore;
  }
  else if (myScores.whatScore === "archery score") {
    finalScore = myScores.archeryScore;
  }

  // Display only the relevant score
  textSize(height * 0.05);
  text(`Score: ${finalScore}`, width / 2, height * 0.4);

  // Play cheer sound if the player reaches the score threshold
  // Play cheer sound if the player gets 10+ points, but only once
  if ((myScores.archeryScore >= 15 || myScores.bugScore >= 10) && !cheerPlayed) {
    cheerSound.play();
    cheerPlayed = true;
  }

  // Play booing sound if the player gets less than 10 points, but only once
  if (myScores.archeryScore < 15 && myScores.bugScore < 10 && !booingPlayed) {
    booingSound.play();
    booingPlayed = true;
  }
}

function pickRandomKey() {
  randomKey = possibleKeys.charAt(floor(random(possibleKeys.length)));
  console.log("Press '" + randomKey + "' to play the meme sound!"); // Debugging message
}

