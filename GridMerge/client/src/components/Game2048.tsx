import { useEffect } from "react";
import { Card } from "./ui/card";
import GameBoard from "./GameBoard";
import GameUI from "./GameUI";
import { useGame2048 } from "../hooks/useGame2048";
import { useSwipeGestures } from "../hooks/useSwipeGestures";
import { useGameSettings } from "../hooks/useGameSettings";
import { useAudio } from "../lib/stores/useAudio";

export default function Game2048() {
  const { gridSize } = useGameSettings();
  
  const {
    board,
    score,
    bestScore,
    isGameOver,
    hasWon,
    canMove,
    move,
    restart,
    continueGame,
    undo,
    canUndo
  } = useGame2048(gridSize);

  const { playHit, playSuccess } = useAudio();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver && !hasWon) return;

      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'right';
          break;
      }

      if (direction && canMove(direction)) {
        e.preventDefault();
        const moved = move(direction);
        if (moved) {
          playHit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move, canMove, isGameOver, hasWon, playHit]);

  // Handle swipe gestures
  const swipeHandlers = useSwipeGestures({
    onSwipeUp: () => canMove('up') && move('up') && playHit(),
    onSwipeDown: () => canMove('down') && move('down') && playHit(),
    onSwipeLeft: () => canMove('left') && move('left') && playHit(),
    onSwipeRight: () => canMove('right') && move('right') && playHit(),
  });

  // Play success sound when winning
  useEffect(() => {
    if (hasWon) {
      playSuccess();
    }
  }, [hasWon, playSuccess]);

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">2048</h1>
        <p className="text-gray-600 text-sm">
          Join numbers to get the <strong>2048 tile!</strong>
        </p>
      </div>

      <GameUI
        score={score}
        bestScore={bestScore}
        onRestart={restart}
        onUndo={undo}
        canUndo={canUndo}
      />

      <Card className="p-4 bg-amber-100 border-amber-300">
        <div {...swipeHandlers} className="touch-none select-none">
          <GameBoard board={board} gridSize={gridSize} />
        </div>
      </Card>

      <div className="text-center text-sm text-gray-600 max-w-xs">
        <p><strong>HOW TO PLAY:</strong> Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach 2048!</p>
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="p-6 text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {hasWon ? "You Win!" : "Game Over!"}
            </h2>
            <p className="text-gray-600 mb-6">
              {hasWon 
                ? "Congratulations! You reached 2048!" 
                : "No more moves available!"}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={restart}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                Try Again
              </button>
              {hasWon && (
                <button
                  onClick={continueGame}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Continue
                </button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
