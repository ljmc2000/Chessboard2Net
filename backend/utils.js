import { ChessSet } from './shared/constants.js'

export function create_login_expiry()
{
	return new Date(new Date().valueOf()+2592000000) //30 days hence
}

export async function unlocked_sets(user, db) {
	var sets=[ChessSet.DOODLES]

	if(false) {
		sets.push(ChessSet.GOBLINS)
	}

	if(false) {
		sets.push(ChessSet.TEATIME)
	}

	return sets
}

export async function user_info(user, db) {
	return {
		user_id: user.user_id,
		username: user.username,
		profile_flags: user.profile_flags,
		prefered_set: user.prefered_set,
		favourite_colour: user.favourite_colour,
		unlocked_sets: await unlocked_sets(user, db),
		current_gameid: user.current_gameid,
		current_gametype: user.current_gametype,
		logged_in: true,
	}
}
