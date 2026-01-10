import { useState, useEffect, useCallback } from 'react';
import type { Player, SquareValue, GameMode, Move, WinInfo } from '../types/game';

export const useGame = (gridSize: number, gameMode: GameMode) => {
  const [squares, setSquares] = useState<SquareValue[]>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [xIsNext, setXIsNext] = useState(true);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);

  // 初期化・リセット
  const resetGame = useCallback(() => {
    setSquares(Array(gridSize * gridSize).fill(null));
    setMoveHistory([]);
    setXIsNext(true);
    setWinningLine(null);
    setWinner(null);
    setIsDraw(false);
  }, [gridSize]);

  // グリッドサイズまたはゲームモードが変わったらリセット
  useEffect(() => {
    resetGame();
  }, [resetGame, gameMode]);

  // 勝利判定
  const calculateWinner = useCallback((currentSquares: SquareValue[], size: number): WinInfo | null => {
    const lines: number[][] = [];

    // 行
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        row.push(i * size + j);
      }
      lines.push(row);
    }
    // 列
    for (let i = 0; i < size; i++) {
      const col: number[] = [];
      for (let j = 0; j < size; j++) {
        col.push(j * size + i);
      }
      lines.push(col);
    }
    // 斜め
    const diag1: number[] = [], diag2: number[] = [];
    for (let i = 0; i < size; i++) {
      diag1.push(i * size + i);
      diag2.push(i * size + (size - 1 - i));
    }
    lines.push(diag1);
    lines.push(diag2);

    for (const line of lines) {
      const first = currentSquares[line[0]];
      if (first && line.every(index => currentSquares[index] === first)) {
        return { winner: first, line };
      }
    }
    return null;
  }, []);

  const handleClick = (i: number) => {
    if (winner || squares[i]) return;
    // ghostモードでもマスが埋まっていたらクリックできない (仕様通り)
    
    const currentPlayer: Player = xIsNext ? 'X' : 'O';
    const nextSquares = [...squares];
    const nextHistory = [...moveHistory];

    // --- ゴーストモードのロジック ---
    if (gameMode === 'ghost') {
      const playerMoves = nextHistory.filter(m => m.player === currentPlayer);
      
      // 制限数に達している場合、一番古いコマを消す
      if (playerMoves.length >= gridSize) {
        const oldestMoveIndex = nextHistory.findIndex(m => m.player === currentPlayer);
        if (oldestMoveIndex !== -1) {
          const moveToRemove = nextHistory[oldestMoveIndex];
          nextSquares[moveToRemove.index] = null;
          nextHistory.splice(oldestMoveIndex, 1);
        }
      }
      
      nextHistory.push({ player: currentPlayer, index: i });
      setMoveHistory(nextHistory);
    } 

    // 盤面更新
    nextSquares[i] = currentPlayer;
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    // 判定
    const winInfo = calculateWinner(nextSquares, gridSize);
    if (winInfo) {
      setWinner(winInfo.winner);
      setWinningLine(winInfo.line);
    } else if (!nextSquares.includes(null) && gameMode === 'standard') {
      setIsDraw(true);
    }
  };

  // ゴーストモード用：コマの寿命情報を取得
  const getPieceLife = (index: number) => {
    if (gameMode !== 'ghost' || !squares[index] || winner) return null;

    const currentPlayer = squares[index] as Player;
    const playerMoves = moveHistory.filter(m => m.player === currentPlayer);
    const moveIndex = playerMoves.findIndex(m => m.index === index);
    
    if (moveIndex === -1) return null;

    return {
      rank: moveIndex, // 0が最古
      total: playerMoves.length
    };
  };

  return {
    squares,
    xIsNext,
    winner,
    winningLine,
    isDraw,
    handleClick,
    resetGame,
    getPieceLife
  };
};
