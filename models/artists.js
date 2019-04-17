const db = require('./conn');
// const moment = require('moment');
const axios = require('axios');

class Artists {
    constructor(id, user_id, artist_name, artist_picture='http://secure.hmepowerweb.com/Resources/Images/NoImageAvailableLarge.jpg', artist_track_url='https://p.scdn.co/mp3-preview/22bf10aff02db272f0a053dff5c0063d729df988?cid=774b29d4f13844c495f206cafdad9c86'){
        this.id = id;
        this.userId = user_id;
        this.artistName = artist_name;
        this.artistPicture = artist_picture;
        this.artistTrackURL = artist_track_url;
    }

    // static addFromSearch(user){
    //     return db.one(`insert into artists 
    //     (spotify_id, name, picture)
    //     values
    //     ($1,$2,$3)
    //     returning true`,[user.id, user.displayName, user.photos[0]]);
    // }


    static add1(userID, spotifyResult, artist_track_url){
        if(artist_track_url === null){
            artist_track_url = 'https://p.scdn.co/mp3-preview/22bf10aff02db272f0a053dff5c0063d729df988?cid=774b29d4f13844c495f206cafdad9c86';
        }
        return db.one(`insert into artists 
        (user_id, artist_name, artist_picture, artist_track_url)
        values
        ($1, $2, $3, $4)
        returning true`, [userID, spotifyResult.data.artists.items[0].name, spotifyResult.data.artists.items[0].images[0].url, artist_track_url]);
    }
    
    static add1recent(userID, spotifyResult){
        return db.one(`insert into artists 
        (user_id, artist_name, artist_picture, artist_track_url)
        values
        ($1, $2, $3, $4)
        returning true`, [userID, spotifyResult.track.artists[0].name, spotifyResult.track.album.images[0].url, spotifyResult.track.preview_url]);
    }

    static add3(userID, spotifyResult, previewURLArray){
        return db.any(`insert into artists 
        (user_id, artist_name, artist_picture, artist_track_url)
        values
        ($1, $2, $3, $4),
        ($1, $5, $6, $7),
        ($1, $8, $9, $10)
        returning true`, 
        [userID, 
            spotifyResult[0].name, spotifyResult[0].images[0].url, previewURLArray[0],
            spotifyResult[1].name, spotifyResult[1].images[0].url, previewURLArray[1],
            spotifyResult[2].name, spotifyResult[2].images[0].url, previewURLArray[2]
        ]).catch((error) => {
            console.log('[DB ERROR]: ', error.message || error);
        });
    }

    static getArtists(user_id){
        return db.any(`select * from artists where user_id=$1`, [user_id]);
        // .then((result) => {
        //     let arrayOfArtists = [];
        //     result.forEach((artist) => {
        //         newArtist = new Artists(artist.id, artist.userId, artist.artistName, artist.artistPicture);
        //         arrayOfArtists.push(newArtist);
        //     })
        //     return arrayOfArtists;
        // });
    }




    static removeArtist(id){
        console.log("Artist ID to be deleted: ", id);
        if(!(id === "null")){
            console.log("deleting...");
            return db.one(`delete from artists where id=$1 returning true`, [id]);
        }
        else{
            return;
        }
    }

}

module.exports = Artists;
