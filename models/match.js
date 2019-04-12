const db = require('./conn');

class Match {
    constructor(id, current_user_id, viewed_user_id, liked, blocked) {
        this.id = id;
        this.currentUserId = current_user_id;
        this.viewedUserId = viewed_user_id;
        this.liked = liked;
        this.blocked = blocked;
    }


    static add(object) {
        return db.one(`insert into matches
            (current_user_id, viewed_user_id, liked, blocked)
        values
            ($1, $2, $3, $4) returning true`, [object.current_user_id, object.viewed_user_id, object.liked, object.blocked])
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

    static getMatchIdFromTwoUsers(user1, user2){
        return db.any(`select * from matches where (current_user_id=$1) or (viewed_user_id=$1)`, [user1])
            .then((allUser1MatchesArray)=>{
                let resultArray = [];
                allUser1MatchesArray.forEach((matchObject)=>{
                    // console.log(matchObject);
                    if((matchObject.current_user_id === user2)||(matchObject.viewed_user_id === user2)){
                        // console.log("yes!");
                        resultArray.push(matchObject.id);
                    }
                });
                if(resultArray.length < 1){
                    resultArray.push(-1);
                } 
                return resultArray[0];
            });
    }

    static getMatchId(user){
        return db.any(`select id from matches where (current_user_id=$1) or (viewed_user_id=$1)`, [user]);
    }

    static getMatchById(id) {
        return db.one(`select * from matches where id=$1`, [id]);
    }


}


async function quickTest(){
    const matchID = await Match.getMatchIdFromTwoUsers(1, 2);
    // console.log("-----------");
    // console.log("user1: ",1);
    // console.log("user2: ",2);
    // console.log("matchID: ",matchID);
    // console.log("-----------");
    // const value = await Match.getMatchIdFromTwoUsers(2, 1);
    // console.log(value);
}
quickTest();

module.exports= Match;