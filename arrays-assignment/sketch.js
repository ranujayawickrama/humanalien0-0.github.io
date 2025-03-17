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

let bugBg;
let bubbles = [];

//loading images
function preload() {
  bug = loadImage("firefly.png");
  bugBg = loadImage("bugBg.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bugWidth = bug.width * height * 0.0002 ;
  bugHeight = bug.width * height * 0.0002 ;
  bugX = width/2;
  bugY = height/2;

  for (let i = 0; i < 10 ; i ++){
    spawnBubble();
  }
  // spawn a new bubble every half a second
  window.setInterval(spawnBubble, 500);
}

function draw() {
  background(220);
  displayImages();
  bugMovement();

  for (let bub of bubbles){
    //randomize movement - too much coffee 
    bub.dx = random(-5, 5);
    bub.dy = random(-5, 5);

    // move bubble
    bub.x += bub.dx;
    bub.y += bub.dy;

    fill(bub.r, bub.g, bub.b);
    noStroke();
    circle(bub.x, bub.y, bub.radius*2);
  }
}

function displayImages() {
  image(bugBg, 0, 0, windowWidth, windowHeight);
}

function bugMovement(){
  bugX = noise(timeX)* width;
  bugY = noise(timeY)* height;
  image(bug, bugX, bugY, bugWidth, bugHeight);

  timeX+= bugSpeed;
  timeY+= bugSpeed;
}


//DNJGJVABNGJBGIJGAIOUHAUEBHUVJGHJBHNBAJOBJFI;llllllijjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj


function mousePressed(){
  for (let bub of bubbles){
    // if this bubble is clicked on 
    if (dist(mouseX, mouseY, bub.x, bub.y) < bub.radius){
      let index = bubbles.indexOf(bub);
      bubbles.splice(index, 1);
    };
  }
}

function spawnBubble(){
  let someb= {
    x: random(windowWidth),
    y: random(windowHeight),
    radius: random(40, 80),

    r: random(255),
    g: random(255),
    b: random(255),

    dx: random(-5, 5),
    dy: random(-5, 5),
  };
  bubbles.push(someb);
}
