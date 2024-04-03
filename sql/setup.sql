create table users (
	user_id character(32) primary key,
	username text,
	passhash character(60),
	login_token character(48),
	login_expires timestamp,

	profile_flags integer default 0,
	prefered_set integer default 0,
	favourite_colour integer default 16777215,

	current_gameid character(40),

	constraint no_spaces_in_usernames check (username !~ '\s')
);

create unique index case_insensitive_usernames on users (upper(username));

--grant select,insert,update on users
