import {WebSocketServer} from 'ws'

function parse_cookies(request) {
	var raw = request.headers.cookie
	var cookies = []
	for(var cookie of raw.split(`;`)) {
		let [ name, ...rest] = cookie.split(`=`)
		name = name?.trim()
		if (!name)
			continue
		const value = rest.join(`=`).trim()
		if (!value)
			continue
		cookies[name] = decodeURIComponent(value)
	}
	return cookies
}

async function verify_client(info, mark_safe)
{
	try {
		var cookies = parse_cookies(info.req)
		var result = await db_pool.query("select * from users where login_token=$1", [cookies.login_token])
		if(result.rowCount!=1) {
			mark_safe(false, 401, 'Unauthorized')
		}
		else {
			mark_safe(true)
		}
	}
	catch (ex) {
		console.error(ex)
	}
}

export default (http_server, db_pool) => {
	const ws_server = new WebSocketServer({noServer: true,
		verifyClient: async function(info, mark_safe)
		{
			try {
				var cookies = parse_cookies(info.req)
				var result = await db_pool.query("select * from users where login_token=$1", [cookies.login_token])
				if(result.rowCount!=1) {
					mark_safe(false, 401, 'Unauthorized')
				}
				else {
					mark_safe(true)
				}
			}
			catch (ex) {
				console.error(ex)
			}
		}
	})

	http_server.on('upgrade', async (request, socket, head) => {
		socket.on('error', console.error);

		ws_server.handleUpgrade(request, socket, head, (ws) => {
			ws_server.emit('connection', ws, request)
		})
	})

	ws_server.on('connection',(ws, request, client) => {
		ws.on('error', console.error);

		ws.on('message', (message) => {
			ws.send(JSON.stringify({message: 'There be gold in them thar hills.'}));
		})
	})


}
