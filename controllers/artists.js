const  Artists = require('../models/artists');
const axios = require('axios');
const escapeHtml = require('escape-html');


async function searchArtist(req, res){
    const searchArtistName = encodeURIComponent(escapeHtml(req.body.searchArtist));
    await Artists.removeArtist(req.body.deleteMe);
    const token = req.session.passport.accessToken;
    const header = {headers: {"Authorization" : 'Bearer ' + token}};
    let spotifyResult = await axios.get(`https://api.spotify.com/v1/search?q=${searchArtistName}&type=artist&limit=1`, header)
    .catch(async (e) => { // Should solve Spotify 401 (Access Token Expired) issues 
        console.log(e);
        spotifyResult.data.artists.items[0].name, spotifyResult.data.artists.items[0].images[0].url
        spotifyResult = 
        {data: {
            artists: {
                items: [ {
                    name: 'Rick Astley',
                    images: ['https://i.ytimg.com/vi/hAq443fhyDo/maxresdefault.jpg']
                }]
            }
        }};
        artist_track_url = 'https://p.scdn.co/mp3-preview/22bf10aff02db272f0a053dff5c0063d729df988?cid=774b29d4f13844c495f206cafdad9c86';
        await Artists.add1(req.session.userid, spotifyResult, artist_track_url);
        res.redirect('/profile');
    });
    const artistID = spotifyResult.data.artists.items[0].id;
    const topTracks = await axios.get(`https://api.spotify.com/v1/artists/${artistID}/top-tracks?country=US`, header);
    let artist_track_url = topTracks.data.tracks[0].preview_url;
    await Artists.add1(req.session.userid, spotifyResult, artist_track_url);
    console.log(`Added ${spotifyResult.data.artists.items[0].name} to User ${req.session.userid}'s profile.`);
    res.redirect('/profile');
}

async function getTop3Artists(req, res, next, token){
    // console.log("req.session.userid  ", req.session.userid);
    const header = {headers: {"Authorization" : 'Bearer ' + token}};
    const URL = "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=3";
    const spotifyResult = await axios.get(`${URL}`, header);

    let previewURLArray = [];
    let escapeHatch;
    for(let i = 0; i < 3; i++) { 
        if((spotifyResult.data.items).length < 3){
            escapeHatch = true;
            break;
        }
        let artistID = spotifyResult.data.items[i].id;
        const topTracks = await axios.get(`https://api.spotify.com/v1/artists/${artistID}/top-tracks?country=US`, header);
        const artist_track_url = topTracks.data.tracks[0].preview_url;
        previewURLArray.push(artist_track_url);
    }
    if(!(escapeHatch === true)){
        await Artists.add3(req.session.userid, spotifyResult.data.items, previewURLArray);
        return;
    }
    else{ // escapeHatch is true
        return ;
    }
}

async function getRecentlyPlayed(req, res, next, token){
    const header = {headers: {"Authorization" : 'Bearer ' + token}};
    const URL = "https://api.spotify.com/v1/me/player/recently-played?type=track&limit=1";
    const spotifyResult = await axios.get(`${URL}`, header);
    await Artists.add1recent(req.session.userid, spotifyResult.data.items[0]);
    return;
}


module.exports = {
    searchArtist,
    getTop3Artists,
    getRecentlyPlayed
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
// Desired Info: Object.items[n] .name, .images[0].url

// // Lookup and add artist to list
// Endpoint: https://api.spotify.com/v1/search?q={Lucy%20Dacus}&type={artist}&limit={1}
// q: [Artist Name] (needs to be url-encoded)
// Type: artist
// Limit: 1
// Scopes: null
// Returns: Object
// Desired Info: Object.artists.items[n] .name, .images[0].url
