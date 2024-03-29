create table users (
	user_id character(32) primary key,
	username text,
	passhash character(60),
	login_token character(48),
	login_expires timestamp
);

create unique index case_insensitive_usernames on users (upper(username));

--grant select,insert,update on users
