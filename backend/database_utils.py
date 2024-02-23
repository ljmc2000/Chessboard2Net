import base64, random
import constants as c

class NoLogin(Exception):
	pass

def gen_login_token():
	return base64.b85encode(random.randbytes(38)).decode()


async def get_user(request, connection_pool):
	login_token=request.cookies.get(c.login_token)
	async with connection_pool.connection() as db:
		cur = await db.execute("select user_id, username from users where login_token=%s",[login_token])

		async for user_id, username in cur:
			return user_id, username

	raise NoLogin
