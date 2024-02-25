import constants as c
import base64, random

from aiohttp.web import WebSocketResponse

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
				await self.ws2.send_json(message)
				raise GameOver(winner, loser, c.surrender)

class GameOver(Exception):
	winner: str
	loser: str
	endstate: str

	def __init__(self, winner, loser, endstate, *args, **kargs):
		super().__init__(*args, **kargs)
		self.winner=winner
		self.loser=loser
		self.endstate=endstate
