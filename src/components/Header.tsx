import React from 'react';
import { Ghost, Hash, RefreshCw } from 'lucide-react';
import type { GameMode } from '../types/game';

interface HeaderProps {
    gameMode: GameMode;
    gridSize: number;
    setGameMode: (mode: GameMode) => void;
    setGridSize: (size: number) => void;
    resetGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    gameMode,
    gridSize,
    setGameMode,
    setGridSize,
    resetGame
}) => {
    return (
        <div className="w-full max-w-md flex flex-col items-center mb-6 gap-6 px-4">
            {/* タイトル行 */}
            <div className="flex items-center justify-center gap-4">
                <img
                    src="/image_1.png"
                    alt="Game Mascot"
                    className={`w-16 h-16 object-contain drop-shadow-md hover:scale-110 transition-transform duration-300 ${gameMode === 'ghost' ? 'animate-bounce' : ''}`}
                />
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
                        GhostXO
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">Classic</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${gameMode === 'ghost' ? 'bg-purple-100 text-purple-600' : 'text-slate-400'}`}>Ghost</span>
                    </div>
                </div>
            </div>

            {/* コントロールバー (一行に集約) */}
            <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center justify-between w-full gap-2">

                {/* モード切替 */}
                <div className="flex bg-slate-100 rounded-full p-0.5">
                    <button
                        onClick={() => setGameMode('standard')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${gameMode === 'standard' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'
                            }`}
                    >
                        <Hash size={12} /> <span className="hidden xs:inline">通常</span>
                    </button>
                    <button
                        onClick={() => setGameMode('ghost')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${gameMode === 'ghost' ? 'bg-purple-100 text-purple-700 shadow-sm' : 'text-slate-400'
                            }`}
                    >
                        <Ghost size={12} /> <span className="hidden xs:inline">Ghost</span>
                    </button>
                </div>

                <div className="h-4 w-px bg-slate-200"></div>

                {/* サイズ選択 */}
                <select
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                    className="bg-transparent text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
                >
                    <option value={3}>3x3</option>
                    <option value={4}>4x4</option>
                    <option value={5}>5x5</option>
                    <option value={6}>6x6</option>
                </select>

                {/* リセットボタン */}
                <button
                    onClick={resetGame}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                    title="リセット"
                >
                    <RefreshCw size={14} />
                </button>
            </div>

            {/* 説明文 */}
            <p className="text-xs sm:text-sm text-slate-500 text-center transition-all duration-300">
                {gameMode === 'ghost'
                    ? <span><span className="font-bold text-purple-600">【{gridSize}つまで】</span>古い順に消えます。記憶力の勝負！</span>
                    : '縦・横・斜めに揃えたら勝ち。定番ルールです。'}
            </p>
        </div>
    );
};
