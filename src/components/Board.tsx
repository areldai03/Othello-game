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
  xIsNext: boolean;
  getPieceLife: (index: number) => { rank: number; total: number } | null;
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
    if (gridSize >= 6) return 'h-11 w-11 sm:h-14 sm:w-14'; // 10/12 -> 11/14
    if (gridSize === 5) return 'h-14 w-14 sm:h-16 sm:w-16'; // 12/14 -> 14/16
    if (gridSize === 4) return 'h-20 w-20 sm:h-24 sm:w-24'; // 16/20 -> 20/24
    return 'h-24 w-24 sm:h-28 sm:w-28'; // 20/24 -> 24/28
  };

  const calculateGhostInfo = (i: number, squareValue: SquareValue) => {
    if (gameMode !== 'ghost' || !squareValue || winner) return null;

    const life = getPieceLife(i);
    if (!life) return null;

    // 現在の盤面にある自分のコマ数と比較して、最も古い(rank 0)コマかどうか判定
    // gridSize (例: 3) コ配置されていたら、rank 0 は次消える
    const isFull = life.total >= gridSize;
    const isDying = isFull && life.rank === 0;

    // 新しいコマほど濃く(1.0)、古いコマほど薄くする(0.4程度)
    // life.total > 1 の場合のみ計算。1つしかないなら濃くていい。
    const minOpacity = 0.4;
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
