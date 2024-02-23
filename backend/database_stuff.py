from os import environ as ENV
from psycopg_pool import AsyncConnectionPool

connection_pool = AsyncConnectionPool(f"host={ENV['CHESSBOARDNET_DATABASE_HOST']} dbname=chessboardnet user=chessboardnet password={ENV['CHESSBOARDNET_DATABASE_PASSWORD']}",open=False)

class NoLogin(Exception):
	pass

async def on_startup(app):
	await connection_pool.open()

async def get_user(login_token):
	async with connection_pool.connection() as db:
		cur = await db.execute("select user_id, username from users where login_token=%s",[login_token])

		async for user_id, username in cur:
			return user_id, username

	raise NoLogin
