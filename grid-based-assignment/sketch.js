let CHESSBOARD_DIMENSIONS = 8;
let cellSize;
let board = [];
let xOffset, yOffset;

let whitePieces = { pawn: null, rook: null, knight: null, bishop: null, queen: null, king: null };
let blackPieces = { pawn: null, rook: null, knight: null, bishop: null, queen: null, king: null };

let currentTurn = "white";

let selectedPieceScale = 1.25;  // Factor to increase size when selected
let defaultPieceScale = 1; // Default size of the piece
let selectedPiece = null;
let selectedRow = -1;
let selectedCol = -1;
let gameOver = false;
let winner = null;



// ===== PRELOAD IMAGES =====
function preload() {
  whitePieces.pawn = loadImage("chess-pawn-white.png");
  whitePieces.rook = loadImage("chess-rook-white.png");
  whitePieces.knight = loadImage("chess-knight-white.png");
  whitePieces.bishop = loadImage("chess-bishop-white.png");
  whitePieces.queen = loadImage("chess-queen-white.png");
  whitePieces.king = loadImage("chess-king-white.png");

  blackPieces.pawn = loadImage("chess-pawn-black.png");
  blackPieces.rook = loadImage("chess-rook-black.png");
  blackPieces.knight = loadImage("chess-knight-black.png");
  blackPieces.bishop = loadImage("chess-bishop-black.png");
  blackPieces.queen = loadImage("chess-queen-black.png");
  blackPieces.king = loadImage("chess-king-black.png");
}


// ===== SETUP =====
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Use our dedicated function to calculate cellSize, xOffset, and yOffset.
  calculateBoardDimensions(); // <-- This sets cellSize, xOffset, and yOffset.
  
  initBoard();
  
  // REMOVED: Duplicate recalculation that was here in the original code.
}


// ===== MAIN DRAW LOOP =====
function draw() {
  background(255);
  drawBoard();
  drawPieces();
  drawTurnIndicator(); // Add this line to draw the turn indicator

  if (gameOver) {
    drawEndScreen();
    noLoop();
  }
}


// ===== INITIALIZE BOARD =====
function initBoard() {
  board = [];
  for (let i = 0; i < CHESSBOARD_DIMENSIONS; i++) {
    let row = [];
    for (let j = 0; j < CHESSBOARD_DIMENSIONS; j++) {
      row.push(null);
    }
    board.push(row);
  }

  // Pawns
  for (let i = 0; i < CHESSBOARD_DIMENSIONS; i++) {
    board[1][i] = { type: "pawn", color: "black" };
    board[6][i] = { type: "pawn", color: "white" };
  }

  // Rooks
  board[0][0] = board[0][7] = { type: "rook", color: "black" };
  board[7][0] = board[7][7] = { type: "rook", color: "white" };

  // Knights
  board[0][1] = board[0][6] = { type: "knight", color: "black" };
  board[7][1] = board[7][6] = { type: "knight", color: "white" };

  // Bishops
  board[0][2] = board[0][5] = { type: "bishop", color: "black" };
  board[7][2] = board[7][5] = { type: "bishop", color: "white" };

  // Queens
  board[0][3] = { type: "queen", color: "black" };
  board[7][3] = { type: "queen", color: "white" };

  // Kings
  board[0][4] = { type: "king", color: "black" };
  board[7][4] = { type: "king", color: "white" };
}


// ===== DRAW BOARD =====
function drawBoard() {
  // Set rectMode to CORNER so that squares are drawn consistently.
  rectMode(CORNER);
  
  for (let row = 0; row < CHESSBOARD_DIMENSIONS; row++) {
    for (let col = 0; col < CHESSBOARD_DIMENSIONS; col++) {
      if ((row + col) % 2 === 0) {
        fill(240);
      }
      else {
        fill(100);
      }
      stroke(0); // Draw square borders
      strokeWeight(1);
      rect(xOffset + col * cellSize, yOffset + row * cellSize, cellSize, cellSize);
    }
  }
}


// ===== DRAW PIECES =====
function drawPieces() {
  for (let row = 0; row < CHESSBOARD_DIMENSIONS; row++) {
    for (let col = 0; col < CHESSBOARD_DIMENSIONS; col++) {
      let piece = board[row][col];
      if (piece) {
        let x = xOffset + col * cellSize;
        let y = yOffset + row * cellSize;
        displayPiece(piece, x, y, row, col); // Pass row and col to displayPiece
      }
    }
  }
}


