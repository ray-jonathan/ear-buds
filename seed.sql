insert into users
    (spotify_id, name, picture)
values
    (125272261, 'Matt Raines', 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/32948279_4020145898250_3548414607435497472_n.jpg?_nc_cat=106&_nc_ht=scontent.xx&oh=396bbd840a2f2bb10191c62193ef0eae&oe=5D3612B4'),
    ('jonathanray17', 'Jonathan Ray', 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/29597401_10160531264790500_2627134889546611401_n.jpg?_nc_cat=111&_nc_ht=scontent.xx&oh=d398bedbee5ae637db1e55571a28bd56&oe=5D04036B'),
    ('fakeUser1', 'Daenerys Targaryen', 'https://imgix.bustle.com/2017/5/26/93eccbe0-35a8-4eb0-a3c4-270c55105c2e.jpg?w=970&h=546&fit=crop&crop=faces&auto=format&q=70'),
    ('fakeUser2', 'Jon Snow', 'https://fsmedia.imgix.net/05/b0/0b/43/56f3/4497/8d96/3a6602bd5e28/jon-snow-has-a-bright-future-as-long-as-hes-chill-with-dating-his-aunt.jpeg?rect=0%2C0%2C940%2C471&auto=format%2Ccompress&dpr=2&w=650'),
    ('jjmurphy8', 'Joe Murphy', 'http://beverlycove.org/wp-content/uploads/2016/07/no-profile-male.jpg')
;

insert into artists
    (user_id, artist_name, artist_picture)
values
    (1, 'Post Malone', 'https://i.scdn.co/image/eafe36c75f37d5b65d2cf0eab5af57286389d72a'),
    (1, 'Judah & the Lion', 'https://i.scdn.co/image/26ad56fff918e598ea1e3eb51eb016c801b78814'),
    (1, 'Eminem', 'https://i.scdn.co/image/ed213a32e1327f3f2d7b2539eb1db57f55b68dbb'),
    (1, 'Kane Brown', 'https://i.scdn.co/image/af371900c335da8a6013702bdc7097c2937944ec'),
    (2, 'Slipknot', 'https://i.scdn.co/image/fb909c7935e98164c3316350540d3a4f4ee0178b'),
    (2, 'Teletubbies', 'https://i.scdn.co/image/318a49248edd7b6f9d8a815b2e7504ddaed77b04'),
    (2, 'John Mayer', 'https://i.scdn.co/image/f5496e2e528f2715933c774a136cc3a42d6f0803'),
    (2, 'Vanilla Ice', 'https://i.scdn.co/image/88b6d64c36631a5f7480327cc4ef54ef900e973d'),
    (3, 'Post Malone', 'https://i.scdn.co/image/eafe36c75f37d5b65d2cf0eab5af57286389d72a'),
    (3, 'Judah & the Lion', 'https://i.scdn.co/image/26ad56fff918e598ea1e3eb51eb016c801b78814'),
    (3, 'John Mayer', 'https://i.scdn.co/image/f5496e2e528f2715933c774a136cc3a42d6f0803'),
    (3, 'Kane Brown', 'https://i.scdn.co/image/af371900c335da8a6013702bdc7097c2937944ec'),
    (4, 'Kane Brown', 'https://i.scdn.co/image/af371900c335da8a6013702bdc7097c2937944ec'),
    (4, 'Vanilla Ice', 'https://i.scdn.co/image/88b6d64c36631a5f7480327cc4ef54ef900e973d'),
    (4, 'Slipknot', 'https://i.scdn.co/image/fb909c7935e98164c3316350540d3a4f4ee0178b'),
    (4, 'Judah & the Lion', 'https://i.scdn.co/image/26ad56fff918e598ea1e3eb51eb016c801b78814')
;

insert into matches 
    (current_user_id, viewed_user_id, liked, blocked)
values
    (1, 2, True, False),
    (1, 3, True, False),
    (2, 4, True, False)
;

insert into messages
    (matches_id, message, timestamp, user_id)
values
    (1, 'Dude, you have some serious musical ADD, but love me some John Mayer', '2017-12-30 21:00:09.622951', 1),
    (1, 'No way man, Vanilla Ice and Teletubbies make a great mashup!', '2017-12-30 23:00:09.622951', 2),
    (3, 'YOURE JON SNOW!', '2017-12-31 23:00:09.622951', 2),
    (3, 'You know nothing Jon Ray', '2017-12-31 23:04:09.622951', 4),
    (2, 'Hi i am dany!', 3),
    (2, 'hi dany, you rule the kingdom ok?', 1)
;