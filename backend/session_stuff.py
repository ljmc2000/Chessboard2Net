import redis
from os import environ as ENV
from aiohttp_session import setup, session_middleware
from aiohttp_session.redis_storage import RedisStorage

async def on_startup(app):
	setup(app, RedisStorage(redis.asyncio.Redis(), max_age=60*60*24*30))
