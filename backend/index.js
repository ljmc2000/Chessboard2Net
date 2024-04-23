import EventEmitter from 'node:events'
import cookie_parser from 'cookie-parser'
import express from 'express'

import * as db from './database_stuff.js'
import general_stuff from './general_stuff.js'
import login_stuff from './login_stuff.js'
import websocket_stuff from './websocket_stuff.js'


const app = express()
const http_server = app.listen(3000)

app.universe=new EventEmitter()

app.use(cookie_parser())
app.use(express.json())
general_stuff(app, db)
login_stuff(app, db)
websocket_stuff(app, http_server, db)
