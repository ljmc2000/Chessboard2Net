import base64, bcrypt, random
import websocket_stuff

import constants as c

from aiohttp import web
from database_utils import *
from error_handling import generic_error_handler
from psycopg.errors import *

app = web.Application(middlewares=[generic_error_handler])
routes = web.RouteTableDef()

@routes.get('/api/info')
async def get_info(request):
	try:
		user_id, username=await get_user(request, db_connection_pool)

		return web.json_response({
			c.username:username,
			c.user_id:user_id,
			c.logged_in: True,
		})
	except NoLogin:
		return web.json_response({
			c.logged_in: False,
		})

@routes.post('/api/login')
async def login(request):
	data = await request.json()
	username=data[c.username]
	password=data[c.password]

	async with db_connection_pool.connection() as db:
		cur = await db.execute("select user_id, passhash from users where username=%s",(username,))
		async for user_id, passhash in cur:
			if bcrypt.checkpw(password.encode(),passhash.encode()):
				login_token=gen_login_token()
				await db.execute("update users set login_token=%s where user_id=%s",(login_token,user_id))
				resp = web.Response(status=200)
				resp.set_cookie(c.login_token, login_token, expires=60*60*24*30, samesite="Strict")
				return resp
		return web.Response(status=401)

@routes.post('/api/register')
async def register(request):
	data = await request.json()
	user_id=base64.b85encode(random.randbytes(25)).decode()
	username=data[c.username]
	password=data[c.password]
	passhash=bcrypt.hashpw(password.encode(),bcrypt.gensalt()).decode()
	login_token=gen_login_token()
	async with db_connection_pool.connection() as db:
		try:
			cur = await db.execute("insert into users (user_id, username, passhash, login_token) values (%s, %s, %s, %s)",(user_id, username, passhash, login_token))
		except UniqueViolation as e:
			return web.Response(status=409,text="Existing User Found")

	resp=web.Response(status=200)
	resp.set_cookie(c.login_token,login_token)
	return resp

@routes.get('/api/ws')
async def get_websocket(request):
	user_id, username=await get_user(request, db_connection_pool)
	return await websocket_stuff.new_connection(user_id, request)

app.add_routes(routes)
