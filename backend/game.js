import EventEmitter from 'node:events'
import * as ENDSTATE from './shared/endstate.js'
import * as I from './shared/instructions.js'

export const GAME_MESSAGE='game_message'
export const GAME_END='game_end'

class Game extends EventEmitter {
	gamestate=" ".repeat(64)
	moveNumber=0
	player1={user_id: null}
	player2={user_id: null}

	doMove(move, player) {
		if(this.p1==player && moveNumber%2==0) {
		}
		else if(this.p2==player && moveNumber%2==1) {
		}
	}

	async onmessage(data, ws) {
		switch(data.instr) {
			case I.SRNDR:
				await this.onend(ENDSTATE.SURRENDER, this.gamestate)
				break
			default:
				ws.send(JSON.stringify({instr: I.ERR}))
		}
	}

	async onjoin(ws) {
		ws.send(JSON.stringify({instr: I.GST, gamestate: this.gamestate, is_player1: this.player1.user_id==ws.user.user_id}))
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
			this.emit(GAME_MESSAGE, {instr: I.PINF, username: this.player1.username, favourite_colour: this.player1.favourite_colour, prefered_set: this.player1.prefered_set, is_player1: true})
		if(this.player2.user_id)
			this.emit(GAME_MESSAGE, {instr: I.PINF, username: this.player2.username, favourite_colour: this.player2.favourite_colour, prefered_set: this.player2.prefered_set, is_player1: false})
	}
}

export class ChessGame extends Game {
	constructor() {
		super()
		this.gamestate=
			`rnbkqbnr`+
			`pppppppp`+
			`        `+
			`        `+
			`        `+
			`        `+
			`PPPPPPPP`+
			`RNBKQBNR`
	}
}

export class CheckersGame extends Game {

	constructor() {
		super()
		this.gamestate=
			`p p p p `+
			` p p p p`+
			`p p p p `+
			`        `+
			`        `+
			` P P P P`+
			`P P P P `+
			` P P P P`
	}
}

export const NullGame = {
	onmessage: async function(data, ws) {
		ws.send(JSON.stringify({instr: I.ERROR}))
	},
	NULL: true
}