// ===== DISPLAY A PIECE =====
function displayPiece(piece, x, y, row, col) {
  let img;
  if (piece.color === "white") {
    img = whitePieces[piece.type];
  }
  else {
    img = blackPieces[piece.type];
  }

  let scale = selectedPiece && selectedRow === row && selectedCol === col ? selectedPieceScale : defaultPieceScale;

  if (img) {
    let imgSize = cellSize * scale;
    // Center the image in the cell so it doesn't appear shifted.
    let centerX = x + cellSize / 2 - imgSize / 2;
    let centerY = y + cellSize / 2 - imgSize / 2;
    image(img, centerX, centerY, imgSize, imgSize);
  }
}


// ====== SELECTION & MOVEMENT ======
function mousePressed() {
  if (gameOver) {
    // Check if Play Again button was clicked
    let btnX = width / 2;
    let btnY = height / 2 + 50;
    let btnW = 150;
    let btnH = 40;

    if (mouseX > btnX - btnW / 2 && mouseX < btnX + btnW / 2 &&
        mouseY > btnY - btnH / 2 && mouseY < btnY + btnH / 2) {
      restartGame();
    }
    return;
  }

  const { row, col } = getClickedCell();
  if (!isValidCell(row, col)) {
    return;
  }

  const clickedPiece = board[row][col];

  if (selectedPiece) {
    handlePieceMovement(clickedPiece, row, col);
  }
  else if (clickedPiece && clickedPiece.color === currentTurn) {
    selectPiece(clickedPiece, row, col);
  }
}


// Helper function to get the clicked cell
function getClickedCell() {
  const col = floor((mouseX - xOffset) / cellSize);
  const row = floor((mouseY - yOffset) / cellSize);
  return { row, col };
}


// Helper function to check if the clicked cell is valid (within the board's boundaries)
function isValidCell(row, col) {
  return row >= 0 && row < CHESSBOARD_DIMENSIONS && col >= 0 && col < CHESSBOARD_DIMENSIONS;
}


// Handle piece selection
function selectPiece(piece, row, col) {
  selectedPiece = piece;
  selectedRow = row;
  selectedCol = col;
}


// Handle movement of the selected piece
function handlePieceMovement(clickedPiece, row, col) {
  // If the clicked piece is the same color as the selected piece, reselect it.
  if (clickedPiece && clickedPiece.color === selectedPiece.color) {
    selectPiece(clickedPiece, row, col);
    return;
  }

  // Validate and perform the move based on the piece type.
  const moveValidator = getMoveValidator(selectedPiece.type);
  if (moveValidator && moveValidator(selectedPiece, selectedRow, selectedCol, row, col)) {
    movePiece(row, col);
    switchTurn();
  }
}


// Get the appropriate move validation function based on the piece type
function getMoveValidator(pieceType) {
  const pieceValidators = {
    "rook": isValidRookMove,
    "bishop": isValidBishopMove,
    "queen": isValidQueenMove,
    "knight": isValidKnightMove,
    "king": isValidKingMove,
    "pawn": isValidPawnMove
  };
  return pieceValidators[pieceType];
}


// Move the selected piece to a new position
function movePiece(row, col) {
  let targetPiece = board[row][col];
  
  // Check if the move captures a king.
  if (targetPiece && targetPiece.type === "king") {
    gameOver = true;
    winner = selectedPiece.color; // current player wins
  }

  board[row][col] = selectedPiece;
  board[selectedRow][selectedCol] = null;
  selectedPiece = null;
  selectedRow = -1;
  selectedCol = -1;
}


// Switch the current turn (from white to black or vice versa)
function switchTurn() {
  currentTurn = currentTurn === "white" ? "black" : "white";
}


// ===== ROOK MOVEMENT LOGIC =====
function isValidRookMove(piece, fromRow, fromCol, toRow, toCol) {
  if (fromRow === toRow) {
    // Moving horizontally.
    let direction = toCol > fromCol ? 1 : -1;
    for (let col = fromCol + direction; col !== toCol; col += direction) {
      if (board[fromRow][col] !== null) {
        return false; // Blocked by a piece.
      }
    }
  }
  else if (fromCol === toCol) {
    // Moving vertically.
    let direction = toRow > fromRow ? 1 : -1;
    for (let row = fromRow + direction; row !== toRow; row += direction) {
      if (board[row][fromCol] !== null) {
        return false; // Blocked by a piece.
      }
    }
  }
  else {
    return false; // Not a valid rook move (must be straight-line).
  }

  // Capture logic: Do not capture your own piece.
  let targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.color === piece.color) {
    return false;
  }

  return true;
}


// ===== PAWN MOVEMENT LOGIC =====
function isValidPawnMove(piece, fromRow, fromCol, toRow, toCol) {
  let direction = piece.color === "white" ? -1 : 1;
  let startRow = piece.color === "white" ? 6 : 1;
  let targetPiece = board[toRow][toCol];
  let rowStep = toRow - fromRow;
  let colDiff = Math.abs(toCol - fromCol);

  let isForward = fromCol === toCol;
  let isSingleStep = rowStep === direction && isForward && !targetPiece;
  let isDoubleStep =
    fromRow === startRow &&
    rowStep === 2 * direction &&
    isForward &&
    !board[fromRow + direction][fromCol] &&
    !targetPiece;

  let isCapture =
    rowStep === direction &&
    colDiff === 1 &&
    targetPiece &&
    targetPiece.color !== piece.color;

  return isSingleStep || isDoubleStep || isCapture;
}


