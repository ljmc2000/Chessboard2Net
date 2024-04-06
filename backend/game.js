import EventEmitter from 'node:events'
import * as ENDSTATE from './shared/endstate.js'
import * as I from './shared/instructions.js'

export const GAME_MESSAGE='game_message'
export const GAME_END='game_end'

class Game extends EventEmitter {
	gamestate=" ".repeat(64)
	moveNumber=0

	constructor() {
		super()
		this.gamestate=this.DEFAULT_GAMESTATE
	}

	doMove(move, player) {
		if(this.p1==player && moveNumber%2==0) {
		}
		else if(this.p2==player && moveNumber%2==1) {
		}
	}

	async onmessage(data, ws) {
		switch(data.instr) {
			case I.SRNDR:
				await this.onend(ENDSTATE.SURRENDER)
				break
			default:
				ws.send(JSON.stringify({instr: I.ERR}))
		}
	}
}

export class ChessGame extends Game {
	DEFAULT_GAMESTATE=
		`rnbkqbnr`+
		`pppppppp`+
		`        `+
		`        `+
		`        `+
		`        `+
		`PPPPPPPP`+
		`RNBKQBNR`
}

export class CheckersGame extends Game {
	DEFAULT_GAMESTATE=
	`p p p p `+
	` p p p p`+
	`p p p p `+
	`        `+
	`        `+
	` P P P P`+
	`P P P P `+
	` P P P P`
}

export const NullGame = {
	onmessage: async function(data, ws) {
		ws.send(JSON.stringify({instr: I.ERROR}))
	},
	NULL: true
}
