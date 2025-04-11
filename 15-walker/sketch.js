// walker oop demo

class Walker {
  constructor(x, y, theColour){
    this.x = x;
    this.y = y;
    this.color = theColour;
    this.speed = 10;
    this.radius = 10;
  }

  display(){
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.radius*2);
  }

  move(){
    let choice = random(100);
    if(choice < 25){
      //up
      this.y -= this.speed;
    }
    else if(choice <50){
      //down
      this.y += this.speed;
    }
    else if (choice < 75){
      //left
      this.x -= this.speed;
    }

    else if (choice < 100){
      //right
      this.x += this.speed;
    }
  }
}

let theWalkers = [];
// let luke;
// let ranu;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // luke = new Walker(width/2, height/2, "red");
  // ranu = new Walker(200, 300, "blue");
  spawnWalker(width/2, height/2);
}

function draw() {
  for (let myWalker of theWalkers){
    myWalker.move();
    myWalker.display();
  }
}

function mousePressed(){
  spawnWalker(mouseX, mouseY);
}

function spawnWalker(x, y){
  let r = random(255);
  let g = random(255);
  let b = random(255);

  let someColour = color(r, g, b);
  let someWalker = new Walker(x, y, someColour);
  theWalkers.push(someWalker);
}