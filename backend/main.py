import asyncio
import aiohttp
import database_stuff
import http_stuff
import session_stuff

loop=asyncio.get_event_loop()
http_stuff.app.on_startup.append(database_stuff.on_startup)
http_stuff.app.on_startup.append(session_stuff.on_startup)
http_stuff.connection_pool=database_stuff.connection_pool
loop.create_task(aiohttp.web._run_app(http_stuff.app))
loop.run_forever()
