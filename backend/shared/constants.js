export const LOGIN_TOKEN='login_token'
export const GAME_MESSAGE='game_message'
export const GAME_END='game_end'

export const ChessSet = { DOODLES: 1, GOBLINS: 2, TEATIME: 4 }
export const EndState = { SURRENDER: 'surrender', CHECKMATE: 'checkmate' }
export const Game = { CHECKERS: 'checkers', CHESS: 'chess' }
export const PlayerNumber = { ONE: 0, TWO: 1, INVALID: -1 }
export const Scope = { PRIVATE: 1, DIRECT: 2, GAME: 3, UNIVERSE: -1 }

export const ChessPiece = {
	PAWN: 'pawn',
	ROOK: 'rook',
	KNIGHT: 'knight',
	BISHOP: 'bishop',
	QUEEN: 'queen',
	KING: 'king',
}

export const Instruction = {
	ACLNG: 'accept_challenge',
	AUTH: 'authenticate',
	BADMV: 'bad_move',
	BUSY: 'player_busy',
	CLNG: 'challenge',
	ERR: 'protocol_error',
	GOVER: 'game_over',
	GST: 'gamestate',
	MOVE: 'move',
	NCLNG: 'acknowledge_challenge',
	NOGME: 'no_game',
	NOPLR: 'no_player',
	NOSCP: 'no_scope',
	READY: 'ready',
	SETPN: 'set_player_number',
	SINF: 'self_info',
	SUB: 'subscribe_universe_callback',
	SRNDR: 'surrender',
	TELL: 'tell',
	PINF: 'player_info',
	PROM: 'set_promotion_target',
	OUCNT: 'count_online_users',
	UENV: 'user_event',
	UNSUB: 'unsubscribe_universe_callback',
	WAIT: 'wait_your_turn',
	WATCH: 'spectate_game',
	XCLNG: 'deny_challenge',
	XWTCH: 'spectate_denied',
}

export const UserEvent = {
	CONN: 'connect',
	DCONN: 'disconnect',
	EGAME: 'end_game',
	SGAME: 'start_game',
}

export const UserProfileFlag = {
	VISIBLE_AS_ONLINE: (true<<0),
	ALLOW_SPECTATORS: (true<<1),
}

export const ValidPromotionTargets = [
	ChessPiece.ROOK,
	ChessPiece.KNIGHT,
	ChessPiece.BISHOP,
	ChessPiece.QUEEN,
]
