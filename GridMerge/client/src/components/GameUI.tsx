import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { RotateCcw, Undo2 } from "lucide-react";

interface GameUIProps {
  score: number;
  bestScore: number;
  onRestart: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export default function GameUI({ score, bestScore, onRestart, onUndo, canUndo }: GameUIProps) {
  return (
    <div className="flex items-center gap-4 w-full justify-between">
      <div className="flex gap-2">
        <Card className="px-3 py-2 text-center min-w-20">
          <div className="text-xs text-gray-500 uppercase font-semibold">Score</div>
          <div className="text-lg font-bold text-amber-700">{score.toLocaleString()}</div>
        </Card>
        <Card className="px-3 py-2 text-center min-w-20">
          <div className="text-xs text-gray-500 uppercase font-semibold">Best</div>
          <div className="text-lg font-bold text-green-700">{bestScore.toLocaleString()}</div>
        </Card>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700 border-blue-600 disabled:bg-gray-400 disabled:border-gray-400 disabled:hover:bg-gray-400"
        >
          <Undo2 size={14} />
          Undo
        </Button>
        <Button
          onClick={onRestart}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 bg-amber-600 text-white hover:bg-amber-700 border-amber-600"
        >
          <RotateCcw size={14} />
          Restart
        </Button>
      </div>
    </div>
  );
}
