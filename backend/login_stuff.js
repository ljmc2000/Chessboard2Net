import base85 from 'base85'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

import * as c from './constants.js '

function set_login_token(resp) {
	var login_token=base85.encode(randomBytes(40)).substring(0,48)
	resp.cookie(c.LOGIN_TOKEN,login_token, {httpOnly: true, secure: true, maxAge: 2592000}) //30 days
	return login_token
}

export default function (app,db_pool) {
	app.get('/api/test', (req, resp, on_error) => {
		res.send({working: true})
	})

	app.get('/api/selfinfo', async (req, resp, on_error) => {
		try {
			var result = await db_pool.query("select * from users where login_token=$1",[req.cookies.login_token])
			if(result.rowCount==1) {
				var user = result.rows[0]
				resp.json({
					user_id: user.user_id,
					username: user.username,
					logged_in: true,
				})
			}
			else {
				resp.json({logged_in: false})
			}
		}
		catch(err) {
			on_error(err)
		}
	})

	app.post('/api/login', async (req, resp, on_error) => {
		try {
			var result=await db_pool.query("select * from users where username=$1",[req.body.username])
			if(result.rowCount==1 && await bcrypt.compare(req.body.password,result.rows[0].passhash)) {
				var login_token = set_login_token(resp)
				var user_id=result.rows[0].user_id
				await db_pool.query("update users set login_token=$1 where user_id=$2",[login_token, user_id])
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
			var login_token = set_login_token(resp)
			var result=await db_pool.query("insert into users (user_id, username, passhash, login_token) values ($1,$2,$3,$4)", [user_id, req.body.username, passhash, login_token])

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
