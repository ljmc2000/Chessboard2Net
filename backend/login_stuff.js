import base85 from 'base85'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

import * as c from './constants.js '
import { create_login_expiry } from './utils.js'

function set_login_token(resp) {
	var expires = create_login_expiry()
	var token=base85.encode(randomBytes(40)).substring(0,48)
	resp.cookie(c.LOGIN_TOKEN,token, {httpOnly: true, secure: true, expires: expires}) //30 days
	return {token: token, expires: expires}
}

export default function (app,db_pool) {
	app.get('/api/test', (req, resp, on_error) => {
		res.send({working: true})
	})

	app.get('/api/selfinfo', async (req, resp, on_error) => {
		try {
			var result = await db_pool.query("select * from users where login_token=$1 and login_expires>now()",[req.cookies.login_token])
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
				var login = set_login_token(resp)
				var user_id=result.rows[0].user_id
				await db_pool.query("update users set login_token=$1, login_expires=$2 where user_id=$3",[login.token, login.expires, user_id])
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

	app.get('/api/logout', async (req, resp, on_error) => {
		try {
			var result = await db_pool.query("update users set login_token=null where login_token=$1",[req.cookies.login_token])
			if(result.rowCount!=0)
				resp.status(200).send('')
			else
				resp.status(404).send('')
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
			var login = set_login_token(resp)
			var result=await db_pool.query("insert into users (user_id, username, passhash, login_token, login_expires) values ($1,$2,$3,$4,$5)", [user_id, req.body.username, passhash, login.token, login.expires])

			resp.status(200).send('')
		}
		catch (err) {
			if(err.constructor.name=='DatabaseError') {
				switch(err.code)
				{
					case '23505':
						resp.status(409).send('Existing User Found')
						break
					case '23514':
						resp.status(400).send('Provided credentials violate constraint')
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
