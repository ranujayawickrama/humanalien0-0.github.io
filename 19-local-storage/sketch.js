// local storage = to store highscores and stuff
// Ranu
// April 30th

let numbreOfClicks = 0;
let highestClick = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  //is there an old high score
  if(getItem("highscore")){
    highestClick = getItem("highscore");
  }
}

function draw() {
  background(220);
  displayTheClicks();
  displayHighest();
}

function mousePressed(){
  numbreOfClicks++;
  if (numbreOfClicks > highestClick){
    highestClick  = numbreOfClicks;
    storeItem("highscore", highestClick);
  }
}

function displayTheClicks(){
  fill("black");
  textSize(50);
  textAlign(CENTER, CENTER);
  text(numbreOfClicks, width/2, height/2);
}

function displayHighest(){
  fill("green");
  textSize(50);
  textAlign(CENTER, CENTER);
  text(highestClick, width/2, height/2-150);
}