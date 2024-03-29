export function create_login_expiry()
{
	return new Date(new Date().valueOf()+2592000000) //30 days hence
}
