import React from 'react';
import { Square } from './Square';
import type { SquareValue, GameMode } from '../types/game';

interface BoardProps {
  squares: SquareValue[];
  gridSize: number;
  gameMode: GameMode;
  winningLine: number[] | null;
  winner: string | null;
  onSquareClick: (i: number) => void;
  getPieceLife: (i: number) => { rank: number; total: number } | null;
}

export const Board: React.FC<BoardProps> = ({
  squares,
  gridSize,
  gameMode,
  winningLine,
  winner,
  onSquareClick,
  getPieceLife
}) => {
  // サイズごとのスタイルクラス
  const getCellSizeClass = () => {
    if (gridSize >= 6) return 'h-10 w-10 sm:h-12 sm:w-12 text-xl';
    if (gridSize === 5) return 'h-12 w-12 sm:h-14 sm:w-14 text-2xl';
    if (gridSize === 4) return 'h-16 w-16 sm:h-20 sm:w-20 text-3xl';
    return 'h-20 w-20 sm:h-24 sm:w-24 text-4xl';
  };

  const calculateGhostInfo = (i: number, squareValue: SquareValue) => {
    if (gameMode !== 'ghost' || !squareValue || winner) return null;

    const life = getPieceLife(i);
    if (!life) return null;

    const isFull = life.total >= gridSize;
    const isDying = isFull && life.rank === 0;

    const minOpacity = 0.3;
    const ratio = life.total > 1 ? life.rank / (life.total - 1) : 1;
    const opacity = minOpacity + (1 - minOpacity) * ratio;

    return {
      opacity,
      scale: isDying ? 0.9 : 1,
      isDying
    };
  };

  return (
    <div className={`
      relative bg-white p-4 sm:p-6 rounded-2xl shadow-xl border-2 transition-colors duration-500
      ${gameMode === 'ghost' ? 'border-purple-200 shadow-purple-100' : 'border-slate-100'}
    `}>
      <div 
        className="grid gap-2 sm:gap-3"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` 
        }}
      >
        {squares.map((square, i) => {
          const isWinningSquare = winningLine?.includes(i) ?? false;
          // すでに埋まっているマスはクリック不可 (Ghostモードでも)
          const disabled = !!winner || !!square;

          return (
            <Square
              key={i}
              value={square}
              onClick={() => onSquareClick(i)}
              isWinningSquare={isWinningSquare}
              gameMode={gameMode}
              disabled={disabled}
              sizeClass={getCellSizeClass()}
              ghostInfo={calculateGhostInfo(i, square)}
            />
          );
        })}
      </div>
    </div>
  );
};
