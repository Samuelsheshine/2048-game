import { GameBoard as GameBoardType, GridSize } from "../lib/game2048Logic";
import Tile from "./Tile";

interface GameBoardProps {
  board: GameBoardType;
  gridSize?: GridSize;
}

export default function GameBoard({ board, gridSize }: GameBoardProps) {
  const actualGridSize: GridSize = (gridSize || board.length) as GridSize;
  const gridColsClass = {
    3: 'grid-cols-3',
    4: 'grid-cols-4', 
    5: 'grid-cols-5'
  }[actualGridSize] || 'grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-2 p-2 bg-amber-200 rounded-lg`}>
      {board.map((row: number[], rowIndex: number) =>
        row.map((value: number, colIndex: number) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            value={value}
            position={{ row: rowIndex, col: colIndex }}
            gridSize={actualGridSize}
          />
        ))
      )}
    </div>
  );
}
