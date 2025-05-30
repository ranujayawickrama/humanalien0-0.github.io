const GRID_DIMENSIONS = 3;
let cellSize;
let mainGrid = [];
let xOffset, yOffset;
let dragPath = [];
let dragColor = null;
let isDragging = false;

let dots = ["red", "green", "blue"];
let completedPaths = []; // Stores valid finished paths

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGridDimensions();
  initialGrid();
}

function draw() {
  background(20, 50, 100);
  drawGrid();
  drawDots();
  drawCompletedPaths();
  drawDragPath();
}

function calculateGridDimensions() {
  const MINI_DIMENSIONS = min(width, height);
  cellSize = MINI_DIMENSIONS / GRID_DIMENSIONS * 0.9;
  xOffset = (width - cellSize * GRID_DIMENSIONS) / 2;
  yOffset = (height - cellSize * GRID_DIMENSIONS) / 2;
}

function initialGrid() {
  for (let y = 0; y < GRID_DIMENSIONS; y++) {
    let row = [];
    for (let x = 0; x < GRID_DIMENSIONS; x++) {
      row.push(null);
    }
    mainGrid.push(row);
  }

  for (let i = 0; i < GRID_DIMENSIONS; i++) {
    mainGrid[i][0] = mainGrid[i][2] = dots[i];
  }
}

function drawGrid() {
  rectMode(CORNER);
  stroke(255);
  strokeWeight(1);
  for (let row = 0; row < GRID_DIMENSIONS; row++) {
    for (let col = 0; col < GRID_DIMENSIONS; col++) {
      fill("black");
      rect(xOffset + col * cellSize, yOffset + row * cellSize, cellSize, cellSize);
    }
  }
}

function drawDots() {
  for (let row = 0; row < GRID_DIMENSIONS; row++) {
    for (let col = 0; col < GRID_DIMENSIONS; col++) {
      const dotColor = mainGrid[row][col];
      if (dotColor) {
        const x = xOffset + col * cellSize;
        const y = yOffset + row * cellSize;
        displayDots(dotColor, x, y);
      }
    }
  }
}

function displayDots(color, x, y) {
  const SIZE = cellSize * 0.4;
  const centerX = x + cellSize / 2;
  const centerY = y + cellSize / 2;
  fill(color);
  noStroke();
  circle(centerX, centerY, SIZE);
}

function mousePressed() {
  const { row, col } = getCellFromMouse();
  if (!isInsideGrid(row, col)) {
    return;
  }

  const color = mainGrid[row][col];
  if (color) {
    isDragging = true;
    dragColor = color;
    dragPath = [{ row, col }];
  }
}

function mouseDragged() {
  if (!isDragging) {
    return;
  }

  const { row, col } = getCellFromMouse();
  if (!isInsideGrid(row, col)) {
    return;
  }

  const last = dragPath[dragPath.length - 1];
  if (last.row === row && last.col === col) {
    return;
  }

  // Undo step if moving back
  if (
    dragPath.length > 1 &&
    dragPath[dragPath.length - 2].row === row &&
    dragPath[dragPath.length - 2].col === col
  ) {
    dragPath.pop();
    return;
  }

  if (
    (mainGrid[row][col] === null || mainGrid[row][col] === dragColor) &&
    !dragPath.some(p => p.row === row && p.col === col) &&
    cellsAreAdjacent(last.row, last.col, row, col)
  ) {
    const newSegA = cellToCenterXY(last);
    const newSegB = cellToCenterXY({ row, col });

    for (const pathObj of completedPaths) {
      const pts = pathObj.path;
      for (let i = 0; i < pts.length - 1; i++) {
        const segA = cellToCenterXY(pts[i]);
        const segB = cellToCenterXY(pts[i + 1]);
        if (collideLineLine(
          newSegA.x, newSegA.y,
          newSegB.x, newSegB.y,
          segA.x, segA.y,
          segB.x, segB.y
        )) {
          removePath(pathObj);
          // No resetDrag here, so new line stays
          return;
        }
      }
    }

    dragPath.push({ row, col });
  }
}


function mouseReleased() {
  // Pure click = delete endpoint
  if (dragPath.length === 1) {
    const { row, col } = dragPath[0];
    const color = mainGrid[row][col];
    for (let i = completedPaths.length - 1; i >= 0; i--) {
      const p = completedPaths[i];
      if (p.color === color) {
        const start = p.path[0];
        const end   = p.path[p.path.length - 1];
        if (start.row === row && start.col === col ||
            end  .row === row && end  .col === col) {
          removePath(p);
          break;
        }
      }
    }
    resetDrag();
    return;
  }

  // End of drag = validate
  if (dragPath.length >= 2) {
    const start = dragPath[0];
    const end   = dragPath[dragPath.length - 1];
    if (
      mainGrid[end.row][end.col] === dragColor &&
      (start.row !== end.row || start.col !== end.col)
    ) {
      completedPaths.push({ color: dragColor, path: [...dragPath] });
    }
  }

  resetDrag();
}

