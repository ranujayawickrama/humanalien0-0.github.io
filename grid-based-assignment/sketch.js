// March 28th

// extras for experts - multiplayer, popup screen
// april 5 -- reasearching about p5 party and multiplayer
// april 2 -- reasearching about p5 party and multiplayer
// april 4 -- researching about movement of chess pieces


let cellSize;
const CHESSBOARD_DIMENSIONS = 8;
let grid;

// let blackPawn, blackRook, blackKnight, blackBishop, blackQueen, blackKing;// white chess pieces
// let whitePawn, whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing;// white chess pieces
let whitePieces = {
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
};

let blackPieces = {
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
};

function preload(){
  whitePieces.pawn = loadImage("WPawn.png");
  whitePieces.rook = loadImage("WRook.png");
  whitePieces.knight = loadImage("WKnight.png");
  whitePieces.bishop = loadImage("WBishop.png");
  whitePieces.queen = loadImage("WQueen.png");
  whitePieces.king = loadImage("WKing.png");
 
  blackPieces.pawn = loadImage("BPawn.png");
  blackPieces.rook = loadImage("BRook.png");
  blackPieces.knight = loadImage("BKnight.png");
  blackPieces.bishop = loadImage("BBishop.png");
  blackPieces.queen = loadImage("BQueen.png");
  blackPieces.king = loadImage("BKing.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //make the largest square that fits
  if (height > width) {
    cellSize = width / CHESSBOARD_DIMENSIONS - width*0.2;
  }
  else {
    cellSize = height / CHESSBOARD_DIMENSIONS- height*0.02;
  }
  console.log(width, height);//1592, 774

  grid = generateChessBoard(CHESSBOARD_DIMENSIONS, CHESSBOARD_DIMENSIONS);
}

function draw() {
  background(255);
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