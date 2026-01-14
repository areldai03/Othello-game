import React from 'react';
import { Circle, X, Ghost } from 'lucide-react';
import type { SquareValue, GameMode } from '../types/game';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinningSquare: boolean;
  gameMode: GameMode;
  disabled: boolean;
  sizeClass: string;
  ghostInfo?: {
    opacity: number;
    scale: number;
    isDying: boolean;
  } | null;
}

export const Square: React.FC<SquareProps> = ({
  value,
  onClick,
  isWinningSquare,
  gameMode,
  disabled,
  sizeClass,
  ghostInfo
}) => {
  // スタイル計算
  let style: React.CSSProperties = {};
  let isDying = false;

  if (gameMode === 'ghost' && ghostInfo) {
    style = {
      opacity: ghostInfo.opacity,
      transform: `scale(${ghostInfo.scale})`
    };
    isDying = ghostInfo.isDying;
  }

  return (
    <button
      style={style}
      className={`
        ${sizeClass}
        rounded-xl flex items-center justify-center
        transition-all duration-300 ease-out
        shadow-sm border-2 relative
        ${!disabled ? 'hover:bg-slate-50 cursor-pointer active:scale-95' : 'cursor-default'}
        ${isWinningSquare ? 'bg-yellow-100 border-yellow-400 scale-105 z-10' : 'bg-white border-slate-200'}
        ${value === 'X' ? 'text-blue-500' : 'text-rose-500'}
        ${isDying ? 'border-dashed border-red-300 ring-2 ring-red-100 bg-red-50' : ''}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {/* 消滅予告アイコン */}
      {isDying && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md animate-bounce z-20">
          <Ghost size={12} />
        </span>
      )}

      {value === 'X' && (
        <X className="w-2/3 h-2/3 stroke-[3px] animate-in zoom-in duration-200" />
      )}
      {value === 'O' && (
        <Circle className="w-2/3 h-2/3 stroke-[3px] animate-in zoom-in duration-200" />
      )}
    </button>
  );
};
