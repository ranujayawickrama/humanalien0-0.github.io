// translate/ rotate demo


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  rectMode(CENTER);
  push ();
  translate(width/2, height/2);
  rotate(45);
  rect(0, 0, 200, 75);
  pop();

  fill("red");
  rect(100, 100, 200, 200);
}
