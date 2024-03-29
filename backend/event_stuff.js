import EventEmitter from 'node:events'
import { WebSocket } from 'ws'

const users_by_id = {}
const users_by_username = {}

export const universe = new EventEmitter()

export function get_user_ws_by_username(username) {
	var ws = users_by_username[username]
	if(!ws)
		return null
	else if(ws.readyState!=WebSocket.OPEN)
		return null
	else
		return ws
}

export function get_user_ws_by_id(user_id) {
	var ws = users_by_id[user_id]
	if(!ws)
		return null
	else if(ws.readyState!=WebSocket.OPEN)
		return null
	else
		return ws
}

export function register_user_ws(ws, user) {
	var old = users_by_id[user.user_id]
	if(ws && ws.readyState!=WebSocket.OPEN) {
		ws.close()
	}
	users_by_id[user.user_id]=ws
	users_by_username[user.username]=ws
	ws.user=user;
}
