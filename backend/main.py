import base64, bcrypt, random

from aiohttp import web
from aiohttp_session import setup, get_session, session_middleware
from aiohttp_session.cookie_storage import EncryptedCookieStorage
from cryptography import fernet
from os import environ as ENV
from psycopg.errors import *
from psycopg_pool import AsyncConnectionPool

app = web.Application()
routes = web.RouteTableDef()
connection_pool = AsyncConnectionPool(f"host={ENV['CHESSBOARDNET_DATABASE_HOST']} dbname=chessboardnet user=chessboardnet password={ENV['CHESSBOARDNET_DATABASE_PASSWORD']}",open=False)

fernet_key = fernet.Fernet.generate_key()
secret_key = base64.urlsafe_b64decode(fernet_key)
setup(app, EncryptedCookieStorage(secret_key))

async def on_startup(app):
	await connection_pool.open()

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

app.on_startup.append(on_startup)
app.add_routes(routes)
web.run_app(app)
