import constants as c

class ConnectionTable:
	connections={}
	userids_by_username={}

	def __init__(self):
		pass

	def get_connection(self, user_id, username=None):
		if user_id is None:
			user_id=self.userids_by_username.get(username)

		conn=self.connections.get(user_id)
		if conn is not None and not conn.closed:
			return conn

	def put_connection(self,connection, user_id, username):
		self.userids_by_username[username]=user_id
		self.connections[user_id]=connection

def okay(data):
	data[c.instr]+="_okay"
	return data