// ===== BISHOP MOVEMENT LOGIC =====
function isValidBishopMove(piece, fromRow, fromCol, toRow, toCol) {
  // Check if the move is diagonal.
  let rowDiff = Math.abs(toRow - fromRow);
  let colDiff = Math.abs(toCol - fromCol);
  
  if (rowDiff !== colDiff) {
    return false; // Bishops can only move diagonally.
  }

  // Check if the path is clear.
  let rowDirection = toRow > fromRow ? 1 : -1;
  let colDirection = toCol > fromCol ? 1 : -1;

  for (let i = 1; i < rowDiff; i++) {
    let intermediateRow = fromRow + i * rowDirection;
    let intermediateCol = fromCol + i * colDirection;

    if (board[intermediateRow][intermediateCol] !== null) {
      return false; // Blocked by a piece.
    }
  }

  // Capture logic.
  let targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.color === piece.color) {
    return false;
  }

  return true;
}


// ===== KNIGHT MOVEMENT LOGIC =====
function isValidKnightMove(piece, fromRow, fromCol, toRow, toCol) {
  let rowDiff = Math.abs(toRow - fromRow);
  let colDiff = Math.abs(toCol - fromCol);

  if (rowDiff === 2 && colDiff === 1 || rowDiff === 1 && colDiff === 2) {
    return true;
  }

  return false;
}


// ===== QUEEN MOVEMENT LOGIC =====
function isValidQueenMove(piece, fromRow, fromCol, toRow, toCol) {
  // Queen can move like a rook or bishop.
  if (fromRow === toRow || fromCol === toCol) {
    return isValidRookMove(piece, fromRow, fromCol, toRow, toCol);
  }
  if (Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol)) {
    return isValidBishopMove(piece, fromRow, fromCol, toRow, toCol);
  }
  return false;
}


// ===== KING MOVEMENT LOGIC =====
function isValidKingMove(piece, fromRow, fromCol, toRow, toCol) {
  let rowDiff = Math.abs(toRow - fromRow);
  let colDiff = Math.abs(toCol - fromCol);

  return rowDiff <= 1 && colDiff <= 1;
}


// ===== END SCREEN =====
function drawEndScreen() {
  // Use a semi-transparent overlay.
  fill(0, 0, 0, 150);
  // Important: Set rectMode to CORNER for full-window rect.
  rectMode(CORNER);
  rect(0, 0, width, height);

  // Draw the centered box for the end screen.
  fill(255);
  stroke(0);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height / 2, 400, 200, 20);

  // Winner text.
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(winner === "white" ? "#000" : "#111");
  text(`${capitalize(winner)} Wins!`, width / 2, height / 2 - 30);

  // Play Again button.
  fill(200);
  rect(width / 2, height / 2 + 50, 150, 40, 10);
  fill(0);
  textSize(20);
  text("Play Again", width / 2, height / 2 + 50);
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


function restartGame() {
  // Recalculate the board dimensions.
  calculateBoardDimensions();
  initBoard();
  gameOver = false;
  winner = null;
  currentTurn = "white";
  selectedPiece = null;
  selectedRow = -1;
  selectedCol = -1;
  loop(); // Restart the draw loop.
}


// ===== CALCULATE BOARD DIMENSIONS =====
function calculateBoardDimensions() {
  // Calculate cellSize based on window size.
  if (height > width) {
    cellSize = width / CHESSBOARD_DIMENSIONS - width / 100;
  }
  else {
    cellSize = height / CHESSBOARD_DIMENSIONS - height / 100;
  }

  // Center the board on the canvas.
  xOffset = (width - cellSize * CHESSBOARD_DIMENSIONS) / 2;
  yOffset = (height - cellSize * CHESSBOARD_DIMENSIONS) / 2;
}

function drawTurnIndicator() {
  let indicatorX = xOffset + CHESSBOARD_DIMENSIONS * cellSize + 20;
  let indicatorY = yOffset;
  let indicatorWidth = 60;
  let indicatorHeight = 60;
  
  fill(currentTurn === "white" ? 255 : 0);
  stroke(0);
  strokeWeight(1);
  rect(indicatorX, indicatorY, indicatorWidth, indicatorHeight);
  
  textSize(20);
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  text(currentTurn === "white" ? "White's turn" : "Black's turn", 
    indicatorX + indicatorWidth + 5, indicatorY);
}