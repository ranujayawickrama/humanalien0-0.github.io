// chess game
// Ranu jayawickrama
// March 28th

// extras for experts - multiplayer, popup screen

let cellSize;
const CHESSBOARD_DIMENSIONS = 8;
let grid;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //make the largest square that fits
  if (height > width) {
    cellSize = width / CHESSBOARD_DIMENSIONS;
  }
  else {
    cellSize = height / CHESSBOARD_DIMENSIONS;
  }

  grid = generateChessBoard(CHESSBOARD_DIMENSIONS, CHESSBOARD_DIMENSIONS);
}

function draw() {
  background(220);
  displayChessBoard();
}

function displayChessBoard() {

  for (let y = 0; y < CHESSBOARD_DIMENSIONS; y++) {
    for (let x = 0; x < CHESSBOARD_DIMENSIONS; x++) {
      if (grid[y][x] === 1) {
        fill("black");
      }
      else if (grid[y][x] === 0) {
        fill("white");
      }
      
      rect(x * cellSize, y * cellSize, cellSize);
    }
  }
}

function generateChessBoard(cols, rows) {
  let aChessBoard = [];
  let isWhite = true;
  for (let y = 0; y < rows; y++) {
    aChessBoard.push([]);
    isWhite = !isWhite;//change the pattern when starting a new row
    for (let x = 0; x < cols; x++) {

      if (isWhite) {
        aChessBoard[y].push(0);
        isWhite = false;
      }
      else {
        aChessBoard[y].push(1);
        isWhite = true;
      }
    }
  }
  return aChessBoard;
}

