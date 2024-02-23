import asyncio
import aiohttp
import database_stuff
import http_stuff

loop=asyncio.get_event_loop()
http_stuff.app.on_startup.append(database_stuff.on_startup)
http_stuff.connection_pool=database_stuff.connection_pool
loop.create_task(aiohttp.web._run_app(http_stuff.app))
[loop.create_task(ex) for ex in http_stuff.websocket_stuff.exports]
loop.run_forever()
