const db = require('./conn');

class Profile {
    constructor(id, spotify_id, name, picture='http://beverlycove.org/wp-content/uploads/2016/07/no-profile-male.jpg'){
        this.id = id;
        this.spotifyId = spotify_id;
        this.name = name;
        this.picture = picture;
    }

    static add(user){
        const photo = user.photos[0]? user.photos[0] : 'http://beverlycove.org/wp-content/uploads/2016/07/no-profile-male.jpg';
        return db.one(`insert into users 
        (spotify_id, name, picture)
        values
        ($1,$2,$3)
        returning true`,[user.id, user.displayName, photo]);
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

}

module.exports = Profile;