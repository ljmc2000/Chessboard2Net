import { PAGE_SIZE, ChessSet, UserProfileFlag } from './shared/constants.js'

export function create_login_expiry()
{
	return new Date(new Date().valueOf()+2592000000) //30 days hence
}

export function page(data) {
	return {data: data.rows.slice(0,PAGE_SIZE), is_last: data.rowCount<=PAGE_SIZE}
}

export function unlocked_sets(user) {
	var sets=[ChessSet.DOODLES]

	for(var i=0; i<user.unlocked_sets.length; i++) {
		if(user.unlocked_sets[i]=='1') {
			sets.push(user.unlocked_sets.length-1-i)
		}
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
		unlocked_sets: unlocked_sets(user),
		current_gameid: user.current_gameid,
		current_gametype: user.current_gametype,
		hidden_profile: 0!=(user.profile_flags & UserProfileFlag.VISIBLE_AS_ONLINE),
		logged_in: true,
	}
}
