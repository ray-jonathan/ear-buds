require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const passport = require('passport');
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
const everyScope = ['user-read-private' , 'user-read-birthdate', 'user-read-email', 'playlist-read-private', 'user-library-read', 'user-library-modify', 'user-top-read', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private', 'user-follow-read', 'user-follow-modify', 'user-read-playback-state', 'user-read-currently-playing', 'user-modify-playback-state', 'user-read-recently-played'];
const PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
console.log(PORT);
console.log(DB_HOST);


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
            callbackURL: `http://localhost:3007/callback/`
        },
        async function(accessToken, refreshToken, expires_in, profile, done){
            process.nextTick(function() {
                // To keep the example simple, the user's spotify profile is returned to
                // represent the logged-in user. In a typical application, you would want
                // to associate the spotify account with a user record in your database,
                // and return that user instead.
                // console.log("============= TOKENS, EXPIRY =============");
                bearerToken = accessToken;
                // console.log("acc: ", accessToken, "// ref: ", refreshToken, "// exp: ", expires_in);
                return done(null, profile);
            });
        }
    )
);

app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.end(`<h2>Hello world!</h2>`);
});

app.get('/account', ensureAuthenticated, function(req, res) {
    console.log("REQ.SESSION.PASSPORT.USER:");
    console.log(req.session.passport.user);
    res.render('account.html', {locals:{ user: req.session.passport.user}});
});

app.get('/login', function(req, res) {
    if (!(req.session.passport.user)){
    res.render('login', {
        locals: { 
            user: req.session.passport.user 
        }
    });
    }
    else{
        res.redirect('/account');
    }
});

app.get('/auth/spotify',
    passport.authenticate('spotify', {
        scope: everyScope,
        showDialog: true
    }),
    function(req, res) {
        req.session.save(()=> {});
      // The request will be redirected to spotify for authentication, so this
      // function will not be called.
    }
);

app.get(
    '/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/account');
    }
);

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
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