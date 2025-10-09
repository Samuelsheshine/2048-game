import { useState, useCallback, useEffect } from 'react';
import { GridSize } from '../lib/game2048Logic';
import { getLocalStorage, setLocalStorage } from '../lib/utils';

const GRID_SIZE_KEY = 'game2048_grid_size';

export function useGameSettings() {
  const [gridSize, setGridSize] = useState<GridSize>(() => {
    const saved = getLocalStorage(GRID_SIZE_KEY);
    const parsedSize = Number(saved);
    // Validate and ensure we only accept valid grid sizes
    if (parsedSize === 3 || parsedSize === 4 || parsedSize === 5) {
      return parsedSize as GridSize;
    }
    return 4; // Default to 4x4
  });

  // Save grid size to localStorage when it changes
  useEffect(() => {
    setLocalStorage(GRID_SIZE_KEY, gridSize);
  }, [gridSize]);

  const changeGridSize = useCallback((newSize: GridSize) => {
    // Validate input
    if (newSize === 3 || newSize === 4 || newSize === 5) {
      setGridSize(newSize);
    }
  }, []);

  return {
    gridSize,
    changeGridSize
  };
}