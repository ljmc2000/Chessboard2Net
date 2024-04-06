import { createHash } from 'crypto'
import { WebSocketServer } from 'ws'

import * as ws_factory from './websocket_factory.js'
import * as I from './shared/instructions.js'
import * as GAME from './shared/games.js'
import * as SCOPE from './shared/scope.js'
import { GAME_MESSAGE, ChessGame, CheckersGame, NullGame } from './game.js'
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

function callback_for(ws, callback) {
	switch(callback)
	{
		case I.TELL:
			return (data, sender_ws) => {
				ws.send(JSON.stringify({instr: I.TELL, sender: sender_ws.user, content:data.content}))
			}
	}
}

export default (app, http_server, db) => {
	const ws_server = new WebSocketServer({noServer: true})
	const games = {}

	function subscribe_universe(ws, callback) {
		if(!ws.callbacks[callback])
		{
			var func = callback_for(ws, callback)
			app.universe.on(callback, func)
			ws.callbacks[callback]=func
			ws.send(JSON.stringify({instr: I.SUB, callback: callback}))
		}
	}

	function subscribe_universe_x(ws, callback, func) {
		if(!ws.callbacks[callback])
		{
			app.universe.on(callback, func)
			ws.callbacks[callback]=func
		}
	}

	function unsubscribe_universe(ws, cb) {
		if(ws.callbacks[callback])
		{
			app.universe.removeListener(cb, callbacks[cb])
			delete ws.callbacks[cb]
			ws.send(JSON.stringify({instr: I.UNSUB, callback: callback}))
		}
	}

	async function get_game(user) {
		if(!user.current_gameid) {
			return NullGame
		}

		var game = games[user.current_gameid]
		if(!game) {
			switch(user.game_type) {
				case GAME.CHECKERS:
					game=new CheckersGame()
					break
				case GAME.CHESS:
					game=new ChessGame()
					break
			}

			game.game_id=user.current_gameid
			game.player1_id=user.user_id

			game.onend=async function() {
				var result = await db.pool.query("update users set current_gameid=null, current_gametype=null where current_gameid=$1", [this.game_id])

				this.emit(GAME_MESSAGE, {instr: I.GOVER})
			}

			games[user.current_gameid]=game
		}

		return game
	}

	async function handle_private_packet(data, ws) {
		switch(data.instr) {
			case I.SINF:
				var result = await db.pool.query("select * from users where user_id=$1",[ws.user.user_id])
				ws.user=result.rows[0]
				ws.send(JSON.stringify({instr: I.SINF, ...await user_info(ws.user)}))
				break
			case I.SUB:
				subscribe_universe(ws, data.callback)
				break
			case I.OUCNT:
				ws.send(JSON.stringify({instr: I.OUCNT, count: ws_factory.count_online_users()}))
				break
			case I.UNSUB:
				unsubscribe_universe(ws, data.callback)
				break
			default:
				ws.send(JSON.stringify({instr: I.ERR}))
		}
	}

	async function handle_direct_packet(data, sender_ws, target_ws) {
		switch(data.instr) {
			case I.ACLNG:
				if(sender_ws.user.user_id==target_ws.user.challenge.user_id) {
					var game_id = gen_gameId(sender_ws.user.user_id, target_ws.user.user_id)
					var result = await db.pool.query("update users set current_gameid=$1, current_gametype=$2 where user_id=$3 or user_id=$4",[game_id, target_ws.user.challenge.game, sender_ws.user.user_id, target_ws.user.user_id])

					sender_ws.user.current_gameid=game_id
					sender_ws.user.current_gametype=target_ws.user.challenge.game
					sender_ws.send(JSON.stringify({instr: I.SINF, ...sender_ws.user}))
					target_ws.user.current_gameid=game_id
					target_ws.user.current_gametype=target_ws.user.challenge.game
					target_ws.send(JSON.stringify({instr: I.SINF, ...target_ws.user}))

					delete target_ws.user.challenge
				}
				break
			case I.CLNG:
				if(sender_ws.user.user_id!=target_ws.user.user_id) {
					var game=data.game.toLowerCase()
					sender_ws.user.challenge={user_id: target_ws.user.user_id, game: game}
					target_ws.send(JSON.stringify({instr: I.CLNG, sender: sender_ws.user, game: game}))
				}
				else {
					sender_ws.send(JSON.stringify({instr: I.BUSY, target: target}))
				}
				break
			case I.TELL:
				var packet = JSON.stringify({instr: I.TELL, sender: sender_ws.user, content:data.content, target: target_ws.user, secret_message: true})
				target_ws.send(packet)
				if(target_ws.user.user_id!=sender_ws.user.user_id)
					sender_ws.send(packet)
					break
			case I.XCLNG:
				if(sender_ws.user.user_id==target_ws.user.challenge.user_id) {
					target_ws.send(JSON.stringify({instr: I.XCLNG, sender: sender_ws.user}))
					delete target_ws.user.challenge
				}
				break
			default:
				ws.send(JSON.stringify({instr: I.ERR}))
		}
	}

	function onsinf(ws) {
		return async function(user) {
			ws.user=user
			ws.send(JSON.stringify({instr: I.SINF, ...await user_info(user)}))
		}
	}

	http_server.on('upgrade', async (request, socket, head) => {
		socket.on('error', console.error);

		ws_server.handleUpgrade(request, socket, head, (ws) => {
			ws_server.emit('connection', ws, request)
		})
	})

	ws_server.on('connection', async (ws, request, client) => {
		ws.user=await get_user(request, db)
		if(ws.user==null) {
			ws.send(JSON.stringify({instr: I.AUTH}))
		}

		else {
			ws.callbacks={}
			ws.send(JSON.stringify({instr: I.SINF, ...await user_info(ws.user)}))
			ws_factory.register_user_ws(ws)
			subscribe_universe_x(ws, `${I.SINF} ${ws.user.user_id}`, onsinf(ws))

			ws.game=await get_game(ws.user)
			ws.game.on(GAME_MESSAGE,(message)=>ws.send(JSON.stringify(message)))

			ws.on('error', console.error)

			ws.on('message', async buffer=>{
				try {
					var data = JSON.parse(buffer)

					switch(data.scope) {
						case SCOPE.PRIVATE:
							await handle_private_packet(data, ws)
							break
						case SCOPE.DIRECT:
							var target_ws = ws_factory.get_user_ws_by_username(data.target)
							if(target_ws)
								await handle_direct_packet(data, ws, target_ws)
								else
									ws.send(JSON.stringify({instr: I.NOPLR, target: data.target}))
						case SCOPE.GAME:
							await ws.game.onmessage(data, ws)
							break
						case SCOPE.UNIVERSE:
							app.universe.emit(data.instr, data, ws)
							break
						default:
							ws.send(JSON.stringify({instr: I.NOSCP, ...data}))
					}
				}
				catch (err) {
					console.error(err)
					ws.send(JSON.stringify({instr: 'error'}))
				}
			})

			ws.on('close',()=>{
				for(var cb in ws.callbacks)
					app.universe.removeListener(cb, ws.callbacks[cb])
			})

			ws.send(JSON.stringify({instr: I.READY}))
		}
	})
}
