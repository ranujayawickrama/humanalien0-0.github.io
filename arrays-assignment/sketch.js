// two or three mini games
// 1. click on the randomly moving ball and the colour change and add a score. add a game over screen and a time limit
// 2. dinosaur game 
// 3. maybe balll shooter
// Ranu Jayawickrama
// March 10th
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let bubbles = [];

let bugX;
let bugY;
let bug;
let bugWidth;
let bugHeight;

let net;
let netWidth;
let netHeight;

let bugBg;
let score = 0;

//loading images
function preload() {
  bug = loadImage("firefly.png");
  bugBg = loadImage("bugBg.jpg");
  net = loadImage("net.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bugWidth = bug.width * height * 0.0002 ;
  bugHeight = bug.width * height * 0.0002;
  netWidth = net.width * height * 0.0004; 
  netHeight = net.height * height * 0.0005; 
  console.log(bugWidth, bugHeight);
  noCursor();

  for (let i = 0; i < 3 ; i ++){
    spawnBubble();
  }
  // spawn a new bubble every half a second
  window.setInterval(spawnBubble, 1500);
 

}
function mousePressed(){
  for (let bub of bubbles){
    // if this bubble is clicked on 
    if (dist(mouseX, mouseY, bub.x , bub.y ) < 28){
      let index = bubbles.indexOf(bub);
      bubbles.splice(index, 1);
      score++;
    };
  }
}

function draw() {
  background(220);
  displayImages();
  bugMovement();
  displayScore();
}

function displayImages() {
  imageMode(CORNER);
  image(bugBg, 0, 0, windowWidth, windowHeight);
  image(net, mouseX-30, mouseY-50, netWidth, netHeight );
}

function spawnBubble(){
  let someb = {
    timeX: random(0, 1000),  // Still needed for movement
    timeY: random(0, 1000),
    
    bugSpeed: random(0.004, 0.008),
    x: random(width),  // Start at random x
    y: random(height), // Start at random y
  };
  bubbles.push(someb);
  console.log(bubbles.length);
}
function bugMovement(){
  for (let bub of bubbles){

    bub.x = noise(bub.timeX) * width;
    bub.y = noise(bub.timeY) * height;
    
    imageMode(CENTER);
    image(bug, bub.x, bub.y, bugWidth, bugHeight);
    

    // move bubble
    bub.timeX += bub.bugSpeed;
    bub.timeY += bub.bugSpeed;
  }
}
function displayScore() {
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
  text("Score: " + score, rectX + rectWidth / 2, rectY + rectHeight / 2); // Display score text
}

