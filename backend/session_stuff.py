import base64
from os import environ as ENV
from aiohttp_session import setup, session_middleware
from aiohttp_session.cookie_storage import EncryptedCookieStorage

async def on_startup(app):
	secret_key=base64.urlsafe_b64decode(ENV["CHESSBOARDNET_SECRET_KEY"])
	setup(app, EncryptedCookieStorage(secret_key))
