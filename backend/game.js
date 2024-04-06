import EventEmitter from 'node:events'
import * as ENDSTATE from './shared/endstate.js'
import * as I from './shared/instructions.js'

export const GAME_MESSAGE='game_message'
export const GAME_END='game_end'

class Game extends EventEmitter {
	gamestate=" ".repeat(64)
	moveNumber=0

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
		ws.send(JSON.stringify({instr: I.GST, gamestate: this.gamestate}))
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