function getCellFromMouse() {
  const col = floor((mouseX - xOffset) / cellSize);
  const row = floor((mouseY - yOffset) / cellSize);
  return { row, col };
}

function isInsideGrid(row, col) {
  return row >= 0 && row < GRID_DIMENSIONS && col >= 0 && col < GRID_DIMENSIONS;
}

function cellsAreAdjacent(r1, c1, r2, c2) {
  return abs(r1 - r2) + abs(c1 - c2) === 1;
}

function resetDrag() {
  dragPath = [];
  dragColor = null;
  isDragging = false;
}

function drawDragPath() {
  if (!isDragging || dragPath.length < 2) {
    return;
  }
  stroke(dragColor);
  strokeWeight(6);
  noFill();
  beginShape();
  for (let pt of dragPath) {
    const { x, y } = cellToCenterXY(pt);
    vertex(x, y);
  }
  endShape();
}

function drawCompletedPaths() {
  for (let p of completedPaths) {
    stroke(p.color);
    strokeWeight(6);
    noFill();
    beginShape();
    for (let pt of p.path) {
      const { x, y } = cellToCenterXY(pt);
      vertex(x, y);
    }
    endShape();
  }
}

function cellToCenterXY(cell) {
  return {
    x: xOffset + cell.col * cellSize + cellSize / 2,
    y: yOffset + cell.row * cellSize + cellSize / 2
  };
}

function removePath(pathObj) {
  // clear intermediate cells
  for (let i = 1; i < pathObj.path.length - 1; i++) {
    const c = pathObj.path[i];
    mainGrid[c.row][c.col] = null;
  }
  const idx = completedPaths.indexOf(pathObj);
  if (idx !== -1) {
    completedPaths.splice(idx, 1);
  }
}


/////////////////////////

// Grid Based Project - Zombie Shooter
// Angadveer Singh Chahal
// 15 Nov, 2024
//
// Extra for Experts:
// Used functioning hex grids[arragement, movement, indices], classes( started using a little before they were taught in class), concepts like collision detection, 
//using grids to make interactive mouse trailing effects

// The game is based around a player that shoots bots preventing them from reaching the left-most edge of the screen.
// 'p' to pause and 'e' to exit

//starting values for timer and score, and reached bots
let timer = 20;
let score  = 0;
let reached = 0;

//storing images 
let myFont;
let pause;

//helps to find Y coords of spawing bots/enemies 
let randomY;

//Timer update data
let lastTimeUpdate = 0;
let timerDelay = 1000;

//Spawn update data
let spawnDelay = 2000; // 2 seconds delay between spawns
let lastSpawnTime = 0;

//mouse animation(circle)
////////////////
let spacing = 20;
let size = [];
let cols, rows;
let scale = 0.2;
////////////////

//mouse animation 2(trailing effect)
///////////////////////////////
const CELL_SIZE = 40;

//the purple-like color
const COLOR_R = 79;
const COLOR_G = 38;
const COLOR_B = 233;

const STARTING_ALPHA = 255;

const PROB_OF_NEIGHBOUR = 50; //50-50 chance
const AMT_FADE_PER_FRAME = 5; 
const STROKE_WEIGHT = 1;

let colorWithAlpha;
let numRows;
let numCols;
let currentRow = -1;
let currentCol = -1;
let allNeighbours = [];
///////////////////////////////

//main grid
////////////////////////////
let mainRows;             
let mainCols;             
let mainCellSize = prompt("Enter desired cell size", 100);
let radius = mainCellSize/2;  
let numSides = 6;         
let gridLength;           
let startingPoint;        
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//angad code
// hex tile deminsions
let hexHeight;
let hexWidth;

//game logic
let paused = false; //use to pause the game
let grid = []; // holds the indices & co-ordinates
let enemies = [];
let bulletsFired = [];
let player;

let gameState = "startScreen";

//preloading font and image
function preload(){
  myFont = loadFont('PressStart2P-Regular.ttf');
  pause = loadImage('./pictures/pausedButton.png');
}



class Player {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
  }

  // Method to display the player
  display() {
    fill(0, 255, 0);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}



