import { UserProfileFlag } from './shared/constants.js'
import { user_info } from './utils.js'

export default function (app, db) {

	app.get('/api/game_logs/:page', async (req, resp, on_error) => {
		try {
			var sql = "select * from game_logs_view"
			var parameters = [+req.params.page]

			if(req.query.username) {
				sql+= ` where player1->>'username'=$${parameters.length+1} or player2->>'username'=$${parameters.length+1}`
				parameters.push(req.query.username)
			}

			sql+=" limit 50 offset $1*50"

			var games = await db.pool.query(sql, parameters)
			resp.json(games.rows)
		}
		catch(err) {
			on_error(err)
		}
	})

	app.get('/api/list_users/:page', async (req, resp, on_error) => {
		try {
			var users = await db.pool.query(`select user_id, username, prefered_set, favourite_colour, current_gameid, current_gametype from users where (profile_flags & ${UserProfileFlag.VISIBLE_AS_ONLINE})!=0 limit 50 offset $1*50`,[req.params.page])
			resp.json(users.rows)
		}
		catch(err) {
			on_error(err)
		}
	})

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
			var result = await db.pool.query(`select user_id, username, prefered_set, favourite_colour, current_gameid, current_gametype from users where (profile_flags & ${UserProfileFlag.VISIBLE_AS_ONLINE})!=0 and username=$1`,[req.params.username])
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
}
