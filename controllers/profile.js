// functions for res.render-ing user info from routes

// const  Profile = require('../models/profile');

async function getProfile(req, res){
    res.render('profile.html', {
        locals: { 
            user: req.session.passport.user
        },
        partials:{
            headPartial: './partial-head'
        }
    });
}


module.exports = {
    getProfile
};


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

