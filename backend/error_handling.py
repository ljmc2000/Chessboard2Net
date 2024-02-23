from aiohttp import web
from database_utils import NoLogin
from json import JSONDecodeError

@web.middleware
async def generic_error_handler(request,handler):
	try:
		return await handler(request)
	except (KeyError, JSONDecodeError):
		return web.Response(status=400)
	except NoLogin:
		return web.Response(status=401)
