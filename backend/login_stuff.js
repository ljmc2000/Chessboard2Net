import base85 from 'base85'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

function gen_login_token() {
	return base85.encode(randomBytes(40)).substring(0,48)
}

export default function (app,db_pool) {
	app.get('/api/test', (req, res) => {
		res.send({working: true})
	})

	app.post('/api/register', async (req, res) => {
		var user_id = base85.encode(randomBytes(28)).substring(0,32)
		var password_salt = await bcrypt.genSalt()
		var passhash = await bcrypt.hash(req.body.password,password_salt)
		var login_token = gen_login_token()
		var result=db_pool.query("insert into users (user_id, username, passhash, login_token) values ($1,$2,$3,$4)", [user_id, req.body.username, passhash, login_token])

		res.status(200)
		res.send('')
	})
}
