create table users (
	user_id character(32) primary key,
	username text unique,
	passhash character(60)
);
