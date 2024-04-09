import { PlayerNumber } from './constants.js'

const IS_PLAYER1=/[A-Z]/
const IS_PLAYER2=/[a-z]/

export function owner(piece) {
	if(IS_PLAYER1.exec(piece))
		return PlayerNumber.ONE
	else if (IS_PLAYER2.exec(piece))
		return PlayerNumber.TWO
	else
		return PlayerNumber.INVALID
}
