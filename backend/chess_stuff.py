import constants as c
import base64, random

from aiohttp.web import WebSocketResponse

in_progress_games={}

class ChessGame:

	game_id: str
	p1: str
	p2: str
	ws1: WebSocketResponse
	ws2: WebSocketResponse

	def __init__(self, p1, p2):
		self.game_id=base64.b85encode(random.randbytes(38)).decode()
		self.p1=p1
		self.p2=p2

	async def packet_handler(self, ws, data, user_id, username):
		match data[c.instr]:
			case c.surrender:
				winner=self.p1 if user_id==self.p2 else self.p2
				loser=user_id
				message={c.instr:c.game_end, c.winner: winner, c.endstate:c.surrender}

				await self.ws1.send_json(message)
				self.ws1.handler=empty_handler
				await self.ws2.send_json(message)
				self.ws2.handler=empty_handler

				return True
			case _:
				return False

async def empty_handler(ws, data, sender_id, sender_username):
	pass

def get_handler(ws, user_id):
	if (cg:=in_progress_games.get(user_id)) is not None:
		if cg.p1==user_id:
			cg.ws1=ws
		elif cg.p2==user_id:
			cg.ws2=ws
		return cg.packet_handler

	return empty_handler
