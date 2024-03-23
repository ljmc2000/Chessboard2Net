import base85 from 'base85'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

import * as c from './constants.js '

function gen_login_token() {
	return base85.encode(randomBytes(40)).substring(0,48)
}

export default function (app,db_pool) {
	app.get('/api/test', (req, resp, on_error) => {
		res.send({working: true})
	})

	app.post('/api/login', async (req, resp, on_error) => {
		try {
			var result=await db_pool.query("select * from users where username=$1",[req.body.username])
			if(result.rowCount==1 && await bcrypt.compare(req.body.password,result.rows[0].passhash)) {
				var login_token = gen_login_token()
				var user_id=result.rows[0].user_id
				await db_pool.query("update users set login_token=$1 where user_id=$2",[login_token, user_id])
				resp.cookie(c.LOGIN_TOKEN,login_token)
				resp.status(200).send('')
			}
			else {
				resp.status(401).send('')
			}
		}
		catch(err) {
			on_error(err)
		}
	})

	app.post('/api/register', async (req, resp, on_error) => {

		try {
			var user_id = base85.encode(randomBytes(28)).substring(0,32)
			var password_salt = await bcrypt.genSalt()
			var passhash = await bcrypt.hash(req.body.password,password_salt)
			var login_token = gen_login_token()
			var result=await db_pool.query("insert into users (user_id, username, passhash, login_token) values ($1,$2,$3,$4)", [user_id, req.body.username, passhash, login_token])

			resp.cookie(c.LOGIN_TOKEN,login_token)
			resp.status(200).send('')
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
