from os import environ as ENV
from psycopg_pool import AsyncConnectionPool

connection_pool = AsyncConnectionPool(f"host={ENV['CHESSBOARDNET_DATABASE_HOST']} dbname=chessboardnet user=chessboardnet password={ENV['CHESSBOARDNET_DATABASE_PASSWORD']}",open=False)

async def on_startup(app):
	await connection_pool.open()
