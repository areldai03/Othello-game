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
    // 盤面を大きく戻す
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
          {xIsNext ? 'バツ' : 'マル'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-2 font-sans selection:bg-blue-100 overflow-hidden">
      
      {/* ヘッダー＆コントロールパネル (コンパクト化) */}
      <div className="w-full max-w-sm flex flex-col items-center mb-2 gap-2">
        {/* タイトル行 */}
        <div className="flex items-center justify-center gap-2">
          <img 
            src="/public/image_1.png" 
            alt="Game Mascot" 
            className={`w-14 h-14 object-contain drop-shadow-sm hover:scale-110 transition-transform duration-300 ${gameMode === 'ghost' ? 'animate-bounce' : ''}`}
          />
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
              Ghost<span className="text-purple-600">XO</span>
            </h1>
          </div>
        </div>

        {/* コントロールバー (一行に集約) */}
        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center justify-between w-full gap-2">
           
           {/* モード切替 */}
           <div className="flex bg-slate-100 rounded-full p-0.5">
             <button 
               onClick={() => setGameMode('standard')}
               className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                 gameMode === 'standard' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'
               }`}
             >
               <Hash size={12} /> <span className="hidden xs:inline">通常</span>
             </button>
             <button 
               onClick={() => setGameMode('ghost')}
               className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                 gameMode === 'ghost' ? 'bg-purple-100 text-purple-700 shadow-sm' : 'text-slate-400'
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
             onClick={() => resetGame()} 
             className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
             title="リセット"
           >
             <RefreshCw size={14} />
           </button>
        </div>
        
        {/* 説明文 (復活) */}
        <p className="text-[11px] sm:text-xs text-slate-500 text-center transition-all duration-300">
          {gameMode === 'ghost' 
            ? <span><span className="font-bold text-purple-600">【{gridSize}つまで】</span>古い順に消えます。記憶力の勝負！</span> 
            : '縦・横・斜めに揃えたら勝ち。定番ルールです。'}
        </p>
      </div>

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

      {/* ゲーム盤面 */}
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