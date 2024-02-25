import constants as c

from asyncio import sleep
from aiohttp.web import WebSocketResponse
from aiosignal import Signal

class ConnectionTable:
	connections={}
	userids_by_username={}

	def __init__(self):
		pass

	def get_connection(self, user_id, username=None):
		if user_id is None:
			user_id=self.userids_by_username.get(username)

		conn=self.connections.get(user_id)
		if conn is not None and not conn.closed:
			return conn

	def put_connection(self,connection, user_id, username):
		self.userids_by_username[username]=user_id
		self.connections[user_id]=connection

open_connections=ConnectionTable()

async def default_handler(ws, msg, sender_id, sender_username):
	data=msg.json()
	target=open_connections.get_connection(
		data.get(c.target_id),
		data.get(c.target_username))

	match data[c.instr]:
		case c.echo:
			await ws.send_json(data)
		case c.tell:

			if not target is None:
				await target.send_json({
					c.sender_id: sender_id,
					c.sender_username: sender_username,
					**data})
			else:
				await ws.send_json({c.instr: c.error, c.content: "User not found"})


async def new_connection(user_id, username, request):
	ws = WebSocketResponse()
	handler=default_handler
	await ws.prepare(request)
	open_connections.put_connection(ws,user_id,username)

	async for msg in ws:
		try:
			await handler(ws, msg, user_id, username)
		except Exception as e:
			print(e)
			await ws.send_json({c.instr:c.error})

	return ws

exports=[]
