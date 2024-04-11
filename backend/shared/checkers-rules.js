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

export function getValidCheckersMoves(gamestate, position, player_number, turn) {
	var moves=[]
	var piece = gamestate[position]
	var target, secondary_target

	if(owner(piece)==player_number && turn%2==player_number) {
		switch(piece) {
			case 'P':
				target=position-9
				secondary_target=position-18
				if(!wraps_left(position,target) && gamestate[target]==' ')
					moves.push(target)
				else if(!wraps_left(position,secondary_target) && owner(gamestate[target])!=player_number && gamestate[secondary_target]==' ')
					moves.push(secondary_target)

				target=position-7
				secondary_target=position-14
				if(!wraps_right(position,target) && gamestate[target]==' ')
					moves.push(target)
				else if(!wraps_right(position,secondary_target) && owner(gamestate[target])!=player_number && gamestate[secondary_target]==' ')
					moves.push(secondary_target)
				break
			case 'p':
				target=position+9
				secondary_target=position+18
				if(!wraps_right(position,target) && gamestate[target]==' ')
					moves.push(target)
				else if(!wraps_right(position,secondary_target) && owner(gamestate[target])!=player_number && gamestate[secondary_target]==' ')
					moves.push(secondary_target)

				target=position+7
				secondary_target=position+14
				if(!wraps_left(position,target) && gamestate[target]==' ')
					moves.push(target)
				else if(!wraps_left(position,secondary_target) && owner(gamestate[target])!=player_number && gamestate[secondary_target]==' ')
					moves.push(secondary_target)
					break
		}
	}

	return moves
}

export function doCheckersMove(game, move, player_number) {
	var new_gamestate=game.gamestate.split('')
	var origin, target

	for(var i=0; i<=move.length-4; i+=4) {
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

	game.gamestate=new_gamestate.join('')
	game.moveNumber++
}
