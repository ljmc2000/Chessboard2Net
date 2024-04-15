export const LOGIN_TOKEN='login_token'
export const GAME_MESSAGE='game_message'
export const GAME_END='game_end'

export const ChessSet = { DOODLES: 1, GOBLINS: 2, TEATIME: 4 }
export const EndState = { SURRENDER: 'surrender', CHECKMATE: 'checkmate' }
export const Game = { CHECKERS: 'checkers', CHESS: 'chess' }
export const PlayerNumber = { ONE: 0, TWO: 1, INVALID: -1 }
export const Scope = { PRIVATE: 1, DIRECT: 2, GAME: 3, UNIVERSE: -1 }

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
	NOPLR: 'no_player',
	NOSCP: 'no_scope',
	READY: 'ready',
	SETPN: 'set_player_number',
	SINF: 'self_info',
	SUB: 'subscribe_universe_callback',
	SRNDR: 'surrender',
	TELL: 'tell',
	PINF: 'player_info',
	OUCNT: 'count_online_users',
	UNSUB: 'unsubscribe_universe_callback',
	WAIT: 'wait_your_turn',
	XCLNG: 'deny_challenge',
}

export const UserProfileFlag = {
	VISIBLE_AS_ONLINE: (true<<0),
}
