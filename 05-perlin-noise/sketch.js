// Perlin noise
// moving circle
// mRCH 11th


let timeX = 0;
let timeY = 1000;
let deltaTime = 0.01;
let x;
let y;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  fill(0);
  x = noise(timeX)* width;
  y = noise(timeY)* height;
  circle(x, y, 50);

  timeX+= deltaTime;
  timeY+= deltaTime;
}
