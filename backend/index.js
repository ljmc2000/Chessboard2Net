const express = require('express')
const ws = require('ws')


const app = express()
const ws_server = new ws.WebSocketServer({noServer: true})
const http_server = app.listen(3000)


http_server.on('upgrade', (request, socket, head) => {
  socket.on('error', console.error);

  if(request.url==='/api/ws')
  {
    ws_server.handleUpgrade(request, socket, head, (ws) => {
      ws_server.emit('connection', ws, request)
    })
  }
})


ws_server.on('connection',(ws, request, client) => {
    ws.on('error', console.error);

    ws.on('message', (message) => {
      ws.send(JSON.stringify({message: 'There be gold in them thar hills.'}));
    })
  }
)

app.get('/api/test', (req, res) => {
  res.send({working: true})
})
