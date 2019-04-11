const  Artists = require('../models/artists');
const axios = require('axios');


// Need way to get "req.session.searchArtist" in scope so we can run the API call.
// // Stupid idea, move this function to index.js and require Artists there too. Ugh.
async function searchArtist(){
    console.log('Wow!');
    console.log("searchArtistName: ", req.session.searchArtist);
    const spotifyResult = await axios.get(`https://api.spotify.com/v1/search?q=${(searchArtistName)}&type=artist&limit=1`);
    console.log("Double wow!");
    await Artists.add(spotifyResult);
    res.redirect('/profile');
}



module.exports = {
    searchArtist
};


// // Notes on Axios:
// const axios = require('axios');
// axios.{{METHOD}}('{{URL}}').then((response)=>{console.log(response)});
// example of GET and POST with options:
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
