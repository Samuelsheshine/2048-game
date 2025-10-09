interface TileProps {
  value: number;
  position: { row: number; col: number };
  gridSize?: number;
}

export default function Tile({ value, gridSize = 4 }: TileProps) {
  const getTileStyles = (value: number, gridSize: number) => {
    // Adjust tile size based on grid size
    const sizeClasses = {
      3: "w-20 h-20 sm:w-24 sm:h-24",
      4: "w-16 h-16 sm:w-20 sm:h-20", 
      5: "w-12 h-12 sm:w-16 sm:h-16"
    }[gridSize] || "w-16 h-16 sm:w-20 sm:h-20";
    
    const baseClasses = `${sizeClasses} rounded flex items-center justify-center font-bold text-lg transition-all duration-150`;
    
    if (value === 0) {
      return `${baseClasses} bg-amber-50 text-transparent`;
    }

    const styleMap: { [key: number]: string } = {
      2: "bg-slate-100 text-gray-700",
      4: "bg-slate-200 text-gray-700",
      8: "bg-orange-200 text-white",
      16: "bg-orange-300 text-white",
      32: "bg-orange-400 text-white",
      64: "bg-orange-500 text-white",
      128: "bg-yellow-400 text-white text-base",
      256: "bg-yellow-500 text-white text-base",
      512: "bg-yellow-600 text-white text-base",
      1024: "bg-red-400 text-white text-sm",
      2048: "bg-red-500 text-white text-sm animate-pulse",
    };

    return `${baseClasses} ${styleMap[value] || "bg-purple-500 text-white text-xs"}`;
  };

  return (
    <div className={getTileStyles(value, gridSize)}>
      {value > 0 && (
        <span className="drop-shadow-sm">
          {value}
        </span>
      )}
    </div>
  );
}
