import { generate_algerbraic_names, owner, wraps_left, wraps_right } from './utils.js'

const ALGERBRAIC_NAMES=generate_algerbraic_names()

export const CHESS_DEFAULT_GAMESTATE=
	`cnbqjbnc`+
	`ffffffff`+
	`        `+
	`        `+
	`        `+
	`        `+
	`FFFFFFFF`+
	`CNBQJBNC`

function getMovesForPosition(gamestate, position, player_number) {
	if(position<0 || position>=64)
		return ''

	const E = ALGERBRAIC_NAMES.encoder
	var moves = ''
	var piece = gamestate[position]
	var p_name = ALGERBRAIC_NAMES.encoder[position]
	var move = (target)=>`${p_name}${ALGERBRAIC_NAMES.encoder[target]}*`
	var target, collateral

	if(owner(piece)==player_number) {
		if('F'==piece) {
			target=position-16
			if(gamestate[target]==' ') {
				moves+=move(target)
			}
		}

		if('f'==piece) {
			target=position+16
			if(gamestate[target]==' ') {
				moves+=move(target)
			}
		}

		if('FPE'.includes(piece)) {
			target=position-7
			collateral=position+1
			if(!wraps_right(target) && owner(gamestate[target])!=player_number
				&& (gamestate[target]!=' ' || (owner(gamestate[collateral])!=player_number && gamestate[collateral]!=' '))
			) {
				moves+=move(target)
			}

			target=position-8
			if(gamestate[target]==' ') {
				moves+=move(target)
			}

			target=position-9
			collateral=position-1
			if(!wraps_left(target) && owner(gamestate[target])!=player_number
				&& (gamestate[target]!=' ' || (owner(gamestate[collateral])!=player_number && gamestate[collateral]!=' '))
			) {
				moves+=move(target)
			}
		}

		if('fpe'.includes(piece)) {
			target=position+7
			collateral=position-1
			if(!wraps_left(target) && owner(gamestate[target])!=player_number
				&& (gamestate[target]!=' ' || (owner(gamestate[collateral])!=player_number && gamestate[collateral]!=' '))
			) {
				moves+=move(target)
			}

			target=position+8
			if(gamestate[target]==' ') {
				moves+=move(target)
			}

			target=position+9
			collateral=position+1
			if(!wraps_right(target) && owner(gamestate[target])!=player_number
				&& (gamestate[target]!=' ' || (owner(gamestate[collateral])!=player_number && gamestate[collateral]!=' '))
			) {
				moves+=move(target)
			}
		}
	}

	return moves
}

function pieceAfterMove(piece) {
	switch(piece) {
		case 'c': return 'r'
		case 'f': return 'p'
		case 'j': return 'k'
		case 'C': return 'R'
		case 'F': return 'P'
		case 'J': return 'K'
		default: return piece
	}
}

export function getValidChessMoves(gamestate, player_number) {
	var moves = '*'

	for(var origin=0; origin<gamestate.length; origin++) {
		moves+=getMovesForPosition(gamestate, origin, player_number)
	}
	return moves
}

export function doChessMove(gamestate, move, player_number) {
	var tmp_gst=(player_number==0)?gamestate.replaceAll('E','P'):gamestate.replaceAll('e','p')
	var new_gamestate=tmp_gst.split('')
	var origin=ALGERBRAIC_NAMES.decoder[move.substring(0,2)]
	var target=ALGERBRAIC_NAMES.decoder[move.substring(2,4)]
	var collateral

	if(new_gamestate[origin]=='F' && origin-target==16) {
		new_gamestate[target]='E'
		new_gamestate[origin]=' '
	}
	else if(new_gamestate[origin]=='f' && target-origin==16) {
		new_gamestate[target]='e'
		new_gamestate[origin]=' '
	}
	else {
		new_gamestate[target]=pieceAfterMove(new_gamestate[origin])
		new_gamestate[origin]=' '
	}

	collateral=target+8
	if('PF'.includes(new_gamestate[target]) && new_gamestate[collateral]=='e') {
		new_gamestate[collateral]=' '
	}

	collateral=target-8
	if('pf'.includes(new_gamestate[target]) && new_gamestate[collateral]=='E') {
		new_gamestate[collateral]=' '
	}

	return new_gamestate.join('')
}
