const db = require('./conn');

class Match {
    constructor(id, current_user_id, viewed_user_id, liked, blocked) {
        this.id = id;
        this.currentUserId = current_user_id;
        this.viewedUserId = viewed_user_id;
        this.liked = liked;
        this.blocked = blocked;
    }


    static add(matchData) {
        return db.one(`insert into matches
            (current_user_id, viewed_user_id, liked, blocked)
        values
            ($1, $2, $3, $4)`, [matchData.current_user_id, matchData.viewed_user_id, matchData.liked, matchedData.blocked])
    }

    static getAllUsers(user) {
        return db.any(`select * from users where id!=$1`, [user])
    }
    
    static getUser(user){
        return db.one(`select * from users where id=$1`, [user])
    }

    static getAllUsersId(user) {
        return db.any(`select id from users where id!=$1`, [user])
    }

    static getMatchesThatUserIsIn(user) {
        return db.any(`select * from matches where (current_user_id=$1) or (viewed_user_id=$1)`, [user])
    }

    static getMatchId(user){
        return db.any(`select id from matches where (current_user_id=$1) or (viewed_user_id=$1)`, [user]);
    }

    static getMatchById(id) {
        return db.one(`select * from matches where id=$1`, [id]);
    }


}

module.exports= Match;