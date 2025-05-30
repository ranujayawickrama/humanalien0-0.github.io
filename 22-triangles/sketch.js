/* eslint-disable indent */
// Sierpinski Triangle Demo
// Recursion -- but visual!

let theColours = ["red", "green", "blue", "brown", "orange", "yellow", "purple", "pink", ];
let theDepth = 0;
let initialTriangle = [
  {x: 500, y: 50},
  {x: 50, y: 700},
  {x: 1000, y: 700}
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  sierpinski(initialTriangle, theDepth);
}

function draw() {

}

function sierpinski(points, depth) {
  //shell triangle
  fill(theColours[depth]);
  triangle(points[0].x, points[0].y,
           points[1].x, points[1].y,
           points[2].x, points[2].y,
  );

  //escape clause
  if (depth > 0) {
    //pattern -- draw the three new triangles
    //bottom left
    sierpinski([midpoint(points[0], points[1]),
                points[1],
                midpoint(points[1], points[2])],
                depth - 1);

    //top
    sierpinski([midpoint(points[0], points[1]),
                points[0],
                midpoint(points[0], points[2])],
                depth - 1);

    //bottom right
    sierpinski([midpoint(points[1], points[2]),
                points[2],
                midpoint(points[0], points[2])],
                depth - 1);
  }

}


function midpoint(point1, point2) {
  let midX = (point1.x + point2.x) / 2;
  let midY = (point1.y + point2.y) / 2;
  return {x: midX, y: midY};
}

function mousePressed(){
  if (theDepth < 8){
      theDepth++;
  background(220);
  sierpinski(initialTriangle, theDepth);
  }

}