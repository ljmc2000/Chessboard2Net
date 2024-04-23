import { PlayerInfo } from './playerinfo';

export interface GameLog {
  game_id: string;
  game: string;
  movelog: string[];
  conclusion: string;
  player1: PlayerInfo;
  player2: PlayerInfo;
  winner: string;
}
