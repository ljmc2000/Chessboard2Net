import { createHash } from 'crypto'
import { WebSocketServer } from 'ws'

import * as ev_stuff from './event_stuff.js'
import * as I from './shared/instructions.js'
import { user_info } from './utils.js'

function gen_gameId(p1,p2) {
	var hash = createHash('sha224')
	hash.update(p1)
	hash.update(p2)
	hash.update(new Date().toString())
	return hash.digest()
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '')
}

async function get_user(request, db) {
	var cookies = parse_cookies(request)
	if(!cookies.login_token){
		return null
	}

	return await db.get_user(cookies.login_token)
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

async function handle_private_packet(data, db, sender, sender_ws, target, target_ws) {
	switch(data.instr) {
		case I.ACLNG:
			if(sender.user_id==target.challenge.user_id) {
				var game_id = gen_gameId(sender.user_id, target.user_id)
				var result = await db.pool.query("update users set current_gameid=$1, current_gametype=$2 where user_id=$3 or user_id=$4",[game_id, target.challenge.game, sender.user_id, target.user_id])
				sender_ws.send(JSON.stringify({instr: I.IGME, game_id: game_id}))
				target_ws.send(JSON.stringify({instr: I.IGME, game_id: game_id}))
				delete target.challenge
			}
			break
		case I.CLNG:
			if(sender.user_id!=target.user_id) {
				var game=data.game.toLowerCase()
				sender.challenge={user_id: target.user_id, game: game}
				target_ws.send(JSON.stringify({instr: I.CLNG, sender: sender, game: game}))
			}
			else {
				sender_ws.send(JSON.stringify({instr: I.BUSY, target: target}))
			}
			break
		case I.TELL:
			var packet = JSON.stringify({instr: I.TELL, sender: sender, content:data.content, target: target, secret_message: true})
			target_ws.send(packet)
			if(target.user_id!=sender.user_id)
				sender_ws.send(packet)
			break
		case I.SRNDR:
			var result = await db.pool.query("update users set current_gameid=null, current_gametype=null where current_gameid=$1", [sender.current_gameid])
			sender_ws.send(JSON.stringify({instr: I.SRNDR, surrendering_party: sender.user_id}))
			break
		/*case I.SINF:
			sender_ws.send(JSON.stringify({instr: I.SINF, ...await user_info(sender)}))
			break*/
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
			if(sender.user_id==target.challenge.user_id) {
				target_ws.send(JSON.stringify({instr: I.XCLNG, sender: sender}))
				delete target.challenge
			}
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

export default (http_server, db) => {
	const ws_server = new WebSocketServer({noServer: true})

	http_server.on('upgrade', async (request, socket, head) => {
		socket.on('error', console.error);

		ws_server.handleUpgrade(request, socket, head, (ws) => {
			ws_server.emit('connection', ws, request)
		})
	})

	ws_server.on('connection', async (ws, request, client) => {
		var user=await get_user(request, db)
		ws.callbacks={}

		if(user==null) {
			ws.send(JSON.stringify({instr: I.AUTH}))
		}

		else {
			ev_stuff.register_user_ws(ws, user)

			ws.on('error', console.error)

			ws.on('message', async buffer=>{
				try {
					var data = JSON.parse(buffer)

					if(data.target==null) {
						ev_stuff.universe.emit(data.instr, data, user, ws)
					}
					else if (data.target==0) {
						await handle_private_packet(data, db, user, ws)
					}
					else {
						var target = ev_stuff.get_user_by_username(data.target)
						var target_ws = ev_stuff.get_user_ws_by_username(data.target)
						if(target_ws)
							await handle_private_packet(data, db, user, ws, target, target_ws)
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
			ws.send(JSON.stringify({instr: I.SINF, ...await user_info(user)}))
		}
	})
}
