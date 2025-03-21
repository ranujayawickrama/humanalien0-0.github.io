// two mini games
// 1. bug game - catch the bug from the net (make sure the bug is close to the loop of the net)
// 2. archery game - use wasd or arrow keys to move the archer, space to shoot. try to shoot as much as arrows you can.
// Ranu Jayawickrama
// March 10th
//
// Extra for Experts:
// used angles in arrow movement
// adding sound effects and music and volume control
// randomized easter egg sound
// fixed the objects and varirable so that it is possible to play in any window size
// using mouse wheel in different mode to control different background music
// two games


let inWhatMode = "in intro"; //  set the initial mode to intro 
let cheerPlayed = false; // detect whether the cheer should be played
let booingPlayed = false;// detect whether the boo should be played
let randomKey; // Store the randomly chosen key
let possibleKeys = "cdefghijklmnopqrstuwxyz"; // Define keys to choose from
let volumeChangeAmount = 0.05; // volume to change iwth mouse wheel
let arrowAngle = 0; // To store the angle of the arrow
let theBugs = [];//to store unique info for each bug

//archer game images
let myImages = {
  archer: null,
  target: null,
  arrow: null,
  myBackground: null,
};

// archer elements
let myArcher = {
  x: null,
  y: null,
  dx: null,
  dy: null,
  archerWidth: null,
  archerHeight: null,
};

// arrow elements
let myArrow = {
  arrowX: null,
  arrowY: null,
  arrowDx: null,
  arrowDy: null,
  arrowWidth: null,
  arrowHeight: null,
  moving: false, // detect arrow movement
  arrowState: "outside target",// check the state of the arrow
};

// target elements
let myTarget = {
  targetX: null,
  targetY: null,
  targetDx: null,
  targetDy: null,
  targetWidth: null,
  targetHeight: null,
};

// score elements
let myScores = {
  archeryScore: 0,
  bugScore: 0,
  whatScore: null,// to store what game was playing
};

//to check time 
let myGameStartTimes = {
  archeryGameStartTime: null,
  bugGameStartTime: null,
};

// bug elements
let myBug = {
  bugX: null,
  bugY: null,
  bug: null,
  bugWidth: null,
  bugHeight: null,
  bugBg: null,
  bugSpawnInterval: null,
};

// net elements
let myNet = {
  net: null,
  netWidth: null,
  netHeight: null,
};

