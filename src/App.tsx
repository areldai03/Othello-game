import { useState } from 'react';
import { Trophy, X, Circle, Info } from 'lucide-react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { TitleScreen } from './components/TitleScreen';
import { useGame } from './hooks/useGame';
import type { GameMode } from './types/game';

export default function App() {
  const [showTitle, setShowTitle] = useState(true);
  const [gridSize, setGridSize] = useState(4);
  const [gameMode, setGameMode] = useState<GameMode>('standard');
  
  const {
    squares,
    xIsNext,
    winner,
    winningLine,
    isDraw,
    handleClick,
    resetGame,
    getPieceLife
  } = useGame(gridSize, gameMode);

  // ステータス表示
  const statusMessage = () => {
    if (winner) {
      return (
        <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold text-2xl animate-bounce">
          <Trophy size={32} />
          <span>勝者: {winner === 'X' ? 'バツ' : 'マル'}!</span>
        </div>
      );
    }
    if (isDraw) {
      return <div className="text-gray-500 font-bold text-2xl">引き分け！</div>;
    }
    return (
      <div className="flex items-center gap-2 text-xl text-slate-700">
        次は: 
        <span className={`flex items-center gap-1 font-bold ${xIsNext ? 'text-blue-500' : 'text-rose-500'}`}>
          {xIsNext ? <X size={24} /> : <Circle size={24} />}
          {xIsNext ? 'バツ' : 'マル'}
        </span>
      </div>
    );
  };

  return (
    <>
      {showTitle && <TitleScreen onComplete={() => setShowTitle(false)} />}
      
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-2 font-sans selection:bg-blue-100 overflow-hidden">
        
        <Header
          gameMode={gameMode}
          gridSize={gridSize}
          setGameMode={setGameMode}
          setGridSize={setGridSize}
          resetGame={resetGame}
        />

      {/* ステータス表示 */}
      <div className="mb-2 h-8 flex items-center justify-center">
        {statusMessage()}
      </div>

      {/* ゴーストモード時のヒント */}
      <div className="h-8 mb-2 flex items-center justify-center">
        {gameMode === 'ghost' && !winner && (
            <div className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-fade-in">
              <Info size={12} />
              {gridSize}個目の次は、一番古いコマが消えます
            </div>
        )}
      </div>

      <Board
        squares={squares}
        gridSize={gridSize}
        gameMode={gameMode}
        winningLine={winningLine}
        winner={winner}
        onSquareClick={handleClick}
        getPieceLife={getPieceLife}
      />

      {/* フッター */}
      <div className="mt-8 text-slate-400 text-xs sm:text-sm text-center">
        {gameMode === 'ghost' 
          ? `ゴーストモード中: ${gridSize}列揃えたら勝ち（古いコマは消えます）`
          : `${gridSize}列揃えたら勝ちです！`}
      </div>

      </div>
    </>
  );
}

