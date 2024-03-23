import express from 'express'
import pg from 'pg'
import {WebSocketServer} from 'ws'

import login_stuff from './login_stuff.js'
import websocket_stuff from './websocket_stuff.js'

const app = express()
const http_server = app.listen(3000)
const ws_server = new WebSocketServer({noServer: true})
const db_pool = new pg.Pool({
  user: 'chessboardnet',
  password: process.env.CHESSBOARDNET_DATABASE_PASSWORD,
  host: process.env.CHESSBOARDNET_DATABASE_HOST,
  database: 'chessboardnet',
  port:5432,
})
app.use(express.json())
login_stuff(app,db_pool)
websocket_stuff(http_server, ws_server)
