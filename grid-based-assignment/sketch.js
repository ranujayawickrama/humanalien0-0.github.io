// // March 28th

// // extras for experts - multiplayer, popup screen
// // april 5 -- reasearching about p5 party and multiplayer
// // april 2 -- reasearching about p5 party and multiplayer
// // april 4 -- researching about movement of chess pieces


let CHESSBOARD_DIMENSIONS = 8;
let cellSize;
let board = [];
let xOffset, yOffset;
let whitePieces = ['p', 'r', 'n', 'b', 'q', 'k'];
let blackPieces = ['P', 'R', 'N', 'B', 'Q', 'K'];
let whatPieces = "white pieces";
let currentTurn = "white"; // Track whose turn it is

function setup() {
  createCanvas(windowWidth, windowHeight);
  //make the largest square that fits
  if (height > width) {
    cellSize = width / CHESSBOARD_DIMENSIONS - width/100;
  }
  else {
    cellSize = height / CHESSBOARD_DIMENSIONS - height/100;
  }
  console.log(width, height);//1592, 774

  // Calculate the offset to center the board
  xOffset = (width - cellSize * CHESSBOARD_DIMENSIONS) / 2;
  yOffset = (height - cellSize * CHESSBOARD_DIMENSIONS) / 2;

  initBoard();
}

function draw() {
  background(255);
  drawBoard();
  drawPieces();
}

function initBoard() {
  for (let i = 0; i < CHESSBOARD_DIMENSIONS; i++) {
    let row = [];

    for (let j = 0; j < CHESSBOARD_DIMENSIONS; j++) {
      row.push(null);
    }

    board.push(row);
  }

  // Add pawns
  for (let i = 0; i < CHESSBOARD_DIMENSIONS; i++) {
    board[1][i] = blackPieces[0];  // White pawns
    board[6][i] = whitePieces[0];  // Black pawns
  }
  // Add Rooks
  board[0][0] = board[0][7] =  blackPieces[1];
  board[7][0] = board[7][7] = whitePieces[1];
  // Add Knights
  board[0][1] = board[0][6] = blackPieces[2];
  board[7][1] = board[7][6] = whitePieces[2];
  // Add Bishops
  board[0][2] = board[0][5] =blackPieces[3];
  board[7][2] = board[7][5] = whitePieces[3];
  // Queens
  board[0][3] = blackPieces[4]; board[7][3] =  whitePieces[4];
  // Kings
  board[0][4] = blackPieces[5]; board[7][4] =  whitePieces[5];
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
      rect(xOffset + col * cellSize, yOffset + row * cellSize, cellSize, cellSize);
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
        text(piece, xOffset + col * cellSize + cellSize / 2, yOffset + row * cellSize + cellSize / 2);
      }
    }
  }
}

let selectedPiece = null;
let selectedRow = -1;
let selectedCol = -1;

function mousePressed() {
  // Calculate which cell was clicked based on mouse position
  let col = floor((mouseX - xOffset) / cellSize);
  let row = floor((mouseY - yOffset) / cellSize);

  // Ignore clicks outside the board
  if (row < 0 || row >= CHESSBOARD_DIMENSIONS || col < 0 || col >= CHESSBOARD_DIMENSIONS) {
    return;
  }

  let clickedPiece = board[row][col];

  // Case 1: Selecting a piece for the first time
  if (selectedPiece === null && clickedPiece) {
    if (currentTurn === "white" && whitePieces.includes(clickedPiece)) {
      selectedPiece = clickedPiece;
      selectedRow = row;
      selectedCol = col;
    }
    else if (currentTurn === "black" && blackPieces.includes(clickedPiece)) {
      selectedPiece = clickedPiece;
      selectedRow = row;
      selectedCol = col;
    }
  }

  // Case 2: Already selected a piece
  else if (selectedPiece) {
    // Case 2a: Clicked on another piece of the same color – switch selection
    if (clickedPiece) {
      if (
        whitePieces.includes(selectedPiece) && whitePieces.includes(clickedPiece) ||
        blackPieces.includes(selectedPiece) && blackPieces.includes(clickedPiece)
      ) {
        selectedPiece = clickedPiece;
        selectedRow = row;
        selectedCol = col;
        return;
      }
    }

    // Case 2b: Valid move or capture
    // Case 2b: Validate pawn move if it's a pawn
    if ((selectedPiece === 'p' || selectedPiece === 'P') &&
        isValidPawnMove(selectedPiece, selectedRow, selectedCol, row, col)) {
      board[row][col] = selectedPiece;
      board[selectedRow][selectedCol] = null;
      selectedPiece = null;
      selectedRow = -1;
      selectedCol = -1;
      currentTurn = currentTurn === "white" ? "black" : "white";
    }
  }
}


// Function to check if the selected piece is an opponent piece
// Function to check if the selected piece can capture the target piece
function isOpponentPiece(piece, targetRow, targetCol) {
  let targetPiece = board[targetRow][targetCol];
  if (!targetPiece) {
    return true;
  } 
  
  // Empty spaces are always valid
  if (whitePieces.includes(piece) && blackPieces.includes(targetPiece)) {
    return true; // White can capture black
  }

  else if (blackPieces.includes(piece) && whitePieces.includes(targetPiece)) {
    return true; // Black can capture white
  }

  return false; // Can't capture own color
}

function isValidPawnMove(piece, fromRow, fromCol, toRow, toCol) {
  let direction;
  let startRow;

  if (whitePieces.includes(piece)) {
    direction = -1;
    startRow = 6;
  }
  else {
    direction = 1;
    startRow = 1;
  }

  let targetPiece = board[toRow][toCol];
  let isForward = fromCol === toCol;
  let isDiagonal = Math.abs(fromCol - toCol) === 1;
  let rowStep = toRow - fromRow;

  let isSingleStep = rowStep === direction && isForward && !targetPiece;
  let isDoubleStep = fromRow === startRow && rowStep === 2 * direction && isForward &&
                    !board[fromRow + direction][fromCol] && !targetPiece;

  let isCapture = rowStep === direction && isDiagonal && targetPiece &&
                  isOpponentPiece(piece, toRow, toCol);

  // Prevent diagonal move to empty square (always invalid)
  if (isDiagonal && !targetPiece) {
    return false;
  }

  return isSingleStep || isDoubleStep || isCapture;
}
