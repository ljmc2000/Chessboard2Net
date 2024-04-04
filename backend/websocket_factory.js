import { WebSocket } from 'ws'

const user_wss_by_id = {}
const user_wss_by_username = {}
const users_by_id = {}
const users_by_username = {}

export function count_online_users() {
	var count=0;
	for(var user in user_wss_by_id) {
		if(user_wss_by_id[user].readyState==WebSocket.OPEN)
		{
			count++
		}
	}

	return count
}

export function get_user_by_username(username) {
	return users_by_username[username]
}

export function get_user_by_id(user_id) {
	return users_by_id[user_id]
}

export function get_user_ws_by_username(username) {
	var ws = user_wss_by_username[username]
	if(!ws)
		return null
		else if(ws.readyState!=WebSocket.OPEN)
			return null
			else
				return ws
}

export function get_user_ws_by_id(user_id) {
	var ws = user_wss_by_id[user_id]
	if(!ws)
		return null
		else if(ws.readyState!=WebSocket.OPEN)
			return null
			else
				return ws
}

export function register_user_ws(ws, user) {
	var old = user_wss_by_id[user.user_id]
	if(old) {
		old.close()
	}
	users_by_id[user.user_id]=user
	user_wss_by_id[user.user_id]=ws
	users_by_username[user.username]=user
	user_wss_by_username[user.username]=ws
}