class Enemy {
  
  constructor(x, y, size, speed, check) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.check = check;
  }

  // Display the enemy
  display() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  

  // Move towards the player
  moveTowardPlayer(playerX, playerY) {

    if (this.x <= grid[1][0].xCoord) {
      if(this.check === 1){
        reached++;
      }
      this.check = 0;
      return;
    }
  
    // Move the enemy one step to the left
    this.x -= 3/4 * mainCellSize;
  
    //changing the y using conditional statements because of the off-sets 
    if (this.y % hexHeight > hexHeight / 2) {
      this.y += hexHeight / 2;
    } 
    else {
      this.y -= hexHeight / 2;
    }
  }

}

class Bullet {
  constructor(x, y, xSpd, ySpd) {
    this.x = x;
    this.y = y;
    this.xSpd = xSpd;
    this.ySpd = ySpd;
  }

  display() {
    push();
    stroke(230, 255, 0);
    fill(230, 255, 0, 135);
    ellipse(this.x, this.y, 30);
    pop();
  }

  //movement
  update() {
    this.x += this.xSpd;
    this.y += this.ySpd;
    this.xSpd *= 0.994; 
    this.ySpd *= 0.994;
  }

  //check collision
  hitScan() {
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      let distToEnemy = dist(this.x, this.y, enemy.x, enemy.y);
      
      // Check if the bullet is colliding with the enemy
      if (distToEnemy < (enemy.size / 2 + 15)) { // 15 is the radius of the bullet
        enemies.splice(i, 1); // Remove the enemy from the array
        score++;
        return true; // Return true to indicate collision
      }
    }
    return false; // No collision
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = width/spacing;
  rows = height/spacing;
  
  colorWithAlpha = color(COLOR_R, COLOR_G, COLOR_B, STARTING_ALPHA);
  stroke(colorWithAlpha);
  strokeWeight(STROKE_WEIGHT);
  numRows = Math.ceil(windowHeight/ CELL_SIZE);
  numCols = Math.ceil(windowWidth/ CELL_SIZE);

  //main grid 
  mainRows = floor(windowHeight/(sqrt(3)*radius));
  mainCols = floor( 3/4 * windowWidth/(1.5 * mainCellSize));

  gridLength = mainCellSize*mainCols + mainCellSize * (mainCols - 1)/2; 
  startingPoint = (windowWidth - gridLength)/2;

  player = new Player(width / 2, height / 2, mainCellSize/1.5, 3);

  hexWidth = mainCellSize;
  hexHeight = sqrt(3) * radius;
}

function draw() {
  frameRate(60);
  background(220);
  if(gameState === "startScreen"){
    startScreen();
  }

  if(gameState === "startGame"){
    startGame();
  }

  if(gameState === "endScreen"){
    endScreen();
  }
}

//START SCREEN
function startScreen(){
  let buttonX = width/2; //x-coordinate of button
  let buttonY = 3/5 * height; //y-coordinate of button
  background(150);

  let fontSize = map(width, 0, 1000, 10, 65); // calculating responsive font size

  //the mouse animation
  ////////////////////////////
  rectMode(CENTER);
  for(let y = 0; y < rows; y++){
    size[y] = [];
    for(let x= 0; x < cols; x++){
      size[y][x] = dist(mouseX,mouseY, spacing/2 + x * spacing, spacing/2 + y * spacing) * scale;
    }
  }
  
  for(let y = 0; y < rows; y++){
    for(let x= 0; x < cols; x++){
      fill(30);
      noStroke();
      rect(spacing/2 + x * spacing, spacing/2 + y * spacing, size[y][x], size[y][x] );

    }
  }
  ////////////////////////////

  //Title text
  fill(255);
  textFont(myFont);
  textAlign(CENTER, CENTER);
  textSize(fontSize);
  text("Zombie shooter", width / 2, height / 2 - 100); 

  //button hovered
  if(mouseX < buttonX + 200 && mouseX > buttonX - 200 && mouseY > buttonY - 50 && mouseY < buttonY + 50){
    fill(255);
    rect(buttonX, buttonY ,300 ,70 ,50);
    fill(0);
    textSize(15);
    text("Start", buttonX, buttonY);  

    if(mouseIsPressed){
      gameState = "startGame";
    }
  }

  //button normal
  else{
    //button
    fill(0);
    rectMode(CENTER);
    rect(buttonX,buttonY ,300 ,70 ,50); //draw button 
    
    //button text
    fill(255);
    textSize(15);
    text("Start", buttonX, buttonY);
  }
}

