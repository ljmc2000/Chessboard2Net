export default (http_server, ws_server) => {
	http_server.on('upgrade', (request, socket, head) => {
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
