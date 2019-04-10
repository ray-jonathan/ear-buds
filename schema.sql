-- users table // dropped email as it isn't in scope of MVP
-- id, name, picture

-- top_artists table // score might be dropped as it isn't necessary- if artist is in table, they're in their top 4
-- id, user_id[FK], artist_picture, score(?)

-- matches table // renamed "matched" column to "liked" in anticipation of extending features after MVP
-- id, current_user_id(person making the match)[FK], viewed_user_id(profile they viewed)[FK], liked(bool, no default), blocked(default = False) // https://forum.openoffice.org/en/forum/viewtopic.php?t=67839, https://stackoverflow.com/questions/32622252/join-on-two-foreign-keys-from-same-table-in-sql

-- messages table
-- id, matches_id[FK], message, timestamp, user_id[FK]