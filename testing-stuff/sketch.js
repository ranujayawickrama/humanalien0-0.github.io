// Connected Nodes with Gradient Dots & Dynamic Background

const DEFAULT_SPEED = 4;
const DEFAULT_RADIUS = 40;
const DEFAULT_REACH = 220;
const MAX_RADIUS = 65;
const MIN_RADIUS = 40;
const DELTA_TIME = 0.01;

let balls = [];
let idCounter = 0;
const MAX_BALLS = 40;
let spawnInterval = 1000; // spawn every 1000ms = 1 second
let lastSpawnTime = 0;


function setup() {
  

  createCanvas(windowWidth, windowHeight);
  GRADIENT_LEFT = color(255, 100, 150);  // Pinkish (left)
  GRADIENT_RIGHT = color(100, 200, 255); // Bluish (right)

  GRADIENT_TOP = color(255, 120, 80);    // Orangish (top)
  GRADIENT_BOTTOM = color(180, 100, 255); // Purplish (bottom)


  // Add one starting node in the center
  balls.push(new MovingPoint(width / 2, height / 2));
}

function draw() {
  updateBackgroundColor();

  // Timed spawn logic
  if (millis() - lastSpawnTime > spawnInterval && balls.length < MAX_BALLS) {
    let randX = random(width);
    let randY = random(height);
    balls.push(new MovingPoint(randX, randY));
    lastSpawnTime = millis();
  }

  for (let node of balls) {
    node.update();
  }

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].connectTo(balls[j]);
    }
  }

  for (let node of balls) {
    node.display();
  }
}

function updateBackgroundColor() {
  if (balls.length === 0) {
    background(20); // very dark if nothing is on screen
    return;
  }

  let totalR = 0, totalG = 0, totalB = 0;

  for (let node of balls) {
    let w = map(node.x, 0, width, 1.5, 0.5);
    totalR += red(node.color) * w;
    totalG += green(node.color) * w;
    totalB += blue(node.color) * w;
  }

  let avgR = totalR / balls.length;
  let avgG = totalG / balls.length;
  let avgB = totalB / balls.length;

  // Darker background with color influence
  background(avgR * 0.5, avgG * 0.5, avgB * 0.5, 70);
}



class MovingPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = DEFAULT_SPEED;
    this.radius = DEFAULT_RADIUS;
    this.reach = DEFAULT_REACH;
    this.maxRadius = MAX_RADIUS;
    this.minRadius = MIN_RADIUS;
    let horiz = lerpColor(GRADIENT_LEFT, GRADIENT_RIGHT, this.x / width);
    let vert = lerpColor(GRADIENT_TOP, GRADIENT_BOTTOM, this.y / height);
    this.color = lerpColor(horiz, vert, 0.5);

    this.xTime = random(1000);
    this.yTime = random(1000);
    this.id = idCounter++;
    this.alpha = 0;
    this.fadeSpeed = 5; // controls how fast it fades in

  }

  update() {
    this.move();
    this.wrapAroundScreen();
    this.adjustSize();
  }

  display() {
    noStroke();
    let fadedColor = color(
      red(this.color),
      green(this.color),
      blue(this.color),
      this.alpha
    );
    fill(fadedColor);
    circle(this.x, this.y, this.radius * 2);

    // Gradually increase alpha for fade-in
    if (this.alpha < 255) {
      this.alpha += this.fadeSpeed;
      this.alpha = min(this.alpha, 255);
    }
  }

  adjustSize() {
    let mouseDistance = dist(mouseX, mouseY, this.x, this.y);
    if (mouseDistance < this.reach) {
      this.radius = map(mouseDistance, 0, this.reach, this.maxRadius, this.minRadius);
    }
    else {
      this.radius = this.minRadius;
    }
  }

  connectTo(otherNode) {
    let distance = dist(this.x, this.y, otherNode.x, otherNode.y);
    if (distance < this.reach) {
      let alpha = map(distance, 0, this.reach, 255, 0);
      stroke(
        red(this.color),
        green(this.color),
        blue(this.color),
        alpha
      );
      strokeWeight(5);
      line(this.x, this.y, otherNode.x, otherNode.y);
    }
  }

  move() {
    let dx = noise(this.xTime);
    let dy = noise(this.yTime);

    dx = map(dx, 0, 1, -this.speed, this.speed);
    dy = map(dy, 0, 1, -this.speed, this.speed);

    this.x += dx;
    this.y += dy;

    this.xTime += DELTA_TIME;
    this.yTime += DELTA_TIME;
  }

  wrapAroundScreen() {
    let margin = this.radius;

    // Smooth horizontal wrapping
    if (this.x < -margin) {
      this.x = width + margin;
      this.xTime = random(1000);
    }
    else if (this.x > width + margin) {
      this.x = -margin;
      this.xTime = random(1000);
    }

    // Smooth vertical wrapping
    if (this.y < -margin) {
      this.y = height + margin;
      this.yTime = random(1000);
    }
    else if (this.y > height + margin) {
      this.y = -margin;
      this.yTime = random(1000);
    }

    // Recalculate color based on new position
    let horiz = lerpColor(GRADIENT_LEFT, GRADIENT_RIGHT, this.x / width);
    let vert = lerpColor(GRADIENT_TOP, GRADIENT_BOTTOM, this.y / height);
    this.color = lerpColor(horiz, vert, 0.5);
  }
}
