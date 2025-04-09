let CHESSBOARD_DIMENSIONS = 8;
let cellSize;
let board = [];

function setup() {
  createCanvas(480, 480);
  cellSize = width / CHESSBOARD_DIMENSIONS;
  initBoard();
}

function draw() {
  background(255);
  drawBoard();
  drawPieces();
}

function initBoard() {
  board = Array(CHESSBOARD_DIMENSIONS).fill().map(() => Array(CHESSBOARD_DIMENSIONS).fill(null));
  // Add pawns
  for (let i = 0; i < CHESSBOARD_DIMENSIONS; i++) {
    board[1][i] = 'P';  // White pawns
    board[6][i] = 'p';  // Black pawns
  }
  // Add Rooks
  board[0][0] = board[0][7] = 'R';
  board[7][0] = board[7][7] = 'r';
  // Add Knights
  board[0][1] = board[0][6] = 'N';
  board[7][1] = board[7][6] = 'n';
  // Add Bishops
  board[0][2] = board[0][5] = 'B';
  board[7][2] = board[7][5] = 'b';
  // Queens
  board[0][3] = 'Q'; board[7][3] = 'q';
  // Kings
  board[0][4] = 'K'; board[7][4] = 'k';
}

function drawBoard() {
  for (let row = 0; row < CHESSBOARD_DIMENSIONS; row++) {
    for (let col = 0; col < CHESSBOARD_DIMENSIONS; col++) {
      if ((row + col) % 2 === 0) {
        fill(240);
      }
      else {
        fill(100);
      }
      rect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}

function drawPieces() {
  textAlign(CENTER, CENTER);
  textSize(cellSize * 0.6);
  fill(0);
  for (let row = 0; row < CHESSBOARD_DIMENSIONS; row++) {
    for (let col = 0; col < CHESSBOARD_DIMENSIONS; col++) {
      let piece = board[row][col];
      if (piece) {
        text(piece, col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
      }
    }
  }
}

let selectedPiece = null;
let selectedRow = -1;
let selectedCol = -1;

function mousePressed() {
  let col = floor(mouseX / cellSize);
  let row = floor(mouseY / cellSize);

  if (selectedPiece === null && board[row][col]) {
    selectedPiece = board[row][col];
    selectedRow = row;
    selectedCol = col;
  }

  else if (selectedPiece) {
    board[row][col] = selectedPiece;
    board[selectedRow][selectedCol] = null;
    selectedPiece = null;
  }
}
