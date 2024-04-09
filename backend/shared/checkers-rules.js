import { owner, wraps_left, wraps_right } from './utils.js'

export const CHECKERS_DEFAULT_GAMESTATE=
	` p p p p`+
	`p p p p `+
	` p p p p`+
	`        `+
	`        `+
	`P P P P `+
	` P P P P`+
	`P P P P `

export function getValidCheckersMoves(gamestate, position, player_number) {
	var moves=[]
	var piece = gamestate[position]
	var target, secondary_target

	if(owner(piece)==player_number) {
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
				if(!wraps_left(position,target) && gamestate[target]==' ')
					moves.push(target)
					else if(!wraps_left(position,secondary_target) && owner(gamestate[target])!=player_number && gamestate[secondary_target]==' ')
						moves.push(secondary_target)

				target=position+7
				secondary_target=position+14
				if(!wraps_right(position,target) && gamestate[target]==' ')
					moves.push(target)
					else if(!wraps_right(position,secondary_target) && owner(gamestate[target])!=player_number && gamestate[secondary_target]==' ')
						moves.push(secondary_target)
						break
		}
	}

	return moves
}

export function doCheckersMove(move, board) {
}
