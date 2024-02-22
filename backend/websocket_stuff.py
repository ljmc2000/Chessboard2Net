from asyncio import sleep
from aiohttp.web import WebSocketResponse

open_connections={}

async def new_connection(user_id, request):
	ws = WebSocketResponse()
	await ws.prepare(request)
	open_connections[user_id]=ws

	async for msg in ws:
		pass

	return ws

async def yoohoo():
	while True:
		for ws in open_connections.values():
			await ws.send_str("Connection open")

		await sleep(10)

exports=[yoohoo()]
