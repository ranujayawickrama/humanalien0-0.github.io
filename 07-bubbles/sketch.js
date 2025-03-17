// bubble of object notation and arrays demo
// Your Name
// march 17 

let bubbles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10 ; i ++){
    spawnBubble();
  }
  // spawn a new bubble every half a second
  window.setInterval(spawnBubble, 500);

}

function mousePressed(){
  for (let bub of bubbles){
    // if this bubble is clicked on 
    if (dist(mouseX, mouseY, bub.x, bub.y) < bub.radius){
      let index = bubbles.indexOf(bub);
      bubbles.splice(index, 1);
    };
  }
}



function draw() {
  background(220);

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
