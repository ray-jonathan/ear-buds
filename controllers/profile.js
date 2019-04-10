// functions for res.render-ing user info from routes

const  Profile = require('../models/profile');

async function getProfile(req, res){
    req.session.userId = req.session.passport.user.id;
    req.session.userName = req.session.passport.user.displayName;
    req.session.userPhoto = req.session.passport.user.photos[0];
    const boolValue = await Profile.checkSpotifyID(req.session.userId);
    console.log("BoolValue:", boolValue);
    console.log("BoolValue type:",typeof boolValue.exists);
    if (!boolValue.exists){
        console.log("We behaved.");
        await Profile.add(req.session.passport.user);
        res.render('profile.html', {
            locals: { 
                userId: req.session.userId,
                userName: req.session.userName,
                userPhoto: req.session.userPhoto
            },
            partials:{
                headPartial: './partial-head'
            }
        });
        return;
    }
    else if (boolValue.exists){
        console.log("Bad dog.");
        res.render('profile.html', {
        locals: { 
            userId: req.session.userId,
            userName: req.session.userName,
            userPhoto: req.session.userPhoto
        },
        partials:{
            headPartial: './partial-head'
        }
        });
        return;
    } 
}


module.exports = {
    getProfile
};

// // Notes on Axios:
// const axios = require('axios');
// axios.{{METHOD}}('{{URL}}').then((response)=>{console.log(response)});
// // example of GET and POST with options:
// axios.get('/user', {params: {ID: 12345}}).then(function (response) {console.log(response);}).catch(function (error) {console.log(error);});
// axios.post('/user', {firstName: 'Fred',lastName: 'Flintstone'}).then(function (response) {console.log(response);}).catch(function (error) {console.log(error);});
// // there's even support for Promise.All: https://www.npmjs.com/package/axios#user-content-example

// // API FRAMEWORK // //

// // Top three artists for logged-in user
// Endpoint: https://api.spotify.com/v1/me/top/{type}?time_range={time_range}&limit={limit}
// Type: artists
// Time Range: short_term
// Limit: 3
// Scopes: user-top-read
// Returns: Object
// Desired Info: Object.items[n] .name, .images[2].url

// // Lookup and add artist to list
// Endpoint: https://api.spotify.com/v1/search?q={Lucy%20Dacus}&type={artist}&limit={1}
// q: [Artist Name] (needs to be url-encoded)
// Type: artist
// Limit: 1
// Scopes: null
// Returns: Object
// Desired Info: Object.artists.items[n] .name, .images[2].url



// // DB FRAMEWORK // //

// // Update/Insert top_artists table 

