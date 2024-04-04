import * as chess_set from './shared/chess-sets.js'

export function create_login_expiry()
{
	return new Date(new Date().valueOf()+2592000000) //30 days hence
}

export async function unlocked_sets(user, db) {
	var sets=[chess_set.DOODLES]

	if(false) {
		sets.push(chess_set.GOBLINS)
	}

	if(false) {
		sets.push(chess_set.TEATIME)
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
		logged_in: true,
	}
}
