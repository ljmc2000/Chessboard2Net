from aiohttp.web import middleware

@middleware
async def generic_error_handler(request,handler):
	try:
		await handler(request)
	except KeyError:
		return web.Response(status=400)