//START GAME
function startGame(){
  background(0);

  fill(255);
  stroke(255);
  textSize(20);
  text("Time left: \n" + timer, windowWidth - 120, 40); //timer display

  textSize(15);
  text("P to  \n pause & resume \n \n E to \n exit", 0 + 120, 60); // pausing and exiting info shown

  

  strokeJoin(ROUND);
  rectMode(CENTER);

  let c = 1; // just an acculator used to help in the offsets using if c%2 then this, else that

  let height = sqrt(3) * 0.5 * mainCellSize;
  let radius = mainCellSize/2;

  //used as the parameters when calling the hexagon function
  let centerX;
  let centerY;

  let coordX;
  let coordY;
  for(let y = 0, j = 0; y < mainRows; y+=0.5, j+=0.5){
    if(c%2 !== 0){
      grid[j] = [];
    }
    for(let x = 0, i = 0; x < mainCols * 1.5; x+=1.5, i+=2){
      if(c% 2 === 0){
        centerX = (x * mainCellSize + 0.75 * mainCellSize) + startingPoint;
        centerY = y * height;
        if(centerX - radius > 0 && centerX + radius < windowWidth && centerY + radius < windowHeight){
          drawHexagon(centerX, centerY , mainCellSize, 0); //black
          grid[floor(j)][i + 1] = {xIndex: i + 1, yIndex: floor(j), xCoord: centerX, yCoord: centerY };
        }
      }
      else{
        centerX = x * mainCellSize + startingPoint;
        centerY = y * height;
        if(centerX - radius > 0 && centerX + radius < windowWidth && centerY - radius > 0 ){
          drawHexagon( centerX , centerY , mainCellSize, 50); //gray
          grid[floor(j)][i] = {xIndex: i, yIndex: j, xCoord: centerX, yCoord: centerY };
        }
      }
    }
    c++; // to make sure that the next set of hexagons made are off-set 
    
  }

  //this means the game will truly pause when p is clicked
  if(!paused){
    updateGame();
  }

  if(paused){
    rectMode(CORNER);
    fill(100,150);
    noStroke();
    rect(0,0,windowWidth , windowHeight);
    imageMode(CENTER);
    image(pause, windowWidth/2, windowHeight/2, 120, 120);
  }
}

function keyPressed(){
  if(key === 'P' || key === 'p'){
    paused = !paused; 
  }

  if(key === 'e' || key === 'E'){
    gameState = "endScreen";
  }
}

function mousePressed() {
  let dx = mouseX - player.x; // Difference in x position between mouse and player
  let dy = mouseY - player.y; // Difference in y position between mouse and player
  let angle = atan2(dy, dx);  // Calculate angle

  // Set speed based on angle
  let bulletSpeed = 12;
  let xSpd = cos(angle) * bulletSpeed;
  let ySpd = sin(angle) * bulletSpeed;

  let oneBullet = new Bullet(player.x, player.y, xSpd, ySpd);
  bulletsFired.push(oneBullet);
}

// enemy movement delay data
let enemyMoveTimer = 0;
let enemyMoveInterval = 500;

function updateGame(){
  if (millis() - lastTimeUpdate >= timerDelay && timer > 0) {  //update timer
    timer--; 
    lastTimeUpdate = millis(); 
  }

  player.x = grid[floor(mainRows/2)][0].xCoord;
  player.y = grid[floor(mainRows/2)][0].yCoord;

  // player.move();
  player.display();

  //spawing of enemies 
  if (millis() - lastSpawnTime > spawnDelay) {
    spawnEnemy();
    lastSpawnTime = millis(); // Update last spawn time
  }

  //movement of enemies 
  if (millis() - enemyMoveTimer >= enemyMoveInterval){
    for (let enemy of enemies) {
      enemy.moveTowardPlayer(grid[0][grid[0].length - 1].xCoord - gridLength, enemy.y);
    }
    enemyMoveTimer = millis();
  }
  
  //displaying enemies
  for(let enemy of enemies){
    enemy.display();
  }
 
  //entire bullet data
  for (let i = bulletsFired.length - 1; i >= 0; i--) {
    let bullet = bulletsFired[i];
    bullet.display();
    bullet.update();
    
    // Check for collision
    if (bullet.hitScan()) {
      bulletsFired.splice(i, 1); // Remove the bullet after a hit
    }
  }

  if(timer<=0){   ///end the game
    gameState = "endScreen";
  }
}


