import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, Circle, X, Hash, Ghost, Info } from 'lucide-react';

export default function App() {
  const [gridSize, setGridSize] = useState(3);
  // 'standard' か 'ghost' か
  const [gameMode, setGameMode] = useState('standard');
  
  // マスの状態管理 (standardモード用)
  const [squares, setSquares] = useState(Array(9).fill(null));
  
  // 履歴管理 (ghostモード用: { player: 'X', index: 0 } の配列)
  const [moveHistory, setMoveHistory] = useState([]);

  const [xIsNext, setXIsNext] = useState(true);
  const [winningLine, setWinningLine] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  // グリッドサイズが変わったら盤面をリセット
  useEffect(() => {
    resetGame(gridSize, gameMode);
  }, [gridSize, gameMode]);

  // ゲームのリセット処理
  const resetGame = (size = gridSize, mode = gameMode) => {
    setSquares(Array(size * size).fill(null));
    setMoveHistory([]);
    setXIsNext(true);
    setWinningLine(null);
    setWinner(null);
    setIsDraw(false);
  };

  // 勝利判定ロジック
  const calculateWinner = (currentSquares, size) => {
    const lines = [];

    // 行
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(i * size + j);
      }
      lines.push(row);
    }
    // 列
    for (let i = 0; i < size; i++) {
      const col = [];
      for (let j = 0; j < size; j++) {
        col.push(j * size + i);
      }
      lines.push(col);
    }
    // 斜め
    const diag1 = [], diag2 = [];
    for (let i = 0; i < size; i++) {
      diag1.push(i * size + i);
      diag2.push(i * size + (size - 1 - i));
    }
    lines.push(diag1);
    lines.push(diag2);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const first = currentSquares[line[0]];
      if (first && line.every(index => currentSquares[index] === first)) {
        return { winner: first, line: line };
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (winner) return;

    // 現在のプレイヤー
    const currentPlayer = xIsNext ? 'X' : 'O';
    
    // 次の盤面状態を作成
    let nextSquares = [...squares];
    let nextHistory = [...moveHistory];

    // マスが既に埋まっているかチェック
    if (nextSquares[i]) return;

    // --- ゴーストモードのロジック ---
    if (gameMode === 'ghost') {
      const playerMoves = nextHistory.filter(m => m.player === currentPlayer);
      
      // 制限数（グリッドサイズと同じ数）に達している場合、一番古いコマを消す
      if (playerMoves.length >= gridSize) {
        // 履歴の中で一番古いこのプレイヤーの動きを探す
        const oldestMoveIndex = nextHistory.findIndex(m => m.player === currentPlayer);
        if (oldestMoveIndex !== -1) {
          const moveToRemove = nextHistory[oldestMoveIndex];
          nextSquares[moveToRemove.index] = null; // 盤面から消去
          nextHistory.splice(oldestMoveIndex, 1); // 履歴から削除
        }
      }
      
      // 新しい動きを追加
      nextHistory.push({ player: currentPlayer, index: i });
      setMoveHistory(nextHistory);
    } 
    // --- 通常モードのロジック ---
    else {
      if (squares[i]) return;
    }

    // 盤面更新
    nextSquares[i] = currentPlayer;
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    // 勝利判定
    const winInfo = calculateWinner(nextSquares, gridSize);
    if (winInfo) {
      setWinner(winInfo.winner);
      setWinningLine(winInfo.line);
    } else if (!nextSquares.includes(null) && gameMode === 'standard') {
      // ゴーストモードには引き分けがない（マスが空くので）
      setIsDraw(true);
    }
  };

  // ゴーストモードで「次に消えるコマ」かどうか判定
  const isDyingPiece = (index) => {
    if (gameMode !== 'ghost' || winner) return false;
    
    const currentPlayer = xIsNext ? 'X' : 'O';
    const playerMoves = moveHistory.filter(m => m.player === currentPlayer);
    
    // まだ上限に達していなければ消えない
    if (playerMoves.length < gridSize) return false;

    // 履歴の一番最初にあるプレイヤーのコマが消える対象
    const oldestMove = moveHistory.find(m => m.player === currentPlayer);
    return oldestMove && oldestMove.index === index;
  };

  // スタイル関連
  const getCellSizeClass = () => {
    if (gridSize >= 6) return 'h-10 w-10 sm:h-12 sm:w-12 text-xl';
    if (gridSize === 5) return 'h-12 w-12 sm:h-14 sm:w-14 text-2xl';
    if (gridSize === 4) return 'h-16 w-16 sm:h-20 sm:w-20 text-3xl';
    return 'h-20 w-20 sm:h-24 sm:w-24 text-4xl';
  };

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
          {xIsNext ? 'X (バツ)' : 'O (マル)'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans selection:bg-blue-100">
      
      {/* ヘッダーエリア */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight flex items-center justify-center gap-2">
          {gameMode === 'ghost' ? <Ghost className="text-purple-500 animate-pulse" /> : <Hash className="text-slate-400" />}
          {gameMode === 'ghost' ? 'ゴースト・マルバツ' : 'マルバツゲーム'}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
          {gameMode === 'ghost' 
            ? `【${gridSize}つまで】古いコマが消滅します！記憶力の勝負。` 
            : '定番のマルバツゲーム。一列揃えよう。'}
        </p>
      </div>

      {/* 設定エリア */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 w-full max-w-md space-y-4">
        
        {/* モード切替タブ */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setGameMode('standard')}
            className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${
              gameMode === 'standard' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Hash size={16} />
            通常モード
          </button>
          <button
            onClick={() => setGameMode('ghost')}
            className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${
              gameMode === 'ghost' 
                ? 'bg-purple-100 text-purple-700 shadow-sm ring-1 ring-purple-200' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Ghost size={16} />
            ゴーストモード
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <label className="text-slate-600 font-medium flex items-center gap-2 text-sm w-full sm:w-auto">
            盤面サイズ:
            <select 
              value={gridSize} 
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 font-bold w-full sm:w-auto"
            >
              <option value={3}>3 x 3</option>
              <option value={4}>4 x 4</option>
              <option value={5}>5 x 5</option>
              <option value={6}>6 x 6</option>
            </select>
          </label>
          
          <button 
            onClick={() => resetGame()} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-md active:scale-95 text-sm font-bold"
          >
            <RefreshCw size={16} />
            リセット
          </button>
        </div>
      </div>

      {/* ステータス表示 */}
      <div className="mb-6 h-8 flex items-center justify-center">
        {statusMessage()}
      </div>

      {/* ゲーム盤面 */}
      <div className={`
        relative bg-white p-4 sm:p-6 rounded-2xl shadow-xl border-2 transition-colors duration-500
        ${gameMode === 'ghost' ? 'border-purple-200 shadow-purple-100' : 'border-slate-100'}
      `}>
        {/* ゴーストモード時のヒント */}
        {gameMode === 'ghost' && !winner && (
           <div className="absolute -top-10 left-0 right-0 flex justify-center">
             <div className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-fade-in">
               <Info size={12} />
               {gridSize}個目の次は、一番古いコマが消えます
             </div>
           </div>
        )}

        <div 
          className="grid gap-2 sm:gap-3"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` 
          }}
        >
          {squares.map((square, i) => {
            const isWinningSquare = winningLine && winningLine.includes(i);
            const isDying = isDyingPiece(i);
            
            return (
              <button
                key={i}
                className={`
                  ${getCellSizeClass()}
                  rounded-xl flex items-center justify-center
                  transition-all duration-300 ease-out
                  shadow-sm border-2 relative
                  ${!square && !winner ? 'hover:bg-slate-50 cursor-pointer active:scale-95' : 'cursor-default'}
                  ${isWinningSquare ? 'bg-yellow-100 border-yellow-400 scale-105 z-10' : 'bg-white border-slate-200'}
                  ${square === 'X' ? 'text-blue-500' : 'text-rose-500'}
                  ${isDying ? 'opacity-40 border-dashed border-slate-300 scale-95 ring-2 ring-red-200 bg-red-50' : ''}
                `}
                onClick={() => handleClick(i)}
                disabled={!!winner || (!!square && gameMode === 'standard') || (!!square && gameMode === 'ghost')} // Ghostモードでも埋まっているマスはクリック不可
              >
                {/* 消滅予告アイコン */}
                {isDying && (
                   <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md animate-bounce z-20">
                     <Ghost size={12} />
                   </span>
                )}

                {square === 'X' && (
                  <X className={`w-2/3 h-2/3 stroke-[3px] animate-in zoom-in duration-200 ${isDying ? 'grayscale' : ''}`} />
                )}
                {square === 'O' && (
                  <Circle className={`w-2/3 h-2/3 stroke-[3px] animate-in zoom-in duration-200 ${isDying ? 'grayscale' : ''}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* フッター */}
      <div className="mt-8 text-slate-400 text-xs sm:text-sm text-center">
        {gameMode === 'ghost' 
          ? `ゴーストモード中: ${gridSize}列揃えたら勝ち（古いコマは消えます）`
          : `${gridSize}列揃えたら勝ちです！`}
      </div>

    </div>
  );
}