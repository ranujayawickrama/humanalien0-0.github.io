class Particle {
  constructor(x, y, dx, dy, particleColours) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = 3;
    this.color = particleColours;
    this.opacity = 255;
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.opacity);
    circle(this.x, this.y, this.radius * 2);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.opacity -= 3.5;
  }

  isDead() {
    return this.opacity <= 0;
  }
}

class Firework {
  constructor(x, y, count) {
    this.particles = [];
    this.startColor = color(random(255), random(255), random(255));
    this.endColor = color(random(255), random(255), random(255));

    for (let i = 0; i < count; i++) {
      let angle = random(TWO_PI);
      let speed = random(3, 6);
      let dx = cos(angle) * speed;
      let dy = sin(angle) * speed;

      let FlightTime = i / count; // from 0 to 1
      let colours = lerpColor(this.startColor, this.endColor, FlightTime);

      this.particles.push(new Particle(x, y, dx, dy, colours));
    }
  }

  update() {
    for (let p of this.particles) {
      p.update();
    }
    this.particles = this.particles.filter(p => !p.isDead());
  }

  display() {
    for (let p of this.particles) {
      p.display();
    }
  }

  isDead() {
    return this.particles.length === 0;
  }
}

class Launcher {
  constructor() {
    this.x = width / 2;
    this.y = height *7/8;
    this.angle = random(-PI / 4, -3 * PI / 4); // mostly upward, some spread
    this.speed = random(8, 10);
    this.dx = cos(this.angle) * this.speed;
    this.dy = sin(this.angle) * this.speed;
    this.trail = [];
    this.maxTrail = 3;
    this.exploded = false;
  }

  update() {
    if (this.exploded) {
      return;
    }

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }

    this.x += this.dx;
    this.y += this.dy;

    // explosion trigger condition
    if (this.y < random(height / 4, height / 3)) {
      fireworks.push(new Firework(this.x, this.y, NUMBER_OF_FIREWORKS_PER_CLICK));
      this.exploded = true;
    }
  }

  display() {
    if (this.exploded) {
      return;
    }

    noFill();
    stroke(255);
    for (let i = 1; i < this.trail.length; i++) {
      let a = this.trail[i - 1];
      let b = this.trail[i];
      stroke(255, map(i, 0, this.trail.length, 50, 1));
      line(a.x, a.y, b.x, b.y);
    }

    noStroke();
    fill(255);
    circle(this.x, this.y, 5);
  }

  isDead() {
    return this.exploded;
  }
}

let fireworks = [];
let launchers = [];
let duration = 3000; // 3 seconds
let fastInterval = 300;  // 0.3 seconds
let slowInterval = 1500;  // 0.5 seconds

const NUMBER_OF_FIREWORKS_PER_CLICK = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  
  noStroke();

  // First 3 seconds: Fast firing
  let launchInterval = setInterval(() => {
    launchers.push(new Launcher());
  }, fastInterval);

  // After 3 seconds: Slow firing
  setTimeout(() => {
    clearInterval(launchInterval);
    setInterval(() => {
      launchers.push(new Launcher());
    }, slowInterval);
  }, duration);
}

function draw() {
  background(0, 0, 0, 30); // trail effect

  for (let l of launchers) {
    l.update();
    l.display();
  }
  launchers = launchers.filter(l => !l.isDead());

  for (let fw of fireworks) {
    fw.update();
    fw.display();
  }
  fireworks = fireworks.filter(fw => !fw.isDead());
}


function mousePressed() {
  launchers.push(new Launcher());
}