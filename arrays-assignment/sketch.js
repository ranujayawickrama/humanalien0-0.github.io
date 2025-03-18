// two or three mini games
// 1. click on the randomly moving ball and the colour change and add a score. add a game over screen and a time limit
// 2. generate a random maze everytime u hit refresh and let you move through the maze. add a game over screen and a time limit
// 3. maybe balll shooter
// Ranu Jayawickrama
// March 10th
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"



// let bug;
// let bugWidth;
// let bugHeight;
// let timeX;
// let timeY;
// let bugX;
// let bugY;
// let bugSpeed = 0.01;

// let bugBg;

// //loading images
// function preload() {
//   bug = loadImage("firefly.png");
//   bugBg = loadImage("bugBg.jpg");
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight);

//   bugX = width/2;
//   bugY = height/2;

//   timeX = random(0, 100);
//   timeY = random(500, 1000);

// }

// function draw() {
//   background(220);
//   displayImages();
//   bugMovement();

// }

// function displayImages() {
//   image(bugBg, 0, 0, windowWidth, windowHeight);
// }

// function bugMovement(){
//   bugX = noise(timeX)* width;
//   bugY = noise(timeY)* height;
//   image(bug, bugX, bugY, bugWidth, bugHeight);

//   timeX+= bugSpeed;
//   timeY+= bugSpeed;
// }

//lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll

let bubbles = [];
let bugX;
let bugY;
let bug;
let bugWidth;
let bugHeight;
let bugBg;

//loading images
function preload() {
  bug = loadImage("firefly.png");
  bugBg = loadImage("bugBg.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bugWidth = bug.width * height * 0.0002 ;
  bugHeight = bug.width * height * 0.0002 ;

  for (let i = 0; i < 3 ; i ++){
    spawnBubble();
  }
  // spawn a new bubble every half a second
  window.setInterval(spawnBubble, 2000);

}
function mousePressed(){
  for (let bub of bubbles){
    // if this bubble is clicked on 
    if (dist(mouseX, mouseY, bub.x, bub.y) < 27){
      let index = bubbles.indexOf(bub);
      bubbles.splice(index, 1);
    };
  }
}

function draw() {
  background(220);
  displayImages();
  for (let bub of bubbles){

    bub.x = noise(bub.timeX) * width;
    bub.y = noise(bub.timeY) * height;
    
    fill("green");
    noStroke();
    circle(bub.x, bub.y, 50);

    // move bubble
    bub.timeX += bub.bugSpeed;
    bub.timeY += bub.bugSpeed;
  }
}

function displayImages() {
  image(bugBg, 0, 0, windowWidth, windowHeight);
}

function spawnBubble(){
  let someb = {
    timeX: random(0, 1000),  // Still needed for movement
    timeY: random(0, 1000),
    
    bugSpeed: random(0.005, 0.008),
    x: random(width),  // Start at random x
    y: random(height), // Start at random y
  };
  bubbles.push(someb);
}
