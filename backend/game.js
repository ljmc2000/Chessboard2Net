import EventEmitter from 'node:events'
import { CHESS_DEFAULT_GAMESTATE, getValidChessMoves, doChessMove, getThreats } from './chess-rules.js'
import { CHECKERS_DEFAULT_GAMESTATE, getValidCheckersMoves, doCheckersMove } from './checkers-rules.js'
import { GAME_MESSAGE, ChessPiece, EndState, Instruction as I, PlayerNumber, ValidPromotionTargets } from './shared/constants.js'

class Game extends EventEmitter {
	gamestate=" ".repeat(64)
	moveLog=[]
	player1={user_id: null}
	player2={user_id: null}

	doMove(move, player) {
	}

	gamestateMessage() {
		return {instr: I.GST, gamestate: this.gamestate, move_number: this.moveLog.length, valid_moves: this.validMoves, threats: this.threats}
	}

	getPlayerNumber(user_id) {
		if(this.player1.user_id==user_id)
			return PlayerNumber.ONE
		if(this.player2.user_id==user_id)
			return PlayerNumber.TWO
		else
			return PlayerNumber.INVALID
	}

	async onmessage(data, ws) {
		var player_number=this.getPlayerNumber(ws.user.user_id)
		switch(data.instr) {
			case I.MOVE:
				if(player_number!=this.moveLog.length%2) {
					ws.send(JSON.stringify({instr: I.WAIT}))
				}
				else if(this.validMoves.includes(`*${data.move}*`)) {
					this.doMove(data.move, player_number)
					this.emit(GAME_MESSAGE, this.gamestateMessage())
					if(this.validMoves=='*') {
						await this.onend(EndState.CHECKMATE, ws.user)
					}
				}
				else {
					ws.send(JSON.stringify({instr: I.BADMV, move: data.move}))
				}
				break
			case I.PROM:
				if(!ValidPromotionTargets.includes(data.promotion_target)){
					ws.send(JSON.stringify({instr: I.ERROR}))
				}
				else if(player_number==PlayerNumber.ONE) {
					this.player1_promotion_target=data.promotion_target
					ws.send(JSON.stringify({instr: I.PROM, promotion_target: this.player1_promotion_target}))
				}
				else if(player_number==PlayerNumber.TWO) {
					this.player2_promotion_target=data.promotion_target
					ws.send(JSON.stringify({instr: I.PROM, promotion_target: this.player2_promotion_target}))
				}
				break
			case I.SRNDR:
				await this.onend(EndState.SURRENDER, ws.user)
				break
			case I.TELL:
				this.emit(GAME_MESSAGE, {instr: I.TELL, sender: ws.user, content:data.content})
				break
			default:
				ws.send(JSON.stringify({instr: I.ERR}))
		}
	}

	onjoin(ws) {
		ws.send(JSON.stringify({instr: I.SETPN, player_number: this.getPlayerNumber(ws.user.user_id)}))
		ws.send(JSON.stringify(this.gamestateMessage()))
	}

	register(ws) {
		if(!this.player1.user_id) {
			this.player1=ws.user
		}
		else if(!this.player2.user_id && this.player1.user_id!=ws.user.user_id) {
			this.player2=ws.user
		}
	}

	onready() {
		if(this.player1.user_id)
			this.emit(GAME_MESSAGE, {instr: I.PINF, username: this.player1.username, favourite_colour: this.player1.favourite_colour, prefered_set: this.player1.prefered_set, player_number: PlayerNumber.ONE})
		if(this.player2.user_id)
			this.emit(GAME_MESSAGE, {instr: I.PINF, username: this.player2.username, favourite_colour: this.player2.favourite_colour, prefered_set: this.player2.prefered_set, player_number: PlayerNumber.TWO})
	}
}

export class ChessGame extends Game {
	constructor() {
		super()
		this.gamestate=CHESS_DEFAULT_GAMESTATE
		this.validMoves=getValidChessMoves(this.gamestate, 0)
		this.player1_promotion_target=ChessPiece.ROOK
		this.player2_promotion_target=ChessPiece.ROOK
		this.threats=[]
	}

	doMove(move, player_number) {
		this.gamestate=doChessMove(this.gamestate, move, player_number, {p1: this.player1_promotion_target, p2: this.player2_promotion_target})
		this.moveLog.push(move)
		this.validMoves=getValidChessMoves(this.gamestate, this.moveLog.length%2)
		this.threats=getThreats(this.gamestate, this.moveLog.length%2)
	}

	onjoin(ws) {
		super.onjoin(ws)
		switch(this.getPlayerNumber(ws.user.user_id)) {
			case PlayerNumber.ONE:
				ws.send(JSON.stringify({instr: I.PROM, promotion_target: this.player1_promotion_target}))
				break
			case PlayerNumber.TWO:
				ws.send(JSON.stringify({instr: I.PROM, promotion_target: this.player2_promotion_target}))
				break
		}
	}
}

export class CheckersGame extends Game {

	constructor() {
		super()
		this.gamestate=CHECKERS_DEFAULT_GAMESTATE
		this.validMoves=getValidCheckersMoves(this.gamestate, 0)
	}

	doMove(move, player_number) {
		this.gamestate=doCheckersMove(this.gamestate, move, player_number)
		this.moveLog.push(move)
		this.validMoves=getValidCheckersMoves(this.gamestate, this.moveLog.length%2)
	}
}

export const NullGame = {
	onmessage: async function(data, ws) {
		ws.send(JSON.stringify({instr: I.ERROR}))
	},
	NULL: true
}
