
const GRID_DIMENSIONS = 6;
let cellSize;
let mainGrid = [];
let xOffset, yOffset;
let dragPath = [];
let dragColor = null;
let isDragging = false;


let completedPaths = []; // Stores valid finished paths

let whatPhase = "starting phase";

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGridDimensions();
  generateDotPairs();      // ← place your dots
  generatePuzzle();        // ← connect them automatically
}

function draw() {
  // for now im gonna switch in here because the starting screen is not done yet
  if (whatPhase === "starting phase"){ 
    background(20, 50, 100);
    drawGrid();
    drawDots();
    drawCompletedPaths();
    drawDragPath();
  }
  else if (whatPhase === "connect phase"){
    startScreen();
  }

}
const dots = ["red", "green", "blue"];


function calculateGridDimensions() {
  const MINI_DIMENSIONS = min(width, height);
  cellSize = MINI_DIMENSIONS / GRID_DIMENSIONS * 0.9;
  xOffset = (width - cellSize * GRID_DIMENSIONS) / 2;
  yOffset = (height - cellSize * GRID_DIMENSIONS) / 2;
}

// Deterministic dot placement (6×6 grid, 6 colors)
function generateDotPairs() {
  // 1) Reset grid
  mainGrid = [];
  for (let r = 0; r < GRID_DIMENSIONS; r++) {
    mainGrid.push(new Array(GRID_DIMENSIONS).fill(null));
  }

  // 2) Hard-coded dot pairs (tweak these coords as you like)
  const pairs = [
    { color: "red",    pos: [{ row: 0, col: 0 }, { row: 0, col: 5 }] },
    { color: "green",  pos: [{ row: 5, col: 0 }, { row: 5, col: 5 }] },
    { color: "blue",   pos: [{ row: 2, col: 2 }, { row: 3, col: 3 }] }
  ];

  // 3) Apply them to mainGrid
  for (let { color, pos } of pairs) {
    for (let { row, col } of pos) {
      mainGrid[row][col] = color;
    }
  }

  // Clear any old paths
  completedPaths = [];
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
  strokeWeight(20);
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
    strokeWeight(20);
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
  // clear intersecting cells
  for (let i = 1; i < pathObj.path.length - 1; i++) {
    const c = pathObj.path[i];
    mainGrid[c.row][c.col] = null;
  }
  const idx = completedPaths.indexOf(pathObj);
  if (idx !== -1) {
    completedPaths.splice(idx, 1);
  }
}

function generatePuzzle() {
  completedPaths = [];
  // Clear all non-dot cells
  for (let r = 0; r < GRID_DIMENSIONS; r++) {
    for (let c = 0; c < GRID_DIMENSIONS; c++) {
      if (!dots.includes(mainGrid[r][c])) {
        mainGrid[r][c] = null;
      }
    }
  }

  if (backtrackPaths(0)) {
    console.log("Puzzle generated successfully!");
  } else {
    console.log("Failed to generate puzzle.");
  }
}

function backtrackPaths(colorIndex) {
  if (colorIndex >= dots.length) {
    return true; // all colors connected
  }

  const color = dots[colorIndex];
  const start = findDot(color, true);
  const end = findDot(color, false);

  let path = [];
  let visited = createEmptyGrid(false);

  function dfs(r, c) {
    if (r === end.row && c === end.col) {
      path.push({ row: r, col: c });
      return true;
    }
    visited[r][c] = true;
    path.push({ row: r, col: c });

    for (let n of getNeighbors(r, c)) {
      if (!visited[n.row][n.col] && canUseCell(n.row, n.col, color)) {
        if (dfs(n.row, n.col)) {
          return true;
        }
      }
    }

    path.pop();
    visited[r][c] = false;
    return false;
  }

  if (dfs(start.row, start.col)) {
    // Mark path in grid (excluding dots)
    for (let p of path) {
      if ((p.row !== start.row || p.col !== start.col) && (p.row !== end.row || p.col !== end.col)) {
        mainGrid[p.row][p.col] = color;
      }
    }
    completedPaths.push({ color, path: [...path] });

    if (backtrackPaths(colorIndex + 1)) {
      return true;
    }

    // Backtrack
    for (let p of path) {
      if ((p.row !== start.row || p.col !== start.col) && (p.row !== end.row || p.col !== end.col)) {
        mainGrid[p.row][p.col] = null;
      }
    }
    completedPaths.pop();
  }
  return false;
}


function findDot(color, first) {
  let foundDots = [];
  for (let r = 0; r < GRID_DIMENSIONS; r++) {
    for (let c = 0; c < GRID_DIMENSIONS; c++) {
      if (mainGrid[r][c] === color) {
        foundDots.push({ row: r, col: c });
        if (foundDots.length === 2) {
          return first ? foundDots[0] : foundDots[1];
        }
      }
    }
  }
  // If only one dot or none found, return what was found
  if (foundDots.length > 0) {
    return first ? foundDots[0] : null;
  }
  return null;
}

function getNeighbors(r, c) {
  const neighbors = [];
  if (r > 0) {
    neighbors.push({ row: r - 1, col: c });
  }
  if (r < GRID_DIMENSIONS - 1) {
    neighbors.push({ row: r + 1, col: c });
  }
  if (c > 0) {
    neighbors.push({ row: r, col: c - 1 });
  }
  if (c < GRID_DIMENSIONS - 1) {
    neighbors.push({ row: r, col: c + 1 });
  }
  return neighbors;
}

function canUseCell(r, c, color) {
  const cell = mainGrid[r][c];
  return cell === null || cell === color;
}


function createEmptyGrid(val) {
  const grid = [];
  for (let i = 0; i < GRID_DIMENSIONS; i++) {
    grid.push(new Array(GRID_DIMENSIONS).fill(val));
  }
  return grid;
}

////////////////////////////////////////////////////////////////////////

