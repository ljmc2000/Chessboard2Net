import {WebSocketServer} from 'ws'
import * as ev_stuff from './event_stuff.js'
import * as I from './shared/instructions.js'

async function get_user(request, db_pool) {
	var cookies = parse_cookies(request)
	if(!cookies.login_token){
		return null
	}

	var db_result = await db_pool.query("select * from users where login_token=$1 and login_expires>now()", [cookies.login_token])

	if(db_result.rowCount!=1) {
		return null
	}
	else {
		return {
			user_id: db_result.rows[0].user_id,
			username: db_result.rows[0].username,
		}
	}
}

function parse_cookies(request) {
	var raw = request.headers.cookie
	if(!raw)
		return {}

	var cookies = {}
	for(var cookie of raw.split(`;`)) {
		let [ name, ...rest] = cookie.split(`=`)
		name = name?.trim()
		if (!name)
			continue
		const value = rest.join(`=`).trim()
		if (!value)
			continue
		cookies[name] = decodeURIComponent(value)
	}
	return cookies
}

function handle_private_packet(data, sender, sender_ws, target, target_ws) {
	switch(data.instr) {
		case I.CLNG:
			if(sender_ws.challenger) {
				sender_ws.send(JSON.stringify({instr: I.BUSY, target: sender.challenger}))
			}
			else if(target_ws.challenger) {
				sender_ws.send(JSON.stringify({instr: I.BUSY}))
			}
			else {
				target_ws.challenger=sender
				sender_ws.challenger=target
				target_ws.send(JSON.stringify({instr: I.CLNG, sender: sender, game: data.game}))
			}
			break
		case I.TELL:
			var packet = JSON.stringify({instr: I.TELL, sender: sender, content:data.content, target: target, secret_message: true})
			target_ws.send(packet)
			if(target.user_id!=sender.user_id)
				sender_ws.send(packet)
			break
		case I.SUB:
			subscribe_universe_evloop(sender_ws, data.callback)
			break
		case I.OUCNT:
			sender_ws.send(JSON.stringify({instr: I.OUCNT, count: ev_stuff.count_online_users()}))
			break
		case I.UNSUB:
			unsubscribe_universe_evloop(sender_ws, data.callback)
			break
		case I.XCLNG:
			if(sender.user_id==target_ws.challenger.user_id) {
				target_ws.send(JSON.stringify({instr: I.XCLNG, sender: sender}))
				delete target_ws.challenger
			}
			delete sender_ws.challenger
			break
	}
}

function callback_for(ws, callback) {
	switch(callback)
	{
		case I.TELL:
			return (data, sender, sender_ws) => {
				ws.send(JSON.stringify({instr: I.TELL, sender: sender, content:data.content}))
			}
	}
}

function subscribe_universe_evloop(ws, callback) {
	if(!ws.callbacks[callback])
	{
		var func = callback_for(ws, callback)
		ev_stuff.universe.on(callback, func)
		ws.callbacks[callback]=func
		ws.send(JSON.stringify({instr: I.SUB, callback: callback}))
	}
}

function unsubscribe_universe_evloop(ws, cb) {
	if(ws.callbacks[callback])
	{
		ev_stuff.universe.removeListener(cb, callbacks[cb])
		delete ws.callbacks[cb]
		ws.send(JSON.stringify({instr: I.UNSUB, callback: callback}))
	}
}

export default (http_server, db_pool) => {
	const ws_server = new WebSocketServer({noServer: true})

	http_server.on('upgrade', async (request, socket, head) => {
		socket.on('error', console.error);

		ws_server.handleUpgrade(request, socket, head, (ws) => {
			ws_server.emit('connection', ws, request)
		})
	})

	ws_server.on('connection', async (ws, request, client) => {
		var user=await get_user(request, db_pool)
		ws.callbacks={}

		if(user==null) {
			ws.send(JSON.stringify({instr: I.AUTH}))
		}

		else {
			ev_stuff.register_user_ws(ws, user)

			ws.on('error', console.error)

			ws.on('message', buffer=>{
				try {
					var data = JSON.parse(buffer)

					if(data.target==null) {
						ev_stuff.universe.emit(data.instr, data, user, ws)
					}
					else if (data.target==0) {
						handle_private_packet(data, user, ws)
					}
					else {
						var target = ev_stuff.get_user_by_username(data.target)
						var target_ws = ev_stuff.get_user_ws_by_username(data.target)
						if(target_ws)
							handle_private_packet(data, user, ws, target, target_ws)
						else
							ws.send(JSON.stringify({instr: I.NOPLR, target: data.target}))
					}
				}
				catch (err) {
					console.error(err)
					ws.send(JSON.stringify({instr: 'error'}))
				}
			})

			ws.on('close',()=>{
				for(var cb in ws.callbacks)
					ev_stuff.universe.removeListener(cb, ws.callbacks[cb])
			})

			ws.send(JSON.stringify({instr: I.READY}))
		}
	})
}
