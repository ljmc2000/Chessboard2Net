export const LOGIN_TOKEN='login_token'
export const GAME_MESSAGE='game_message'
export const GAME_END='game_end'

export const ChessSet = { DOODLES: 1, GOBLINS: 2, TEATIME: 4 }
export const EndState = { SURRENDER: 'surrender', CHECKMATE: 'checkmate' }
export const Game = { CHECKERS: 'checkers', CHESS: 'chess' }
export const Scope = { PRIVATE: 1, DIRECT: 2, GAME: 3, UNIVERSE: -1 }

export const Instructions = {
	ACLNG: 'accept_challenge',
	AUTH: 'authenticate',
	BUSY: 'player_busy',
	CLNG: 'challenge',
	ERR: 'protocol_error',
	GOVER: 'game_over',
	GST: 'gamestate',
	MOVE: 'move',
	NOPLR: 'no_player',
	NOSCP: 'no_scope',
	READY: 'ready',
	SINF: 'self_info',
	SUB: 'subscribe_universe_callback',
	SRNDR: 'surrender',
	TELL: 'tell',
	PINF: 'player_info',
	OUCNT: 'count_online_users',
	UNSUB: 'unsubscribe_universe_callback',
	XCLNG: 'deny_challenge',
}

export const UserProfileFlags = {
	VISIBLE_AS_ONLINE: (true<<0),
}
