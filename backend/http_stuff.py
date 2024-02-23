import base64, bcrypt, random
import websocket_stuff

import constants as c

from aiohttp import web
from aiohttp_session import get_session, new_session
from error_handling import generic_error_handler
from psycopg.errors import *

app = web.Application(middlewares=[generic_error_handler])
routes = web.RouteTableDef()

@routes.get('/api/info')
async def get_info(request):
	session = await get_session(request)
	user_id=session.get(c.user_id)

	return web.json_response({
		c.username:session.get(c.username),
		c.user_id:user_id,
		c.logged_in: user_id is not None,
	})

@routes.post('/api/login')
async def login(request):
	session = await new_session(request)
	data = await request.json()
	username=data[c.username]
	password=data[c.password]

	async with connection_pool.connection() as db:
		cur = await db.execute("select user_id, passhash from users where username=%s",(username,))
		async for user_id, passhash in cur:
			if bcrypt.checkpw(password.encode(),passhash.encode()):
				session[c.user_id]=user_id
				session[c.username]=username
				return web.Response(status=200)
		return web.Response(status=401)

@routes.post('/api/register')
async def register(request):
	data = await request.json()
	user_id=base64.b85encode(random.randbytes(25)).decode()
	username=data[c.username]
	password=data[c.password]
	passhash=bcrypt.hashpw(password.encode(),bcrypt.gensalt()).decode()
	async with connection_pool.connection() as db:
		try:
			cur = await db.execute("insert into users (user_id, username, passhash) values (%s, %s, %s)",(user_id, username, passhash))
		except UniqueViolation as e:
			return web.Response(status=409,text="Existing User Found")

	return web.Response(status=200)

@routes.get('/api/ws')
async def get_websocket(request):
	try:
		session = await get_session(request)
		user_id = session[c.user_id]
	except KeyError:
		return web.Response(status=401)

	return await websocket_stuff.new_connection(user_id, request)

app.add_routes(routes)
