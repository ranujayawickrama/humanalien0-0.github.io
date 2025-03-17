// two or three mini games
// 1. click on the randomly moving ball and the colour change and add a score. add a game over screen and a time limit
// 2. generate a random maze everytime u hit refresh and let you move through the maze. add a game over screen and a time limit
// 3. maybe balll shooter
// Ranu Jayawickrama
// March 10th
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"



let bug;
let bugWidth;
let bugHeight;
let timeX = 0;
let timeY = 1000;
let bugX;
let bugY;
let bugSpeed = 0.015;


//loading images
function preload() {
  bug = loadImage("firefly.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bugWidth = bug.width * height * 0.0002 ;
  bugHeight = bug.width * height * 0.0002 ;
  bugX = width/2;
  bugY = height/2;
}

function draw() {
  background(220);
  bugMovement();
}

function displayImages() {
  image(bug, bugX, bugY, bugWidth, bugHeight);
}

function bugMovement(){
  bugX = noise(timeX)* width;
  bugY = noise(timeY)* height;
  image(bug, bugX, bugY, bugWidth, bugHeight);

  timeX+= bugSpeed;
  timeY+= bugSpeed;
}
