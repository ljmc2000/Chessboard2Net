export const LOGIN_TOKEN: string
export const GAME_MESSAGE: string
export const GAME_END: string

export const ChessSet: { DOODLES: number, GOBLINS: number, TEATIME: number }
export const EndState: { SURRENDER: string, CHECKMATE: string }
export const Game: { CHECKERS: string, CHESS: string }
export const PlayerNumber: { ONE: number, TWO: number, NOBODY:number, INVALID: number }
export const Scope: { PRIVATE: number, DIRECT: number, GAME: number, UNIVERSE: number }

export const ChessPiece: {
	PAWN: string;
	ROOK: string;
	KNIGHT: string;
	BISHOP: string;
	QUEEN: string;
	KING: string;
}

export const Instruction: {
	ACLNG: string;
	AUTH: string;
	BADMV: string;
	BUSY: string;
	CLNG: string;
	ERR: string;
	GOVER: string;
	GST: string;
	MOVE: string;
	NCLNG: string;
	NOGME: string;
	NOPLR: string;
	NOSCP: string;
	PINF: string;
	PROM: string;
	READY: string;
	SETPN: string;
	SINF: string;
	SUB: string;
	SRNDR: string;
	TELL: string;
	OUCNT: string;
	UENV: string;
	UNSUB: string;
	WAIT: string;
	WATCH: string;
	XCLNG: string;
	XWTCH: string;
}

export const UserEvent: {
	CONN: string;
	DCONN: string;
	END_GAME: string;
	START_GAME: string;
}

export const UserProfileFlag: {
	VISIBLE_AS_ONLINE: number,
	ALLOW_SPECTATORS: number,
}

export const ValidPromotionTargets: string[]
