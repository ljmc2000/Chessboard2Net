import { PlayerNumber } from './constants.js'
import { generate_algerbraic_names, owner, wraps_left, wraps_right } from './utils.js'

const ALGERBRAIC_NAMES=generate_algerbraic_names()

export const CHECKERS_DEFAULT_GAMESTATE=
	` p p p p`+
	`p p p p `+
	` p p p p`+
	`        `+
	`        `+
	`P P P P `+
	` P P P P`+
	`P P P P `

function getMovesForPosition(gamestate, position, player_number, prefix, following=false) {
	if(position<0 || position>=64)
		return ''

	function _check(target, secondary_target, prefix, wraps) {
		if(!wraps(position, target) && gamestate[target]==' ') {
			return following?'':`${(prefix+ALGERBRAIC_NAMES.encoder[target])}*`
		}
		else if(!wraps(position,secondary_target) && owner(gamestate[target])==!player_number && gamestate[secondary_target]==' ') {
			var move=`${(prefix+ALGERBRAIC_NAMES.encoder[secondary_target])}`
			return move+'*'+getMovesForPosition(doCheckersMove(gamestate, move.substring(move.length-4), player_number), secondary_target, player_number, move, true)
		}
		else {
			return ''
		}
	}

	var moves=''
	var piece = gamestate[position]

	if(owner(piece)==player_number) {
		if(['P','K','k'].includes(piece)) {
			moves+=_check(position-9, position-18, prefix, wraps_left)
			moves+=_check(position-7, position-14, prefix, wraps_right)
		}

		if(['p','K','k'].includes(piece)) {
			moves+=_check(position+9, position+18, prefix, wraps_right)
			moves+=_check(position+7, position+14, prefix, wraps_left)
		}
	}

	return moves
}

export function getValidCheckersMoves(gamestate, player_number) {
	var moves = '*'

	for(var origin=0; origin<gamestate.length; origin++) {
		moves+=getMovesForPosition(gamestate, origin, player_number, ALGERBRAIC_NAMES.encoder[origin])
	}
	return moves
}

export function doCheckersMove(gamestate, move, player_number) {
	var new_gamestate=gamestate.split('')
	var origin, target

	for(var i=0; i<=move.length-4; i+=2) {
		origin=ALGERBRAIC_NAMES.decoder[move.substring(i,i+2)]
		target=ALGERBRAIC_NAMES.decoder[move.substring(i+2,i+4)]
		new_gamestate[target]=new_gamestate[origin]
		new_gamestate[origin]=' '
		switch(target-origin) {
			case 14:
				new_gamestate[origin+7]=' '
				break
			case -14:
				new_gamestate[origin-7]=' '
				break
			case 18:
				new_gamestate[origin+9]=' '
				break
			case -18:
				new_gamestate[origin-9]=' '
				break
		}
		switch(Math.floor(target/8)) {
			case 0:
				if(player_number==PlayerNumber.ONE)
					new_gamestate[target]='K'
				break
			case 7:
				if(player_number==PlayerNumber.TWO)
					new_gamestate[target]='k'
				break
		}
	}

	return new_gamestate.join('')
}
