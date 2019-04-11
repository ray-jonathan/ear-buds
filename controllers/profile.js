// functions for res.render-ing user info from routes

const  Profile = require('../models/profile');
const  Artists = require('../models/artists');

async function getProfile(req, res){
    const firstVisitBool = await Profile.checkSpotifyID(req.session.passport.user.id);
    if (!(firstVisitBool.exists)){
        await Profile.add(req.session.passport.user);
    }
    // by this time, the user is for sure in the db
    const user = await Profile.getBySpotifyId(req.session.passport.user.id);
    const userArrayOfArtists = await Artists.getArtists(user.id);
    req.session.userid = user.id;
    const emptyObject = {
        id: '',
        user_id: '',
        artist_name: 'Add an artist',
        artist_picture: 'http://secure.hmepowerweb.com/Resources/Images/NoImageAvailableLarge.jpg'
    };
    let artistIncompleter = false;
    if(userArrayOfArtists.length !== 4){
        artistIncompleter = true;
        while(userArrayOfArtists.length < 4){
            emptyObject.id = null;
            userArrayOfArtists.push(emptyObject);
            // console.log(emptyObject);
        }
        while(userArrayOfArtists.length > 4){
            userArrayOfArtists.pop();
        }
    }
    // render the profile page!
    function renderProfile(){
        res.render('profile.html', {
            locals: { 
                userId: user.id,
                userSpotifyId: user.spotifyId,
                userName: user.name,
                userPhoto: user.picture,
                userArtists: userArrayOfArtists,
                artistIncomplete: artistIncompleter,
                hideMe: false
            },
            partials:{
                headPartial: './partial-head'
            }
            });
            return;
    }
    renderProfile();
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

