// chess-ish game
//capture the enemy king to win
//
// Ranu Jayawickrama
// March 26th
//
// Extra for Experts:
// used object properties (ie. type:"something", colour:"green")
// used forEach to iterate through and load chess pieces to the initial board
// used object destructuring
//  using alerts

// Board elements
const CHESSBOARD_DIMENSIONS = 8; // 8x8 chess board
let cellSize;                     
let board = [];                  
let xOffset, yOffset;// offsets for centering the board
let pieceMoveSound;//sound effect when chess piece moves

// chess pieces
// white chess pieces
let whitePieces = { 
  pawn: null,
  rook: null, 
  knight: null, 
  bishop: null, 
  queen: null, 
  king: null 
};

// Black chess pieces
let blackPieces = { 
  pawn: null, 
  rook: null, 
  knight: null, 
  bishop: null, 
  queen: null, 
  king: null 
};

// Selection variables
let selectedPiece = null;
let selectedRow = -1;
let selectedCol = -1;
let selectedPieceScale = 1.25;//to increase piece size when selected
let defaultPieceScale = 1;// normal piece size

let currentTurn = "white";// to track which player's turn it is
let gameOver = false;// to check game state       
let winner = null;// to check winner  
let showInstructions = true;//instructions promt          

//load all the chess pieces
function preload() {
  // Load white pieces
  whitePieces.pawn = loadImage("chess-pawn-white.png");
  whitePieces.rook = loadImage("chess-rook-white.png");
  whitePieces.knight = loadImage("chess-knight-white.png");
  whitePieces.bishop = loadImage("chess-bishop-white.png");
  whitePieces.queen = loadImage("chess-queen-white.png");
  whitePieces.king = loadImage("chess-king-white.png");

  // Load black pieces
  blackPieces.pawn = loadImage("chess-pawn-black.png");
  blackPieces.rook = loadImage("chess-rook-black.png");
  blackPieces.knight = loadImage("chess-knight-black.png");
  blackPieces.bishop = loadImage("chess-bishop-black.png");
  blackPieces.queen = loadImage("chess-queen-black.png");
  blackPieces.king = loadImage("chess-king-black.png");

  pieceMoveSound= loadSound("ChessMoveSound.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateBoardDimensions(); // Calculate initial board dimensions
  initialBoard(); // Set up starting piece positions
}

function draw() {
  background("cyan");
  
  //show instructions at the start
  if (showInstructions) {
    drawInstructions();
    return;
  }

  // display chess board, pieces and the indicator of what player's turn
  drawBoard();
  drawPieces();
  displayPlayerTurn();
  
  // display outro screen
  if (gameOver) {
    drawEndScreen();
    noLoop(); // Stop animation when game ends
  }
}


function initialBoard() {

  // draw empty chess board
  board = [];
  for (let y = 0; y < CHESSBOARD_DIMENSIONS; y++) {
    let row = [];
    for (let x = 0; x < CHESSBOARD_DIMENSIONS; x++) {
      row.push(null);
    }
    board.push(row);
  }

  // Set up pawns
  for (let i = 0; i < CHESSBOARD_DIMENSIONS; i++) {
    board[1][i] = { type: "pawn", color: "black" }; // Black pawns
    board[6][i] = { type: "pawn", color: "white" }; // White pawns
  }

  // Set up other pieces
  const PIECE_ORDER = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
  
  // Black back row
  PIECE_ORDER.forEach((type, col) => {
    board[0][col] = { type, color: "black" };
  });
  
  // White back row
  PIECE_ORDER.forEach((type, col) => {
    board[7][col] = { type, color: "white" };
  });
}


function drawBoard() {
  rectMode(CORNER); // Draw from top-left corner
  stroke(0);//boarders for the chess squares
  strokeWeight(1);
  
  for (let row = 0; row < CHESSBOARD_DIMENSIONS; row++) {
    for (let col = 0; col < CHESSBOARD_DIMENSIONS; col++) {
      fill((row + col) % 2 === 0 ? 240 : "lightgreen");// draw white and black squares alternately
      rect(xOffset + col * cellSize, yOffset + row * cellSize, cellSize, cellSize);//offset used to center the chess board
    }
  }
}

// draw the pieces on the chess board in their relative square
function drawPieces() {
  for (let row = 0; row < CHESSBOARD_DIMENSIONS; row++) {
    for (let col = 0; col < CHESSBOARD_DIMENSIONS; col++) {
      const PIECE = board[row][col];
      if (PIECE) {
        const X_COR = xOffset + col * cellSize;
        const Y_COR = yOffset + row * cellSize;
        displayPiece(PIECE, X_COR, Y_COR, row, col);
      }
    }
  }
}

// Draws an individual piece and increases the size of a piece when selected
function displayPiece(piece, x, y, row, col) {
  const IMG = piece.color === "white" ? whitePieces[piece.type] : blackPieces[piece.type];
  
  // setting up constants to change the size of the piece if selected 
  const IS_SELECTED = selectedPiece && selectedRow === row && selectedCol === col;
  const SCALE_OF_PIECES = IS_SELECTED ? selectedPieceScale : defaultPieceScale;
  const IMG_SIZE = cellSize * SCALE_OF_PIECES;
  
  // setting up constants to center the piece in its square
  const CENTER_PIECE_X = x + cellSize / 2 - IMG_SIZE / 2;
  const CENTER_PIECE_Y = y + cellSize / 2 - IMG_SIZE / 2;
  image(IMG, CENTER_PIECE_X, CENTER_PIECE_Y, IMG_SIZE, IMG_SIZE);// center and scale piece
}


// Draws  indicator showing which player's turn it is
function displayPlayerTurn() {

  // setting up indicator size and position 
  const INDICATOR_X = xOffset + CHESSBOARD_DIMENSIONS * cellSize + 20;// 20 pixels Space
  const INDICATOR_Y = yOffset;
  const INDICATOR_SIZE = 60;
  
  // Draw colored square indicating current turn
  fill(currentTurn === "white" ? 255 : 0);
  stroke(0);
  strokeWeight(1);
  rect(INDICATOR_X, INDICATOR_Y, INDICATOR_SIZE, INDICATOR_SIZE);
  
  // display who's turn
  textSize(20);
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  text(`${currentTurn === "white" ? "White" : "Black"}'s turn`, 
    INDICATOR_X + INDICATOR_SIZE + 10, INDICATOR_Y);
}

// Handles mouse clicks for piece selection and movement
function mousePressed() {

  // if the game finsihed, display new chess board
  if (gameOver) {
    checkRestartClick();
    return;
  }

  //if the piece is moved inside the board cordinates
  const { row, col } = getClickedCell();
  if (!isValidCell(row, col)) {
    return;
  }

  const CLICKED_PIECE = board[row][col];//loacation of the clicked piece

  // If a piece is already selected, try to move it to the clicked square
  if (selectedPiece) {
    handlePieceMovement(CLICKED_PIECE, row, col);
  }

  // or if a piece was clicked and it's that player's turn, select it
  else if (CLICKED_PIECE && CLICKED_PIECE.color === currentTurn) {
    selectPiece(CLICKED_PIECE, row, col);
  }
}

// Gets the board coordinates of a mouse click
function getClickedCell() {
  return {
    row: floor((mouseY - yOffset) / cellSize),
    col: floor((mouseX - xOffset) / cellSize)
  };
}

// Checks if board coordinates are valid
function isValidCell(row, col) {
  return row >= 0 && row < CHESSBOARD_DIMENSIONS && 
         col >= 0 && col < CHESSBOARD_DIMENSIONS;
}

// Selects a piece for movement
function selectPiece(piece, row, col) {
  selectedPiece = piece;
  selectedRow = row;
  selectedCol = col;
}

// to move a selected piece
function handlePieceMovement(clickedPiece, row, col) {
  // to move a different piece after clicking on another one if clicking same color piece
  if (clickedPiece && clickedPiece.color === selectedPiece.color) {
    selectPiece(clickedPiece, row, col);
    return;
  }

  // if the move is valid, execute move
  const IS_MOVE_VALID = isTheMoveValid(selectedPiece.type);
  if (IS_MOVE_VALID?.(selectedPiece, selectedRow, selectedCol, row, col)) {
    executeMove(row, col);
    pieceMoveSound.play();
    switchTurn();// switch the turn to the other player
  }
}

// check if the move is valid for each type of piece
function isTheMoveValid(pieceType) {
  const MOVEMENT_ANALYSES = {
    pawn: isValidPawnMove,
    rook: isValidRookMove,
    knight: isValidKnightMove,
    bishop: isValidBishopMove,
    queen: isValidQueenMove,
    king: isValidKingMove
  };
  return MOVEMENT_ANALYSES[pieceType];
}

// Executes a move and checks for game end
function executeMove(row, col) {
  const TARGET_PIECE = board[row][col];
  
  // Check if the king got captured (game over)
  if (TARGET_PIECE?.type === "king") {
    gameOver = true;
    winner = selectedPiece.color;
  }

  // Move the piece
  board[row][col] = selectedPiece;
  board[selectedRow][selectedCol] = null;
  
  // Clear selection
  selectedPiece = null;
  selectedRow = -1;
  selectedCol = -1;
}

// Switches turn to the other player
function switchTurn() {
  currentTurn = currentTurn === "white" ? "black" : "white";
}

// movement of pieces
// Each if the rook is moved correcty 
function isValidRookMove(piece, fromRow, fromCol, toRow, toCol) {
  // if rook not moving straight, not valid move
  if (fromRow !== toRow && fromCol !== toCol) {
    return false;
  }
  
  //gets the direction of the movement
  const ROOK_DIRECTION = fromRow === toRow ? 
    { row: 0, col: toCol > fromCol ? 1 : -1 } : 
    { row: toRow > fromRow ? 1 : -1, col: 0 };
  
  // Check if the path is clear
  let rows = fromRow + ROOK_DIRECTION.row;
  let columns = fromCol + ROOK_DIRECTION.col;
  while (rows !== toRow || columns !== toCol) {
    if (board[rows][columns] !== null) {
      return false;
    }
    rows += ROOK_DIRECTION.row;
    columns += ROOK_DIRECTION.col;
  }
  
  // Check target square
  const TARGET = board[toRow][toCol];
  return !TARGET || TARGET.color !== piece.color;
}

// Each if the pawn is moved correcty 
function isValidPawnMove(piece, fromRow, fromCol, toRow, toCol) {
  const PAWN_DIRECTION = piece.color === "white" ? -1 : 1;//direction
  const START_ROW = piece.color === "white" ? 6 : 1;//To move white pawns or black pawns
  const TARGET = board[toRow][toCol];// target location
  const ROW_DIFFERENCE = toRow - fromRow;
  const COL_DIFFERENCE = Math.abs(toCol - fromCol);

  // Forward moves
  if (fromCol === toCol) {
    // Single step forward
    if (ROW_DIFFERENCE === PAWN_DIRECTION && !TARGET) {
      return true;
    }

    // Double step from start position
    if (fromRow === START_ROW && ROW_DIFFERENCE === 2 * PAWN_DIRECTION && 
        !board[fromRow + PAWN_DIRECTION][fromCol] && !TARGET) {
      return true;
    }
  } 

  // Captures
  else if (COL_DIFFERENCE === 1 && ROW_DIFFERENCE === PAWN_DIRECTION && 
           TARGET && TARGET.color !== piece.color) {
    return true;
  }

  return false;
}

// check if the bishop is moved correctly
function isValidBishopMove(piece, fromRow, fromCol, toRow, toCol) {
  const ROW_DIFFERENCE = Math.abs(toRow - fromRow);
  if (ROW_DIFFERENCE !== Math.abs(toCol - fromCol)) {
    return false;
  } // Not diagonal

  // movement direction
  const ROW_DIRECTION = toRow > fromRow ? 1 : -1;
  const COL_DIRECTION = toCol > fromCol ? 1 : -1;

  // Check path is clear
  for (let i = 1; i < ROW_DIFFERENCE; i++) {
    if (board[fromRow + i * ROW_DIRECTION][fromCol + i * COL_DIRECTION] !== null) {
      return false;
    }
  }

  // Check target square
  const TARGET = board[toRow][toCol];
  return !TARGET || TARGET.color !== piece.color;
}

// does the knight move correcty
function isValidKnightMove(piece, fromRow, fromCol, toRow, toCol) {
  const ROW_DIFFERENCE = Math.abs(toRow - fromRow);
  const COL_DIFFERNCE = Math.abs(toCol - fromCol);
  return ROW_DIFFERENCE === 2 && COL_DIFFERNCE === 1 || ROW_DIFFERENCE === 1 && COL_DIFFERNCE === 2;//movement pattern
}

// does the queen move correcty
function isValidQueenMove(piece, fromRow, fromCol, toRow, toCol) {
  // Queen combines rook and bishop movement
  return isValidRookMove(piece, fromRow, fromCol, toRow, toCol) || 
         isValidBishopMove(piece, fromRow, fromCol, toRow, toCol);
}

// is king moved correctly
function isValidKingMove(piece, fromRow, fromCol, toRow, toCol) {
  const ROW_DIFFERENCE = Math.abs(toRow - fromRow);
  const COL_DIFFERENCE = Math.abs(toCol - fromCol);
  return ROW_DIFFERENCE <= 1 && COL_DIFFERENCE <= 1;
}

//  Draws the game over screen
function drawEndScreen() {
  // mild transparency overlay to blur background
  fill(0, 0, 0, 150);
  rectMode(CORNER);
  rect(0, 0, width, height);

  // End game message box
  fill(255);
  stroke(0);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height / 2, 400, 200, 20);

  // Winner text
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(winner === "white" ? "#000" : "#111");
  text(`${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`, 
    width / 2, height / 2 - 30);

  // Restart button
  fill(200);
  rect(width / 2, height / 2 + 50, 150, 40, 10);
  fill(0);
  textSize(20);
  text("Play Again", width / 2, height / 2 + 50);

  // Show popup
  setTimeout(() => {
    alert(`${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`);
  }, 100);
}



