import { WebSocket } from 'ws'

const user_wss_by_id = {}
const user_wss_by_username = {}

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

export function register_user_ws(ws) {
	var old = user_wss_by_id[ws.user.user_id]
	if(old) {
		old.close()
	}
	user_wss_by_id[ws.user.user_id]=ws
	user_wss_by_username[ws.user.username]=ws
}
