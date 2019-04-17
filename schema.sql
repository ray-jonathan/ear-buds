-- users table // dropped email as it isn't in scope of MVP
-- id, name, picture

-- top_artists table // score might be dropped as it isn't necessary- if artist is in table, they're in their top 4
-- id, user_id[FK], artist_picture, score(?)

-- matches table // renamed "matched" column to "liked" in anticipation of extending features after MVP
-- id, current_user_id(person making the match)[FK], viewed_user_id(profile they viewed)[FK], liked(bool, no default), blocked(default = False) // https://forum.openoffice.org/en/forum/viewtopic.php?t=67839, https://stackoverflow.com/questions/32622252/join-on-two-foreign-keys-from-same-table-in-sql

-- messages table
-- id, matches_id[FK], message, timestamp, user_id[FK]

create table users (
    id serial primary key,
    spotify_id varchar (200),
    name varchar (200),
    picture varchar (500),
    last_vist bigint default extract(epoch from now()) * 1000
);

create table artists (
    id serial primary key,
    user_id integer references users(id),
    artist_name varchar(200),
    artist_picture varchar(500),
    artist_track_url varchar(500) default ('https://p.scdn.co/mp3-preview/22bf10aff02db272f0a053dff5c0063d729df988?cid=774b29d4f13844c495f206cafdad9c86')
);

create table matches (
    id serial primary key,
    current_user_id integer references users(id),
    viewed_user_id integer references users(id),
    liked boolean default null,
    blocked boolean default False
);

create table messages (
    id serial primary key,
    matches_id integer references matches(id),
    message varchar(1000),
    timestamp bigint default extract(epoch from now()) * 1000,
    user_id integer references users(id)
);