// Checks if restart button was clicked
function checkRestartClick() {
  const BUTTON_X = width / 2;
  const BUTTON_Y = height / 2 + 50;
  const BUTTON_WIDTH = 150;
  const BUTTON_HEIGHT = 40;

  // if so, restart game
  if (mouseX > BUTTON_X - BUTTON_WIDTH/2 && mouseX < BUTTON_X + BUTTON_WIDTH/2 &&
      mouseY > BUTTON_Y - BUTTON_HEIGHT/2 && mouseY < BUTTON_Y + BUTTON_HEIGHT/2) {
    restartGame();
  }
}

// Resets the elements to initial state
function restartGame() {
  calculateBoardDimensions();
  initialBoard();
  gameOver = false;
  winner = null;
  currentTurn = "white";
  selectedPiece = null;
  selectedRow = -1;
  selectedCol = -1;
  loop(); // Restart animation
}

// Calculates board dimensions based on window size
function calculateBoardDimensions() {
  // Size board based on smaller size
  const MINI_DIMENSIONS = min(width, height);
  cellSize = MINI_DIMENSIONS / CHESSBOARD_DIMENSIONS * 0.9; // 90% of available space
  
  // Center the board
  xOffset = (width - cellSize * CHESSBOARD_DIMENSIONS) / 2;
  yOffset = (height - cellSize * CHESSBOARD_DIMENSIONS) / 2;
}

function drawInstructions() {
  // mild transparent overlay to blur background
  fill(0, 0, 0, 200);
  rectMode(CORNER);
  rect(0, 0, width, height);
  
  // Instruction box
  fill(255);
  stroke(0);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width/2, height/2, 600, 400, 20);
  
  // Instruction text
  textAlign(CENTER, CENTER);
  fill(0);
  noStroke();
  textSize(28);
  text("Chess Game Instructions", width/2, height/2 - 120);
  
  textSize(18);
  text("Click on your piece to select it\nThen according to basic chess movement patterns, move it\n\nCapture the enemy king to win\n\nPress any key to begin", 
    width/2, height/2);
}

// exit show instructions after any key is pressed
function keyPressed() {
  if (showInstructions) {
    showInstructions = false;
  }
}