//END SCREEN
function endScreen(){
  let buttonX = width/2; //x-coordinate of button
  let buttonY = 3/5 * height + 150; //y-coordinate of button
  
  background(31);
  // finding indices 
  let row = floor(mouseY/CELL_SIZE); 
  let col = floor(mouseX/CELL_SIZE);

  //updating current grid locations of mouse 
  if(row !== currentRow || col !== currentCol){
    currentRow = row;
    currentCol = col;
    
    let newNeighbours = getRandomNeighours(row, col);
    for (let neighbour of newNeighbours) {
      allNeighbours.push(neighbour);
    }    
  }

  //co-ordinates of the square the mouse is hovering on
  let x = col * CELL_SIZE; 
  let y = row * CELL_SIZE;

  noFill();
  stroke(colorWithAlpha);
  rect(x, y, CELL_SIZE, CELL_SIZE);

  //displaying neighbour grid cells
  for(let neighbour of allNeighbours){
    let neighbourX = neighbour.col * CELL_SIZE;
    let neighbourY = neighbour.row * CELL_SIZE;

    

    neighbour.opacity = max(0, neighbour.opacity - AMT_FADE_PER_FRAME);
    stroke(COLOR_R, COLOR_B, COLOR_G, neighbour.opacity);
    rect(neighbourX, neighbourY, CELL_SIZE, CELL_SIZE);
  }

  allNeighbours = allNeighbours.filter((neighbour) => neighbour.opacity > 0); //removing neighbours with 0 opacity

  let fontSize = map(width, 0, 1000, 10, 65); // calculating responsive font size

  //Title text
  fill(255);
  textFont(myFont);
  textAlign(CENTER, CENTER);
  textSize(55);
  text("You killed " + score + " bots \n and " + reached + "\n bots reached the end" , width / 2, height / 2 - 100); 

  //button hovered
  if(mouseX < buttonX + 200 && mouseX > buttonX - 200 && mouseY > buttonY - 50 && mouseY < buttonY + 50){
    fill(10);
    rect(buttonX, buttonY ,300 ,70 ,50);
    fill(255);
    textSize(15);
    text("Back to Home", buttonX, buttonY);  

    if(mouseIsPressed){
      gameState = "startScreen";
    }
  }

  //button normal
  else{
    //button
    fill(50);
    rectMode(CENTER);
    rect(buttonX,buttonY ,300 ,70 ,50); //draw button 
    
    //button text
    fill(255);
    textSize(15);
    text("Back to Home", buttonX, buttonY);
  }
}

//STORE A RANDOM NUMBER OF NEIGHBOURS IN AN ARRAY
function getRandomNeighours(row, col){
  let neighbours = [];
  for(let dRow = -1; dRow <= 1; dRow++){ // top and bottom neighbours 
    for(let dCol = -1; dCol <= 1; dCol++){ //left and right neighbours 
      let neighbourRow = row + dRow;
      let neighbourCol = col + dCol;

      let isCurrent  = (dRow === 0 && dCol === 0); // boolean variable to check whether the neighbour is the current cell itself 

      //boolean variable to check bounds of neighbour cells
      let withinBounds = 
      neighbourRow >= 0 &&
      neighbourRow < numRows &&
      neighbourCol >= 0 &&
      neighbourCol < numCols;

      if(!isCurrent && withinBounds && random(0,100) < PROB_OF_NEIGHBOUR){
        neighbours.push({row:neighbourRow, col: neighbourCol, opacity: 255});
      }
    }

  }
  
  return neighbours;

}

//DRAW THE HEX TILES
function drawHexagon(x, y, d, colour){
  stroke(255);
  fill(colour);
  beginShape();
  vertex(x - 0.5 * d,y); // extreme left 
  
  //top 
  vertex(x - 0.25 * d, y - 0.5 * (Math.sqrt(3) * 0.5 * d)); // top left 
  vertex(x + 0.25 * d, y - 0.5 * (Math.sqrt(3) * 0.5 * d)); // top right
  
  vertex(x + 0.5 * d,y ); // extreme right 
  
  //bottom
  vertex(x + 0.25 * d, y + 0.5 * (Math.sqrt(3) * 0.5 * d)); // bottom right
  vertex(x - 0.25 * d, y + 0.5 * (Math.sqrt(3) * 0.5 * d));// bottom left 
  
  endShape(CLOSE);
}

function spawnEnemy() {
  let x = grid[0][grid[0].length - 1].xCoord; // the center of the last column
  randomY = floor(random(1, mainRows - 1)); 
  console.log(randomY);
  let y = grid[randomY][grid[randomY].length - 1].yCoord ; // the center of a random row
  enemies.push(new Enemy(x, y, mainCellSize/1.5, random(5,10),1));
}