const db = require('./conn');

class Artists {
    constructor(id, user_id, artist_name, artist_picture='http://secure.hmepowerweb.com/Resources/Images/NoImageAvailableLarge.jpg'){
        this.id = id;
        this.userId = user_id;
        this.artistName = artist_name;
        this.artistPicture = artist_picture;
    }

    static addFromSearch(artist){
        return db.one(`insert into artists 
        (spotify_id, name, picture)
        values
        ($1,$2,$3)
        returning true`,[user.id, user.displayName, user.photos[0]]);
    }

    static add(spotifyResult){
        return db.one(`insert into artists 
        (user_id, artist_name, artist_picture)
        values
        ($1, $2, $3)
        returning true`, [req.session.passport.user.id, spotifyResult.artists.items[0].name, spotifyResult.artists.items[0].images[2].url]);
    }

    static getArtists(user_id){
        return db.any(`select * from artists where user_id=$1`, [user_id])
        // .then((result) => {
        //     let arrayOfArtists = [];
        //     result.forEach((artist) => {
        //         newArtist = new Artists(artist.id, artist.userId, artist.artistName, artist.artistPicture);
        //         arrayOfArtists.push(newArtist);
        //     })
        //     return arrayOfArtists;
        // });
    }

}

module.exports = Artists;

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
