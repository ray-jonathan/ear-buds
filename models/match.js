const db = require('./conn');

class Match {
    constructor(id, current_user_id, viewed_user_id, liked, blocked) {
        this.id = id;
        this.currentUserId = current_user_id;
        this.viewedUserId = viewed_user_id;
        this.liked = liked;
        this.blocked = blocked;
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
        return db.any(`select id from matches where ((current_user_id=$1) or (viewed_user_id=$1)) and (liked=True) and (blocked=False)`, [user]);
    }

    static getMatchById(id) {
        return db.one(`select * from matches where id=$1`, [id]);
    }


};

module.exports= Match;