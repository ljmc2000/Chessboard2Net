import EventEmitter from 'node:events'
import { CHESS_DEFAULT_GAMESTATE } from './shared/chess-rules.js'
import { CHECKERS_DEFAULT_GAMESTATE, doCheckersMove } from './shared/checkers-rules.js'
import { GAME_MESSAGE, EndState, Instruction as I, PlayerNumber } from './shared/constants.js'

class Game extends EventEmitter {
	gamestate=" ".repeat(64)
	moveNumber=0
	player1={user_id: null}
	player2={user_id: null}

	doMove(move, player) {
	}

	gamestateMessage() {
		return {instr: I.GST, gamestate: this.gamestate, move_number: this.moveNumber}
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
				if(this.validateMove(data.move, player_number)) {
					this.doMove(data.move, player_number)
					this.emit(GAME_MESSAGE, this.gamestateMessage())
				}
				break
			case I.SRNDR:
				await this.onend(EndState.SURRENDER, this.gamestate)
				break
			default:
				ws.send(JSON.stringify({instr: I.ERR}))
		}
	}

	async onjoin(ws) {
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

	async onready() {
		if(this.player1.user_id)
			this.emit(GAME_MESSAGE, {instr: I.PINF, username: this.player1.username, favourite_colour: this.player1.favourite_colour, prefered_set: this.player1.prefered_set, player_number: PlayerNumber.ONE})
		if(this.player2.user_id)
			this.emit(GAME_MESSAGE, {instr: I.PINF, username: this.player2.username, favourite_colour: this.player2.favourite_colour, prefered_set: this.player2.prefered_set, player_number: PlayerNumber.TWO})
	}

	validateMove(move) {
		return true
	}
}

export class ChessGame extends Game {
	gamestate=CHESS_DEFAULT_GAMESTATE
}

export class CheckersGame extends Game {
	gamestate=CHECKERS_DEFAULT_GAMESTATE

	doMove(move, player_number) {
		doCheckersMove(this, move, player_number)
	}
}

export const NullGame = {
	onmessage: async function(data, ws) {
		ws.send(JSON.stringify({instr: I.ERROR}))
	},
	NULL: true
}
