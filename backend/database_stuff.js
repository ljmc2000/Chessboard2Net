import pg from 'pg'

export const pool = new pg.Pool({
	user: 'chessboardnet',
	password: process.env.CHESSBOARDNET_DATABASE_PASSWORD,
	host: process.env.CHESSBOARDNET_DATABASE_HOST,
	database: 'chessboardnet',
	port:5432,
})

export async function get_user(login_token) {
	var result = await pool.query("select * from users where login_token=$1 and login_expires>now()",[login_token])

	if(result.rowCount==1)
		return result.rows[0]
	else
		return null
}

