import base64, bcrypt, random

from aiohttp import web
from aiohttp_session import get_session
from psycopg.errors import *

@web.middleware
async def generic_error_handler(request,handler):
	try:
		await handler(request)
	except KeyError:
		return web.Response(status=400)

app = web.Application(middlewares=[generic_error_handler])
routes = web.RouteTableDef()

@routes.get('/info')
async def get_info(request):
	session = await get_session(request)
	user_id=session.get("user_id")
	return web.json_response({
		"username":session.get("username"),
		"user_id":user_id,
		"logged_in": user_id is not None,
	})

@routes.post('/login')
async def login(request):
	session = await get_session(request)
	data = await request.json()
	username=data["username"]
	password=data["password"]

	async with connection_pool.connection() as db:
		cur = await db.execute("select user_id, passhash from users where username=%s",(username,))
		async for user_id, passhash in cur:
			if bcrypt.checkpw(password.encode(),passhash.encode()):
				session["user_id"]=user_id
				session["username"]=username
				return web.Response(status=200)
		return web.Response(status=401)

@routes.post('/register')
async def register(request):
	data = await request.json()
	user_id=base64.b85encode(random.randbytes(25)).decode()
	username=data["username"]
	passhash=bcrypt.hashpw(data["password"].encode(),bcrypt.gensalt()).decode()
	async with connection_pool.connection() as db:
		try:
			cur = await db.execute("insert into users (user_id, username, passhash) values (%s, %s, %s)",(user_id, username, passhash))
		except UniqueViolation as e:
			return web.Response(status=409,text="Existing User Found")

	return web.Response(status=200)

app.add_routes(routes)
