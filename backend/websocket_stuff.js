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
		case I.TELL:
			var packet = JSON.stringify({instr: I.TELL, sender: sender, content:data.content, target: target, secret_message: true})
			target_ws.send(packet)
			if(target.user_id!=sender.user_id)
				sender_ws.send(packet)
			break;
		case I.OUCNT:
			sender_ws.send(JSON.stringify({instr: I.OUCNT, count: ev_stuff.count_online_users()}))
			break;
	}
}

function subscribe_universe_evloop(ws, callbacks) {
	callbacks[I.TELL]=(data, sender, sender_ws)=>{
		ws.send(JSON.stringify({instr: I.TELL, sender: sender, content:data.content}))
	}
	ev_stuff.universe.on(I.TELL, callbacks[I.TELL])
}

function unsubscribe_universe_evloop(ws, callbacks) {
	ev_stuff.universe.removeListener(I.TELL, callbacks[I.TELL])
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
		var callbacks=[]
		if(user==null) {
			ws.send(JSON.stringify({instr: I.AUTH}))
		}
		else {
			ev_stuff.register_user_ws(ws, user)
			subscribe_universe_evloop(ws, callbacks)

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
				unsubscribe_universe_evloop(ws, callbacks)
			})
		}
	})


}
