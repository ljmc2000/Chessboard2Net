import constants as c

from aiohttp.web import WebSocketResponse
from aiosignal import Signal
from asyncio import Queue, sleep
from chess_stuff import ChessGame, GameOver
from json import JSONDecodeError
from websocket_utils import ConnectionTable, okay

in_progress_games={}
public_game_queue=Queue()
open_connections=ConnectionTable()

async def default_handler(ws, data, sender_id, sender_username):
	target=open_connections.get_connection(
		data.get(c.target_id),
		data.get(c.target_username))

	match data[c.instr]:
		case c.echo:
			await ws.send_json(data)
		case c.join_game:
			match data[c.queue]:
				case c.public:
					await public_game_queue.put(sender_id)
					await ws.send_json(okay(data))
		case c.tell:
			if not target is None:
				await target.send_json({
					c.sender_id: sender_id,
					c.sender_username: sender_username,
					**data})
			else:
				await ws.send_json({c.instr: c.error, c.content: "User not found"})

def get_handler(ws, user_id):
	if (cg:=in_progress_games.get(user_id)) is not None:
		if cg.p1==user_id:
			cg.ws1=ws
		else:
			cg.ws2=ws
		return cg.packet_handler

	return default_handler

async def new_connection(user_id, username, request):
	ws = WebSocketResponse()
	ws.handler=get_handler(ws, user_id)
	await ws.prepare(request)
	open_connections.put_connection(ws,user_id,username)

	async for msg in ws:
		try:
			data=msg.json()
			await ws.handler(ws, data, user_id, username)
		except JSONDecodeError:
			await ws.send_json({c.instr:c.error, c.content:"JSON Decoding Error"})
		except GameOver as e:
			ws.handler=default_handler
		except Exception as e:
			await ws.send_json({c.instr:c.error})
			raise e

	return ws

async def make_pairs(queue):
	while True:
		p1 = await queue.get()
		p2 = await queue.get()

		if p1==p2:
			queue.task_done()
			queue.task_done()
			continue

		cg= ChessGame(p1,p2)
		in_progress_games[p1]=cg
		in_progress_games[p2]=cg

		instr={c.instr:c.game_start, c.game_id:cg.game_id}
		if (c1:=open_connections.get_connection(p1)) is not None:
			c1.handler=cg.packet_handler
			cg.ws1=c1
			await c1.send_json(instr)
		if (c2:=open_connections.get_connection(p2)) is not None:
			c1.handler=cg.packet_handler
			cg.ws2=c2
			await c2.send_json(instr)

		queue.task_done()
		queue.task_done()


exports=[make_pairs(public_game_queue)]
