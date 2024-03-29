import EventEmitter from 'node:events'

const users_by_id = {}
const users_by_username = {}

export const universe = new EventEmitter()

export function get_user_evloop_by_username(username) {
	return users_by_username[username]
}

export function get_user_evloop_by_id(user_id) {
	return users_by_id[user_id]
}

export function register_user_evloop(user) {
	var evloop = users_by_id[user.user_id]
	if(user!=undefined) {
		evloop=new EventEmitter()
		evloop.user=user;
		users_by_id[user.user_id]=evloop
		users_by_username[user.username]=evloop
	}

	return evloop
}
