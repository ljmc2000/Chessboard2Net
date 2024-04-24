import { PAGE_SIZE, UserProfileFlag } from './shared/constants.js'
import { page, user_info } from './utils.js'

export default function (app, db) {

	app.get('/api/game_log/:game_id', async (req, resp, on_error) => {
		try {
			var game = await db.pool.query("select * from game_logs_view where game_id=$1", [req.params.game_id])
			if(game.rowCount==1)
				resp.json(game.rows[0])
			else
				resp.status(404).send('')
		}
		catch(err) {
			on_error(err)
		}
	})

	app.get('/api/game_logs/:page', async (req, resp, on_error) => {
		try {
			var sql = "select game_id, game, conclusion, player1, player2, winner from game_logs_view"
			var parameters = [+req.params.page]

			if(req.query.username) {
				sql+= ` where player1->>'username'=$${parameters.length+1} or player2->>'username'=$${parameters.length+1}`
				parameters.push(req.query.username)
			}

			sql+=` limit ${PAGE_SIZE+1} offset $1*${PAGE_SIZE}`

			var games = await db.pool.query(sql, parameters)
			resp.json(page(games))
		}
		catch(err) {
			on_error(err)
		}
	})

	app.get('/api/list_users/:page', async (req, resp, on_error) => {
		try {
			var users = await db.pool.query(`select user_id, username, prefered_set, favourite_colour, current_gameid, current_gametype from users where (profile_flags & ${UserProfileFlag.VISIBLE_AS_ONLINE})!=0 limit ${PAGE_SIZE+1} offset $1*${PAGE_SIZE}`,[req.params.page])
			resp.json(page(users))
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
