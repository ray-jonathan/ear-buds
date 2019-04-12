const  Artists = require('../models/artists');
const axios = require('axios');
const escapeHtml = require('escape-html');


// Need way to get "req.session.searchArtist" in scope so we can run the API call.
// // Stupid idea, move this function to index.js and require Artists there too. Ugh.
async function searchArtist(req, res){
    // console.log('Wow!');
    const searchArtistName = encodeURIComponent(escapeHtml(req.body.searchArtist));
    // console.log("searchArtistName: ", searchArtistName);// req.body.searchArtist needs to be URL-ENCODED
    // console.log("Artist to remove: ", req.body.deleteMe);
    // console.log("Talking to the database: ");
    await Artists.removeArtist(req.body.deleteMe);
    // console.log("Moving onto polling Spotify: ");
    // console.log("TOKEN",req.session.passport.accessToken);
    const token = req.session.passport.accessToken;
    const header = {headers: {"Authorization" : 'Bearer ' + token}};
    const spotifyResult = await axios.get(`https://api.spotify.com/v1/search?q=${searchArtistName}&type=artist&limit=1`,
    // const spotifyResult = await axios.get(`https://api.spotify.com/v1/search?q=bjork&type=artist&limit=1`,
    header);
    // console.log("Double wow!");
    // console.log(spotifyResult.data.artists.items);
    await Artists.add1(req.session.userid, spotifyResult);
    res.redirect('/profile');
}

async function getTop3Artists(req, res, token){
    console.log("req.session.userid  ", req.session.userid);
    const header = {headers: {"Authorization" : 'Bearer ' + token}};
    const URL = "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=3";
    const spotifyResult = await axios.get(`${URL}`, header);
    // console.log(spotifyResult.data);
    // for(let i = 0; i < spotifyResult.data.items.length; i++) { // forEach and map were giving us headache, back to basics
    //     console.log(req.session.userid, spotifyResult.data.items[i]);
    // }
    await Artists.add3(req.session.userid, spotifyResult.data.items);
    res.redirect('/profile');
}


module.exports = {
    searchArtist,
    getTop3Artists
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
