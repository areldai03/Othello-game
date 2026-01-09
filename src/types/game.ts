// プレイヤーの定義
export type Player = 'X' | 'O';

// マスの状態
export type SquareValue = Player | null;

// ゲームモード
export type GameMode = 'standard' | 'ghost';

// 履歴データの型
export interface Move {
  player: Player;
  index: number;
}

// 勝利情報の型
export interface WinInfo {
  winner: Player;
  line: number[];
}
