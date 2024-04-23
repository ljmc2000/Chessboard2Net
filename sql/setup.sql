create type endstate as enum ('checkmate', 'stalemate', 'surrender');
create type gametype as enum ('chess', 'checkers');

create table users (
	user_id character(32) primary key,
	username text,
	passhash character(60),
	login_token character(48),
	login_expires timestamp,

	profile_flags integer default 0,
	unlocked_sets bit(2) default b'00',
	prefered_set integer,
	favourite_colour integer default 16777215,

	current_gameid character(38),
	current_gametype gametype,

	constraint no_spaces_in_usernames check (username !~ '\s')
);

create table game_logs (
	game_id character(38) primary key,
	game gametype,

	player1 character(32),
	player1_colour integer,
	player1_prefered_set integer,
	player2 character(32),
	player2_colour integer,
	player2_prefered_set integer,
	movelog varchar(18)[],
	ender character(32),
	conclusion endstate,

	foreign key (player1) references users(user_id),
	foreign key (player2) references users(user_id),
	foreign key (ender) references users(user_id)
);

create unique index case_insensitive_usernames on users (upper(username));

create or replace function unlock_set()
	returns trigger as
$$
begin
	update users set "unlocked_sets"=unlocked_sets |
		case
			when NEW.game='chess' then b'10'
			when NEW.game='checkers' then b'01'
		end
	where users.user_id=NEW.ender;
	return NEW;
end;
$$ language plpgsql;

create or replace trigger unlock_set_trigger after insert on game_logs
for each row
when (NEW.conclusion='checkmate')
execute function unlock_set();

--grant select,insert,update on users
--grant select,insert on game_logs
