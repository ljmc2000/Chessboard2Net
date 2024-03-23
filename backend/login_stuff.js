import base85 from 'base85'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

import * as c from './constants.js '

function gen_login_token() {
	return base85.encode(randomBytes(40)).substring(0,48)
}

export default function (app,db_pool) {
	app.get('/api/test', (request, response, on_error) => {
		res.send({working: true})
	})

	app.post('/api/register', async (req, resp, on_error) => {

		try {
			var user_id = base85.encode(randomBytes(28)).substring(0,32)
			var password_salt = await bcrypt.genSalt()
			var passhash = await bcrypt.hash(req.body.password,password_salt)
			var login_token = gen_login_token()
			var result=await db_pool.query("insert into users (user_id, username, passhash, login_token) values ($1,$2,$3,$4)", [user_id, req.body.username, passhash, login_token])

			resp.cookie(c.LOGIN_TOKEN,login_token)
			resp.status(200)
			resp.send('')
		}
		catch (err) {
			if(err.constructor.name=='DatabaseError') {
				switch(err.code)
				{
					case '23505':
						resp.status(409).send('Existing User Found')
						break
					default:
						on_error(err)
				}
			}
			else {
				on_error(err)
			}
		}
	})
}
