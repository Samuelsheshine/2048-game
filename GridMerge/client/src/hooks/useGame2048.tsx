import { useState, useCallback, useEffect } from "react";
import {
  GameBoard,
  GridSize,
  initializeBoard,
  addRandomTile,
  moveBoard,
  canMoveInDirection,
  isGameOver as checkGameOver,
  hasWon as checkHasWon
} from "../lib/game2048Logic";
import { getLocalStorage, setLocalStorage } from "../lib/utils";

const BEST_SCORE_KEY = "game2048_best_score";

interface GameState {
  board: GameBoard;
  score: number;
}

export function useGame2048(gridSize: GridSize = 4) {
  const [board, setBoard] = useState<GameBoard>(() => {
    const initial = initializeBoard(gridSize);
    addRandomTile(initial);
    addRandomTile(initial);
    return initial;
  });
  
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => 
    getLocalStorage(BEST_SCORE_KEY) || 0
  );
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [previousState, setPreviousState] = useState<GameState | null>(null);

  // Update best score in localStorage
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      setLocalStorage(BEST_SCORE_KEY, score);
    }
  }, [score, bestScore]);

  // Check game state
  useEffect(() => {
    const won = checkHasWon(board);
    const over = checkGameOver(board);
    
    if (won && !hasWon && !gameEnded) {
      setHasWon(true);
      setIsGameOver(true);
    } else if (over && !isGameOver) {
      setIsGameOver(true);
    }
  }, [board, hasWon, isGameOver, gameEnded]);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (isGameOver && !hasWon) return false;

    const result = moveBoard(board, direction);
    if (result.moved) {
      // Save current state before making the move
      setPreviousState({ board: [...board.map(row => [...row])], score });
      
      const newBoard = [...result.board];
      addRandomTile(newBoard);
      
      setBoard(newBoard);
      setScore(prev => prev + result.scoreGained);
      return true;
    }
    return false;
  }, [board, score, isGameOver, hasWon]);

  const canMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    return canMoveInDirection(board, direction);
  }, [board]);

  const undo = useCallback(() => {
    if (previousState) {
      setBoard(previousState.board);
      setScore(previousState.score);
      setPreviousState(null);
      // Reset game over/won states if undoing
      setIsGameOver(false);
      setHasWon(false);
    }
  }, [previousState]);

  const canUndo = previousState !== null;

  const restart = useCallback(() => {
    const newBoard = initializeBoard(gridSize);
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    
    setBoard(newBoard);
    setScore(0);
    setIsGameOver(false);
    setHasWon(false);
    setGameEnded(false);
    setPreviousState(null);
  }, [gridSize]);

  const continueGame = useCallback(() => {
    setIsGameOver(false);
    setGameEnded(true);
  }, []);

  // Reset game when grid size changes
  useEffect(() => {
    restart();
  }, [gridSize, restart]);

  return {
    board,
    score,
    bestScore,
    isGameOver,
    hasWon,
    move,
    canMove,
    restart,
    continueGame,
    gridSize,
    undo,
    canUndo
  };
}
