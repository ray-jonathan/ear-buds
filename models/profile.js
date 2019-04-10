const db = require('./conn');

class Profile {
    constructor(id, spotify_id, name, picture){
        this.id = id;
        this.spotifyId = spotify_id;
        this.name = name;
        this.picture = picture;
    }

    static add(user){
        return db.one(`insert into users 
        (spotify_id, name, picture)
        values
        ($1,$2,$3)
        returning true`,[user.id, user.displayName, user.photos[0]]);
    }

    static checkSpotifyID(spotifyId){
        return db.one(`select exists (select 1 from users where spotify_id=$1)`, [spotifyId]);
    }

    // fetchResponse.map((object.item) => {
    //     await Artists.add(session.user.id, thingy)
    // })

}

module.exports = Profile;