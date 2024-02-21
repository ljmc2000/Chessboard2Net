from aiohttp import web
from json import JSONDecodeError

@web.middleware
async def generic_error_handler(request,handler):
	try:
		await handler(request)
	except (KeyError, JSONDecodeError):
		return web.Response(status=400)
