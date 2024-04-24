export const CHESS_DEFAULT_GAMESTATE: string;
export function getValidChessMoves(gamestate: string, player_number: number): string;
export function doChessMove(gamestate: string, move: string, player_number: number, promotion_target:? string): string;
