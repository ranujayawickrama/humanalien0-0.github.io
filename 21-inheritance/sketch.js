// OOP inhereitance demo 
// May 16th, 2025

let theShapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10; i++){
    let someColour = color(random(255), random(255), random(255));
    let x = random(width);
    let y = random(height);
    let someShape = new Shape(x, y, someColour);
    theShapes = push(someShape);
  }
}

function draw() {
  background(220);
  for(let theS)
}

class Shape {
  constructor(x, y, color){
    this.x = x;
    this.y = y;
    this.color = color;
  } 

  display(){
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, 30, 60);
  }
}