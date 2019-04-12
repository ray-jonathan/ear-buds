const db = require('./conn');

class Messages {
    constructor(id, matches_id, message, timestamp, user_id) {
        this.id = id;
        this.matchesId = matches_id;
        this.message = message;
        this.timestamp = timestamp;
        this.userId = user_id;
    }

    static getMatchId(user){
        // console.log("user for matchid: ", user);
        return db.any(`select id from matches where ((current_user_id=$1) or (viewed_user_id=$1)) and (liked=True) and (blocked=False)`, [user]);
    }

    static addMessage(message){
        // console.log(message.matchesId);
        // console.log(typeof message.matchesId);
        return db.one(`insert into messages
        (matches_id, message, timestamp, user_id)
        values
        ($1, $2, $3, $4) returning true
        `, [message.matchesId, message.message, message.timestamp, message.userId]);
    }

    static getMessagesByMatch(matches_id){
        return db.any(`select * from messages where matches_id=$1`, [matches_id]);
        // .then((data) => {
        //     new Messages(data.id, data.matchesId, data.message)
        // })
    }
    static getConversationByMatchId(matches_id){
        return db.any(`select * from messages where matches_id=$1`, [matches_id]);
        // .then((data) => {
        //     new Messages(data.id, data.matchesId, data.message)
        // })
    }

    static getMostRecentMessage(matches_id){
        return db.one(`select * from messages where matches_id=$1 order by timestamp DESC LIMIT 1`, [matches_id]);
    }

}

module.exports = Messages;