function preload() {
  //bug game images
  myBug.bug = loadImage("firefly.png");
  myBug.bugBg = loadImage("bugBg.jpg");
  myNet.net = loadImage("net.png");

  // archer game images
  myImages.archer = loadImage("archer2.png");
  myImages.target = loadImage("target2.png");
  myImages.arrow = loadImage("arrow.png");
  myImages.myBackground = loadImage("background.jpg");

  //background music
  introMusic = loadSound("introS.mp3");   
  archeryMusic = loadSound("archeryS.mp3"); 
  bugMusic = loadSound("bugS.mp3");       
  
  // sound effects
  bowSound = loadSound("bowRelease2.wav");   
  bugCatchSound = loadSound("pop.mp3");     
  cheerSound = loadSound("winnerS.mp3");    
  booingSound = loadSound("looserS.mp3"); 
  memeSound = loadSound("araAra.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);// set the canvas to size of the window
  pickRandomKey(); // Pick the first random key

  //the bug game 
  myBug.bugWidth = myBug.bug.width * height * 0.0002;
  myBug.bugHeight = myBug.bug.width * height * 0.0002;
  myNet.netWidth = myNet.net.width * height * 0.00045;
  myNet.netHeight = myNet.net.height * height * 0.00055;
  myGameStartTimes.bugGameStartTime = millis();// Start the timer
  
  // archer game
  //setting vaules for archer elements
  myArcher.x = height / 20;
  myArcher.y = height / 2.5;
  myArcher.archerWidth = myImages.archer.width * height * 0.001;
  myArcher.archerHeight = myImages.archer.height * height * 0.001;
  myArcher.dx = height / 57;
  myArcher.dy = height / 57;
  myGameStartTimes.archeryGameStartTime = millis(); // Start the timer

  //setting up values for arrow elements
  myArrow.arrowWidth = myImages.arrow.width * height * 0.000125;
  myArrow.arrowHeight = myImages.arrow.height * height * 0.000125;
  myArrow.arrowX = width / 2 + width * height * 0.000125; // angle the arrow to fit archer
  myArrow.arrowY = height / 2 + height * height * 0.0002; //angle the arrow to fit archer
  myArrow.arrowDx = height / 57;
  myArrow.arrowDy = height / 57;

  //setting up values for target elements
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

  // Set volumes for in game music 
  archeryMusic.setVolume(0.5);
  bugMusic.setVolume(0.5);

  // sound effects 
  bowSound.setVolume(1.0);
  bugCatchSound.setVolume(0.8);
  cheerSound.setVolume(6.0);
  memeSound.setVolume(0.1);
}

//press mouse to catch a bug
function mousePressed() {

   // Loop through all bugs and check if one was clicked
  for (let insect of theBugs) {
    if (dist(mouseX, mouseY, insect.x, insect.y) < myBug.bugWidth / 2) {
      let index = theBugs.indexOf(insect);
      theBugs.splice(index, 1);// remove bug
      myScores.bugScore++;//increase score
      bugCatchSound.play(); // Play pop sound when catching a bug
    }
  }
}

function draw() {
  // if the mode is intro, show the cursor and display intro screen
  if (inWhatMode === "in intro") {
    cursor();
    displayIntroScreen();
    displayVolume();//display volume 
  } 

  // if the mode is bug mode, display bug game
  else if (inWhatMode === "in bug") {
    noCursor();//hide the cursor 
    background(220);
    displayImages(); // Display bug images
    displayVolume();//display volume
    bugMovement();
    bugDisplayScore();//display score
    bugCheckGameTime();
  }

  // if the mode is archery mode, display archery screen
  else if (inWhatMode === "in archery") {
    displayImages(); //  Display archery images
    archerMovement();
    targetMovement();
    bounceIfNeeded();
    archeryDisplayScore();//display score
    displayVolume();//display volume
    isArrowMoving();
    withinTarget();
    archeryCheckGameTime();
  }

  // if the mode is outro, display outro screen
  else if (inWhatMode === "in outro") {
    cursor();//display the cursor 
    displayOutroScreen();
  }
}

function displayImages() {
  // show the images of bug game if inside it
  if (inWhatMode === "in bug") {
    imageMode(CORNER);
    image(myBug.bugBg, 0, 0, windowWidth, windowHeight);
    image(myNet.net, mouseX - height * 0.04043, mouseY - height * 0.06738, myNet.netWidth, myNet.netHeight);// move the net by moving your cursor
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
  // info of a bug
  let someb = {
    timeX: random(0, 1000),  
    timeY: random(0, 1000),
    bugSpeed: random(0.004, 0.008),
    x: random(width),  // Start at random x
    y: random(height), // Start at random y
  };

  //store the info in the bugs array
  theBugs.push(someb);
}

//organic movement of the bug
function bugMovement(){
  for (let insect of theBugs){
    insect.x = noise(insect.timeX) * width;
    insect.y = noise(insect.timeY) * height;
    
    //set the x, y cordinated to the center
    imageMode(CENTER);
    image(myBug.bug, insect.x, insect.y, myBug.bugWidth, myBug.bugHeight);
    
   // move bubble
    insect.timeX += insect.bugSpeed;
    insect.timeY += insect.bugSpeed;
  }
}

//display the bug score
function bugDisplayScore() {
  // background for the score
  let rectWidth = width * 0.2;
  let rectHeight = height * 0.05;
  let rectX = width * 0.02;
  let rectY = height * 0.02;
  fill("lightgreen");
  rect(rectX, rectY, rectWidth, rectHeight);

  // Display score text 
  fill(0);
  textSize(width / 55);
  textAlign(CENTER, CENTER);
  text("Score: " + myScores.bugScore, rectX + rectWidth / 2, rectY + rectHeight / 2); 
} 

function keyPressed() {
  // shoot the arrow in an angle towards the cursor
  if (inWhatMode === "in archery" && key === "x" ) {

    // Calculate the angle to the mouse cursor from the archer's position
    let deltaX = mouseX - (myArcher.x + myArcher.archerWidth / 2);
    let deltaY = mouseY - (myArcher.y + myArcher.archerHeight / 2);
    arrowAngle = atan2(deltaY, deltaX); // Calculate the angle using trigonometry
    
    // Set the arrow's speed based on the angle
    let arrowSpeed = height* 0.042; 
    myArrow.arrowDx = arrowSpeed * cos(arrowAngle);
    myArrow.arrowDy = arrowSpeed * sin(arrowAngle);
    
    // Start the arrow moving
    myArrow.moving = true;
    bowSound.play(); // Play bowstring release sound
  }

  //press a random key to play a meme sound if in intro
  if (inWhatMode === "in intro") {
    if (key.toLowerCase() === randomKey) {
      memeSound.play(); 
      pickRandomKey(); // Pick a new random key after playing
    }

    //if b is pressed play bug music, spawn bugs and change mode to bug
    if (key === 'b' || key === 'B') {
      inWhatMode = "in bug";
      myScores.whatScore = "bug score";
      myGameStartTimes.bugGameStartTime = millis(); // Reset bug game timer
      theBugs = []; // Reset bugs

      // play bug music
      introMusic.stop();
      archeryMusic.stop();
      bugMusic.loop();

      // Stop any previous bug spawn interval before starting a new one
      if (myBug.bugSpawnInterval) {
        clearInterval(myBug.bugSpawnInterval);
      }

      // have three bugs when starting
      for (let i = 0; i < 3; i++) {
        spawnBug();
      }
      myBug.bugSpawnInterval = setInterval(spawnBug, 1200); // Start bug spawning
    }

    // when a or A pressed play archery music and change mode to archery
    if (key === 'a' || key === 'A') {
      inWhatMode = "in archery";
      myScores.whatScore = "archery score";
      myGameStartTimes.archeryGameStartTime = millis(); // Reset archery game timer
      theBugs = []; // Clear bugs when switching to archery
      
      //play archery music
      introMusic.stop();
      bugMusic.stop();
      archeryMusic.loop();
    }
  }
  
  // When in archery mode and the spacebar is pressed, release the arrow if not already moving
  if (inWhatMode === "in archery" && keyCode === 32 && !myArrow.moving) {
    bowSound.play(); // Play bowstring release sound
    myArrow.moving = true; // change arrow motion to moving

    //reset elements
    myArrow.arrowDx = height * 0.0375;
    myArrow.arrowDy = 0;
    myArrow.arrowState = "outside target";//change arrow state 
  }

  // If in outro mode and r or R is pressed, change mode to intro screen and play music
  else if (inWhatMode === "in outro" && (key === "r" || key === "R")) {
    inWhatMode = "in intro";
    cheerPlayed = false;
    booingPlayed = false;
    
    // Stop all game music and restart intro music
    bugMusic.stop();
    archeryMusic.stop();
    introMusic.loop();
    
    //reset elements
    myScores.archeryScore = 0;
    myScores.bugScore = 0;
    myGameStartTimes.archeryGameStartTime = millis();
    myGameStartTimes.bugGameStartTime = millis();
    theBugs = [];
  }

  //if v or V pressed, pause the music if its playing and play the music if its paused
  if (key === "v" || key === "V") {

    //if its intro music, pause or play 
    if (inWhatMode === "in intro") {
      if (introMusic.isPlaying()) {
        introMusic.pause();
      }
      else {
        introMusic.loop();
      }
    }

    //if its bug music, pause or play 
    else if (inWhatMode === "in bug") {
      if (bugMusic.isPlaying()) {
        bugMusic.pause();
      }
      else {
        bugMusic.loop();
      }
    }

    //if its archery music, pause or play 
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

//if the target hit a wall bounce 
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

// check if the arrow is moving and it hit the target
function isArrowMoving() {

  // If the arrow is moving, update its position
  if (myArrow.moving) {
    myArrow.arrowX += myArrow.arrowDx;
    myArrow.arrowY += myArrow.arrowDy;
    
    // If the arrow goes off screen, reset it back to the archer's hand
    if (
      myArrow.arrowX > width ||
      myArrow.arrowX + myArrow.arrowWidth < 0 ||
      myArrow.arrowY > height ||
      myArrow.arrowY + myArrow.arrowHeight < 0
    ) {
      myArrow.moving = false;

      // Reset arrow position relative to the archer
      myArrow.arrowX = myArcher.x + width * 0.05;
      myArrow.arrowY = myArcher.y + height * 0.08;
    }
    
    // If the arrow has hit the target, update state and score, then reset
    else if (myArrow.arrowState === "inside target") {
      myArrow.arrowState = "outside target";
      myArrow.moving = false;
      myScores.archeryScore++;

      // Reset arrow position to the archer's hand
      myArrow.arrowX = myArcher.x + width * 0.05;
      myArrow.arrowY = myArcher.y + height * 0.08;
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

      // stop target from getting stuck on the right side
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

  // Select the current music based on the game mode
  if (inWhatMode === "in intro") {
    currentMusic = introMusic;
  }
  else if (inWhatMode === "in bug") {
    currentMusic = bugMusic;
  }
  else if (inWhatMode === "in archery") {
    currentMusic = archeryMusic;
  }

  // adjust volume of specific music based on scroll direction
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

  // Set the current music based on the mode
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

//if 30 seconds have passed show the outro screen
function archeryCheckGameTime() {
  let elapsedTime = millis() - myGameStartTimes.archeryGameStartTime;
  for (let i = 0; i < 1; i++) {
    if (elapsedTime >= 30000) {
      inWhatMode = "in outro";
    }
  }
}

//if 35 seconds have passed show the outro screen
function bugCheckGameTime() {
  let elapsedTime = millis() - myGameStartTimes.bugGameStartTime;
  if (elapsedTime >= 35000) { 
    inWhatMode = "in outro";
  }
}

// Display the intro screen with game instructions
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
  text("move the net with your mouse and click on the bugs as much as you can for 35 seconds", width / 2, height * 0.55);
  text("(make sure the bug is close to the net loop and you are not moving while clicking) ", width / 2, height * 0.6);
  
  
  text("Archery Game:", width / 2, height * 0.7);
  text("Use W/A/S/D or arrow keys to move", width / 2, height * 0.75);
  text("Press SPACE to shoot an arrow at the moving target as much as you can for 30 seconds", width / 2, height * 0.8);
  text("[] if you are lucky, you will find a secret key that reveals a big secret []", width / 2, height * 0.9);
}

// Display outro screen with game results and instructions
function displayOutroScreen() {
  background(0);
  textAlign(CENTER, CENTER);
  textSize(height * 0.06);
  fill(220);
  text("Game Over!", width / 2, height * 0.3);

  textSize(height * 0.04);
  text("Press 'R' to return to the main menu", width / 2, height * 0.45);

  let finalScore; // define final scoer to display in outro screen
  // Show relevant score based on the game played
  if (myScores.whatScore === "bug score") {
    finalScore = myScores.bugScore;
  }
  else if (myScores.whatScore === "archery score") {
    finalScore = myScores.archeryScore;
  }

  // Display only the relevant score
  textSize(height * 0.05);
  text(`Score: ${finalScore}`, width / 2, height * 0.4);


  // Play cheer sound if the player gets 15+ points
  if ((myScores.archeryScore >= 15 || myScores.bugScore >= 10) && !cheerPlayed) {
    cheerSound.play();
    cheerPlayed = true;// to not repeat the sound 
  }

  // Play cheer sound if the player gets 15+ points
  if (myScores.archeryScore < 15 && myScores.bugScore < 10 && !booingPlayed) {
    booingSound.play();
    booingPlayed = true;// to not repeat the sound
  }
}

// Pick a random key for game prompts
function pickRandomKey() {
  randomKey = possibleKeys.charAt(floor(random(possibleKeys.length)));
  console.log("Press '" + randomKey + "' to play the meme sound!"); // message for easy access
}

