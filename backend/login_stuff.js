import base85 from 'base85'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

import { Instruction as I } from './shared/constants.js'
import { create_login_expiry, unlocked_sets, user_info } from './utils.js'

function set_login_token(resp) {
	var expires = create_login_expiry()
	var token=base85.encode(randomBytes(40)).substring(0,48)
	resp.cookie(c.LOGIN_TOKEN,token, {httpOnly: true, secure: true, expires: expires}) //30 days
	return {token: token, expires: expires}
}

export default function (app, db) {

	app.get('/api/selfinfo', async (req, resp, on_error) => {
		try {
			var user = await db.get_user(req.cookies.login_token)
			if(user) {
				resp.json(await user_info(user))
			}
			else {
				resp.json({logged_in: false})
			}
		}
		catch(err) {
			on_error(err)
		}
	})

	app.get('/api/user/:username', async (req, resp, on_error) => {
		try {
			var result = await db.pool.query("select username, prefered_set, favourite_colour from users where username=$1",[req.params.username])
			if(result.rowCount!=0) {
				resp.json(result.rows[0])
			}
			else {
				resp.status(404).send('')
			}
		}
		catch(err) {
			on_error(err)
		}
	})

	app.post('/api/login', async (req, resp, on_error) => {
		try {
			var result=await db.pool.query("select * from users where username=$1",[req.body.username])
			if(result.rowCount==1 && await bcrypt.compare(req.body.password,result.rows[0].passhash)) {
				var login = set_login_token(resp)
				var user_id=result.rows[0].user_id
				await db.pool.query("update users set login_token=$1, login_expires=$2 where user_id=$3",[login.token, login.expires, user_id])
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
			var result = await db.pool.query("update users set login_token=null where login_token=$1",[req.cookies.login_token])
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
			var result=await db.pool.query("insert into users (user_id, username, passhash, login_token, login_expires) values ($1,$2,$3,$4,$5)", [user_id, req.body.username, passhash, login.token, login.expires])

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

	app.post('/api/update_prefered_set', async (req, resp, on_error) => {
		try {
			var user= await db.get_user(req.cookies.login_token)
			if(!user) {
				resp.status(401).send('')
			}

			var sets = await unlocked_sets(user)

			if(sets.includes(req.body.prefered_set)) {
				var result = await db.pool.query(`update users set prefered_set=$1 where login_token=$2`,[req.body.prefered_set, req.cookies.login_token])
				user.prefered_set=req.body.prefered_set
				if(result.rowCount!=0) {
					resp.status(200).send('')
					app.universe.emit(`${I.SINF} ${user.user_id}`, user)
				}
				else {
					resp.status(500).send('')
				}
			}
			else {
				resp.status(405).send('')
			}
		}
		catch(err) {
			on_error(err)
		}
	})

	app.post('/api/update_prefs', async (req, resp, on_error) => {
		try {
			var user= await db.get_user(req.cookies.login_token)
			if(!user) {
				resp.status(401).send('')
			}

			var success=true
			var result

			for(var col of ['profile_flags', 'favourite_colour']) {
				if(col in req.body) {
					result = await db.pool.query(`update users set ${col}=$1 where user_id=$2`,[req.body[col], user.user_id])
					user[col]=req.body[col]
					success &= result.rowCount>0
				}
			}

			resp.status(success?200:400).send('')
			app.universe.emit(`${I.SINF} ${user.user_id}`, user)
		}
		catch (err) {
			on_error(err)
		}
	})
}
