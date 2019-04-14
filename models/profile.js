const db = require('./conn');
const moment = require('moment');

class Profile {
    constructor(id, spotify_id, name, picture='http://beverlycove.org/wp-content/uploads/2016/07/no-profile-male.jpg', last_vist){
        this.id = id;
        this.spotifyId = spotify_id;
        this.name = name;
        this.picture = picture;
        this.lastVist = last_vist;
    }

    static add(user){
        const photo = user.photos[0]? user.photos[0] : 'http://beverlycove.org/wp-content/uploads/2016/07/no-profile-male.jpg';
        const now = moment().format();
        return db.one(`insert into users 
        (spotify_id, name, picture, last_vist)
        values
        ($1,$2,$3,$4)
        returning true`,[user.id, user.displayName, photo, now]);
    }

    static checkSpotifyID(spotifyId){
        return db.one(`select exists (select 1 from users where spotify_id=$1)`, [spotifyId]);
    }

    static getIdBySpotify(spotifyId){
        return db.one(`select id from users where spotify_id=$1`, [spotifyId]);
    }

    static getUserById(id){
        return db.one(`select * from users where id=$1`, [id]);
    }

    static getBySpotifyId(spotifyId){
        return db.one(`select * from users where spotify_id=$1`, [spotifyId])
            .then((userData) => {
                return new Profile (userData.id, userData.spotify_id, userData.name, userData.picture);
            });
    }
    // fetchResponse.map((object.item) => {
    //     await Artists.add(session.user.id, thingy)
    // })
    static getUserById(id){
        return db.one(`select * from users where id=$1`, [id]);
    }

    static lastVist(id){
        const now = moment().format();
        return db.one(`update only users set last_vist = $1 where id=$2 returning true;`, [now, id]);
    }

}

module.exports = Profile;