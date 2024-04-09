import { PlayerNumber } from './constants.js'

const IS_PLAYER1=/[A-Z]/
const IS_PLAYER2=/[a-z]/

export function generate_algerbraic_names() {
	const x_names="ABCDEFGH"
	var rainbow_table = []
	for(var y=8; y>=0; y--) {
		for(var x=0; x<8; x++) {
			rainbow_table.push(`${x_names[x]}${y}`)
		}
	}
	return rainbow_table
}

export function owner(piece) {
	if(IS_PLAYER1.exec(piece))
		return PlayerNumber.ONE
	else if (IS_PLAYER2.exec(piece))
		return PlayerNumber.TWO
	else
		return PlayerNumber.INVALID
}

export function wraps_left(position, target) {
	return (position%8)<(target%8)
}
export function wraps_right(position, target) {
	return (position%8)>(target%8)
}
