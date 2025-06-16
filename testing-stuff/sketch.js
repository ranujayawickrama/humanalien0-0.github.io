// OOP Pair Programming Starter Code
// Your Names
// The Date


// ------------------------------------------------------------------------- //
// You don't need to edit this section, but you should read it carefully to 
// understand what is required in the classes.

let enterprise;
let shipImage, bulletImage;

function preload() {
  shipImage = loadImage("assets/enterprise.png");
  bulletImage = loadImage("assets/laser-shot.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  enterprise = new Ship(width/2, height/2, shipImage);
}

function draw() {
  background("black");
  enterprise.update();
  enterprise.display();
}

// function keyPressed() {
//   // you only need to use this if you are doing the extra for experts...
//   enterprise.handleKeyPress();
// }

// ------------------------------------------------------------------------- //
// Start editing here!

class Ship {
  constructor(x, y, theImage) {
    this.x = x;
    this.y = y;
    this.image = theImage;
    this.dx = 5;
    this.dy = 5;
    
  }

  update() {
    if(keyIsDown(RIGHT_ARROW)){
      this.x += this.dx;
    }
    if(keyIsDown(LEFT_ARROW)){
      this.x -= this.dx;
    }
    if(keyIsDown(DOWN_ARROW)){
      this.y += this.dy;
    }
    if(keyIsDown(UP_ARROW)){
      this.y += this.dy;
    }

    // if doing extra for experts, show bullet(s)
  }

  display() {
    this.image(width/2, height/2);
  }

  handleKeyPress() {
    // you only need to use this if you are doing the extra for experts...
    // if you are, you should make a bullet if the space key was pressed
  }
}

// ------------------------------------------------------------------------- //

// Extra for Experts 
//  - you can instantiate a bullet (or a bullet array) within the Ship class,
//    and call the display and update functions in the logical location of the 
//    Ship class. If you create an array of bullets, you might want to think about
//    when the bullets should be removed from the array...

// class Bullet {
//   constructor(x, y, dx, dy, theImage) {
//     // define the variables needed for the bullet here
//   }

//   update() {
//     // what does the bullet need to do during each frame? how do we know if it is off screen?
//   }

//   display() {
//     // show the bullet
//   }

//   isOnScreen() {
//     // check if the bullet is still on the screen
//   }
// }

