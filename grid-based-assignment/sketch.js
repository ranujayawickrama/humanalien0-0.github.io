// chess
// Ranu Jayawickrama
// March 26th
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const SQUARE_SIZE = 80;
let blockColour = "is white";

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  drawBoard();
}

function drawBoard(){
  for (let y = 0; y<=8; y++){
    for(let x = 0; x<=8; x++){
      if(blockColour === "is white"){
        fill(255);
        blockColour = "is black";
      }
      else if(blockColour === "is black"){
        fill(0);
        blockColour = "is white";
      }
      rect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE);
    }
  }
}