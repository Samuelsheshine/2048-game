export type GameBoard = number[][];

export type GridSize = 3 | 4 | 5;

export function initializeBoard(gridSize: GridSize = 4): GameBoard {
  return Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
}

export function addRandomTile(board: GameBoard): void {
  const emptyCells: { row: number; col: number }[] = [];
  const gridSize = board.length;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (board[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  
  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    board[randomCell.row][randomCell.col] = value;
  }
}

export function moveLeft(row: number[]): { row: number[]; scoreGained: number; moved: boolean } {
  const originalRowLength = row.length;
  const newRow = row.filter(val => val !== 0);
  let scoreGained = 0;
  let moved = false;
  
  // Check if tiles moved due to sliding
  const originalNonZero = row.filter(val => val !== 0);
  if (JSON.stringify(newRow) !== JSON.stringify(originalNonZero)) {
    moved = true;
  }
  
  // Merge adjacent identical numbers
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      scoreGained += newRow[i];
      newRow[i + 1] = 0;
      moved = true;
    }
  }
  
  // Remove zeros created by merging and pad with zeros
  const finalRow = newRow.filter(val => val !== 0);
  while (finalRow.length < originalRowLength) {
    finalRow.push(0);
  }
  
  // Check if anything changed
  if (JSON.stringify(finalRow) !== JSON.stringify(row)) {
    moved = true;
  }
  
  return { row: finalRow, scoreGained, moved };
}

export function moveRight(row: number[]): { row: number[]; scoreGained: number; moved: boolean } {
  const reversed = [...row].reverse();
  const result = moveLeft(reversed);
  return {
    row: result.row.reverse(),
    scoreGained: result.scoreGained,
    moved: result.moved
  };
}

export function transposeBoard(board: GameBoard): GameBoard {
  return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
}

export function moveBoard(
  board: GameBoard, 
  direction: 'up' | 'down' | 'left' | 'right'
): { board: GameBoard; scoreGained: number; moved: boolean } {
  let newBoard: GameBoard;
  let totalScore = 0;
  let anyMoved = false;
  
  switch (direction) {
    case 'left':
      newBoard = board.map(row => {
        const result = moveLeft(row);
        totalScore += result.scoreGained;
        if (result.moved) anyMoved = true;
        return result.row;
      });
      break;
      
    case 'right':
      newBoard = board.map(row => {
        const result = moveRight(row);
        totalScore += result.scoreGained;
        if (result.moved) anyMoved = true;
        return result.row;
      });
      break;
      
    case 'up':
      const transposedUp = transposeBoard(board);
      const movedUp = transposedUp.map(row => {
        const result = moveLeft(row);
        totalScore += result.scoreGained;
        if (result.moved) anyMoved = true;
        return result.row;
      });
      newBoard = transposeBoard(movedUp);
      break;
      
    case 'down':
      const transposedDown = transposeBoard(board);
      const movedDown = transposedDown.map(row => {
        const result = moveRight(row);
        totalScore += result.scoreGained;
        if (result.moved) anyMoved = true;
        return result.row;
      });
      newBoard = transposeBoard(movedDown);
      break;
      
    default:
      return { board, scoreGained: 0, moved: false };
  }
  
  return { board: newBoard, scoreGained: totalScore, moved: anyMoved };
}

export function canMoveInDirection(board: GameBoard, direction: 'up' | 'down' | 'left' | 'right'): boolean {
  const result = moveBoard(board, direction);
  return result.moved;
}

export function isGameOver(board: GameBoard): boolean {
  const gridSize = board.length;
  
  // Check for empty cells
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (board[row][col] === 0) {
        return false;
      }
    }
  }
  
  // Check for possible merges
  return !(
    canMoveInDirection(board, 'up') ||
    canMoveInDirection(board, 'down') ||
    canMoveInDirection(board, 'left') ||
    canMoveInDirection(board, 'right')
  );
}

export function hasWon(board: GameBoard): boolean {
  const gridSize = board.length;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (board[row][col] === 2048) {
        return true;
      }
    }
  }
  return false;
}
