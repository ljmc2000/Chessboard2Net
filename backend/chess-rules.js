import { generate_algerbraic_names, owner, same_row, wraps_left, wraps_right } from './shared/utils.js'

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

	function move(target) {
		return (target>=0 && target<64)?`${p_name}${ALGERBRAIC_NAMES.encoder[target]}*`:``
	}

	function pawn_diagonal(target, offset, enemy_pawn, wraps) {
		var collateral=target+offset

		var condition1=owner(gamestate[target])==!player_number
		var condition2=gamestate[collateral]==enemy_pawn

		if(wraps(position,target)) {
			return false
		}
		else {
			return condition1 || condition2
		}
	}

	function std_mv(step, bound_check) {
		var target, moves=""
		for(target=position+step; bound_check(target) && gamestate[target]==' '; target+=step) {
			moves+=move(target)
		}
		if(owner(gamestate[target])==!player_number && bound_check(target)) {
			moves+=move(target)
		}

		return moves
	}

	var moves = ''
	var piece = gamestate[position]
	var p_name = ALGERBRAIC_NAMES.encoder[position]
	var target, offset

	if(owner(piece)==player_number) {

		if('FPE'.includes(piece)) {
			target=position-7
			if(pawn_diagonal(target, 8, 'e', wraps_right)) {
				moves+=move(target)
			}

			target=position-8
			if(gamestate[target]==' ') {
				moves+=move(target)

				if('F'==piece) {
					target=position-16
					if(gamestate[target]==' ') {
						moves+=move(target)
					}
				}
			}

			target=position-9
			if(pawn_diagonal(target, 8, 'e', wraps_left)) {
				moves+=move(target)
			}
		}

		if('fpe'.includes(piece)) {
			target=position+7
			if(pawn_diagonal(target, -8, 'E', wraps_left)) {
				moves+=move(target)
			}

			target=position+8
			if(gamestate[target]==' ') {
				moves+=move(target)

				if('f'==piece) {
					target=position+16

					if(gamestate[target]==' ') {
						moves+=move(target)
					}
				}
			}

			target=position+9
			if(pawn_diagonal(target, -8, 'E', wraps_right)) {
				moves+=move(target)
			}
		}

		if('Nn'.includes(piece)) {
			for(offset of [-17, -10, 6, 15]) {
				target=position+offset
				if(owner(gamestate[target])!=player_number && !wraps_left(position,target))
					moves+=move(target)
			}
			for(offset of [-15, 10, -6, 17]) {
				target=position+offset
				if(owner(gamestate[target])!=player_number && !wraps_right(position,target))
					moves+=move(target)
			}
		}

		if('QRCqrc'.includes(piece)) {
			moves+=std_mv(8, (target)=>target<64)
			moves+=std_mv(1, (target)=>same_row(position,target))
			moves+=std_mv(-8, (target)=>target>=0)
			moves+=std_mv(-1, (target)=>same_row(position,target))
		}

		if('QBqb'.includes(piece)) {
			moves+=std_mv(9, (target)=>!wraps_right(position,target))
			moves+=std_mv(7, (target)=>!wraps_left(position,target))
			moves+=std_mv(-9, (target)=>!wraps_left(position,target))
			moves+=std_mv(-7, (target)=>!wraps_right(position,target))
		}

		if('KkJj'.includes(piece)) {
			target=position-8
			if(target>=0 && owner(gamestate[target])!=player_number) {
				moves+=move(target)
			}

			target=position+8
			if(target<64 && owner(gamestate[target])!=player_number) {
				moves+=move(target)
			}

			for(target of [position-9, position-1, position+7]) {
				if(!wraps_left(position,target) && owner(gamestate[target])!=player_number) {
					moves+=move(target)
				}
			}

			for(target of [position-7, position+1, position+9]) {
				if(!wraps_right(position,target) && owner(gamestate[target])!=player_number) {
					moves+=move(target)
				}
			}
		}

		if('J'==piece) {
			if(gamestate.substring(61,64)=='  C') {
				moves+='E1H1*'
			}
			if(gamestate.substring(56,60)=='C   ') {
				moves+='E1A1*'
			}
		}

		if('j'==piece) {
			if(gamestate.substring(5,8)=='  c') {
				moves+='E8H8*'
			}
			if(gamestate.substring(0,4)=='c   ') {
				moves+='E8A8*'
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

export function doChessMove(gamestate, move, player_number, promotion_target) {
	var tmp_gst=(player_number==0)?gamestate.replaceAll('E','P'):gamestate.replaceAll('e','p')
	var new_gamestate=tmp_gst.split('')
	var origin=ALGERBRAIC_NAMES.decoder[move.substring(0,2)]
	var target=ALGERBRAIC_NAMES.decoder[move.substring(2,4)]
	var collateral

	if(new_gamestate[origin]=='F' && origin-target==16) {
		new_gamestate[target]='E'
		new_gamestate[origin]=' '
	}
	else if(new_gamestate[origin]=='P' && target<8) {
		new_gamestate[target]=promotion_target.p1[0].toUpperCase()
		new_gamestate[origin]=' '
	}
	else if(new_gamestate[origin]=='f' && target-origin==16) {
		new_gamestate[target]='e'
		new_gamestate[origin]=' '
	}
	else if(new_gamestate[origin]=='p' && target>=56) {
		new_gamestate[target]=promotion_target.p2[0].toLowerCase()
		new_gamestate[origin]=' '
	}
	else if(new_gamestate[origin]=='J' && move=='E1H1') {
		new_gamestate[62]='K'
		new_gamestate[60]=' '
		new_gamestate[61]='R'
		new_gamestate[63]=' '
	}
	else if(new_gamestate[origin]=='J' && move=='E1A1') {
		new_gamestate[58]='K'
		new_gamestate[60]=' '
		new_gamestate[59]='R'
		new_gamestate[56]=' '
	}
	else if(new_gamestate[origin]=='j' && move=='E8H8') {
		new_gamestate[6]='k'
		new_gamestate[4]=' '
		new_gamestate[5]='r'
		new_gamestate[7]=' '
	}
	else if(new_gamestate[origin]=='j' && move=='E8A8') {
		new_gamestate[2]='k'
		new_gamestate[4]=' '
		new_gamestate[3]='r'
		new_gamestate[0]=' '
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
