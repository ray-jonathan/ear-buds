require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const passport = require('passport');
// const refresh = require('passport-oauth2-refresh'); // NEW
const SpotifyStrategy = require('passport-spotify').Strategy;
const FileStore = require('session-file-store')(session);
const es6Renderer = require('express-es6-template-engine');
const escapeHtml = require('escape-html');
const helmet = require('helmet');
const axios = require('axios');
app.use(helmet());
app.use(express.urlencoded({extended:true}));

app.use(session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET
}));


app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

let bearerToken;
const matchRouter = require('./routes/match');
const messagesRouter = require('./routes/messages');
const profileRouter = require('./routes/profile');

const everyScope = ['user-read-private' , 'user-read-birthdate', 'user-read-email', 'playlist-read-private', 'user-library-read', 'user-library-modify', 'user-top-read', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private', 'user-follow-read', 'user-follow-modify', 'user-read-playback-state', 'user-read-currently-playing', 'user-modify-playback-state', 'user-read-recently-played'];
const PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;



passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


passport.use(
    new SpotifyStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: `https://earbuds.mattraines.dev/auth/callback/`
            // ,passReqToCallback: true // will pass the req body thru to the callback
        },
        async function(accessToken, refreshToken, expires_in, profile, done){
            // req.session.spotify = profile;
            process.nextTick(function() {
                // To keep the example simple, the user's spotify profile is returned to
                // represent the logged-in user. In a typical application, you would want
                // to associate the spotify account with a user record in your database,
                // and return that user instead.
                // console.log("============= TOKENS, EXPIRY =============");
                const scaryArray = [profile, accessToken, refreshToken];
                // console.log("acc: ", accessToken, "// ref: ", refreshToken, "// exp: ", expires_in);
                return done(null, scaryArray);
            });
        }
    )
);
// refresh.use(
//     new SpotifyStrategy(
//         {
//             clientID: CLIENT_ID,
//             clientSecret: CLIENT_SECRET,
//             callbackURL: `http://localhost:3007/auth/callback/`
//             // ,passReqToCallback: true // will pass the req body thru to the callback
//         },
//         async function(accessToken, refreshToken, expires_in, profile, done){
//             // req.session.spotify = profile;
//             process.nextTick(function() {
//                 // To keep the example simple, the user's spotify profile is returned to
//                 // represent the logged-in user. In a typical application, you would want
//                 // to associate the spotify account with a user record in your database,
//                 // and return that user instead.
//                 // console.log("============= TOKENS, EXPIRY =============");
//                 const scaryArray = [profile, accessToken, refreshToken];
//                 // console.log("acc: ", accessToken, "// ref: ", refreshToken, "// exp: ", expires_in);
//                 return done(null, scaryArray);
//             });
//         }
//     )
// );

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'))
// app.use(express.static(__dirname + '/public'));

// The middleware below checks that a user is logged in before they can proceed
// If they are not, they are sent to the login page to sign into Spotify
// The long conditional is to catch too-many-redirect-errors and traffic coming to/from
// Spotify's authentication servers.
app.use((req, res, next) => { 
    if ((!(req.session.passport)) && ((!(req.url !== "/")) || (!((req.url).includes("auth"))))){
        res.render('login', {
            partials:{
                headPartial: './partial-head'
                // ,navPartial: './partial-nav'
            }
        });
    }
    else{
        next();
    }
});

// refresh.requestNewAccessToken('spotify', 'some_refresh_token', function(err, accessToken, refreshToken) {
//     // You have a new access token, store it in the user object,
//     // or use it to make a new request.
//     // `refreshToken` may or may not exist, depending on the strategy you are using.
//     // You probably don't need it anyway, as according to the OAuth 2.0 spec,
//     // it should be the same as the initial refresh token.
//     console.log("Here's the inside");
// });


app.get('/', function (req, res) {
    res.redirect('/match');
});

app.get('/match', ensureAuthenticated, matchRouter);
app.post('/match', ensureAuthenticated, matchRouter);

app.get('/messages', ensureAuthenticated, messagesRouter);
app.get('/messages/*', ensureAuthenticated, messagesRouter);
app.post('/messages/*', ensureAuthenticated, messagesRouter);
app.post('/messages', ensureAuthenticated, messagesRouter);

app.get('/profile', ensureAuthenticated, profileRouter);
app.post('/profile', ensureAuthenticated, profileRouter);

app.get('/login', function(req, res) { // probably want to handle this with controller
    if (!(req.session.passport)){
    res.render('login', {
        locals: { 
            // user: req.session.passport.user 
        },
        partials:{
            headPartial: './partial-head'
        }
    });
    }
    else{
        res.redirect('/profile');
    }
});

app.get('/auth/spotify',
    passport.authenticate('spotify', {
        scope: everyScope,
        showDialog: true
    })
);

app.get(
    '/auth/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function(req, res) {
        req.session.passport.accessToken = req.session.passport.user[1];
        req.session.passport.refreshToken = req.session.passport.user[2];
        req.session.passport.user = req.session.passport.user[0];
        req.session.save(()=> {
            res.redirect('/profile');
        });
    }
);

app.get('/logout', function(req, res) { // probably want to handle this with controller
    req.logout();
    req.session.destroy(function(err) {
        // cannot access session here
    });
    res.redirect('/');
});

app.all('*', (req, res) => {
    res.render('404');
});

app.listen(PORT, () => {
    console.log(`listening to ${DB_HOST}:${PORT}`);
});



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
