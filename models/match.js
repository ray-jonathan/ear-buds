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
            ($1, $2, $3, $4) returning *`, [object.current_user_id, object.viewed_user_id, object.liked, object.blocked])
                .then((data) => {
                    return new Match(data.id, data.currentUserId, data.viewedUserId, data.liked, data.blocked)
                })
    }

    static getAllUsers(user) {
        return db.any(`select * from users where id!=$1`, [user])
    }
    
    static getUser(user){
        return db.one(`select * from users where id=$1`, [user])
            .catch(() => {
                return null;
            })
    }

    static getAllUsersId(user) {
        return db.any(`select id from users where id!=$1`, [user])
    }

    static getMatchesThatUserIsIn(user) {
        return db.any(`select * from matches where (current_user_id=$1) or (viewed_user_id=$1)`, [user])
    }

    static getMatchIdFromTwoUsers(user1, user2){
        // console.log("user1 is: ", user1);
        // console.log("user2 is: ", user2);
        return db.any(`select * from matches where (current_user_id=$1) or (viewed_user_id=$1)`, [user1])
            .then((allUser1MatchesArray)=>{
                // console.log("allUser1MatchesArray", allUser1MatchesArray);
                // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                let resultArray = [];
                // allUser1MatchesArray.forEach((matchObject)=>{
                for(let i = 0; i < allUser1MatchesArray.length; i++) { // forEach and map were giving us headache, back to basics
                    // console.log("I happened");
                    // console.log(allUser1MatchesArray[i]);
                    if((allUser1MatchesArray[i].current_user_id === user2)||(allUser1MatchesArray[i].viewed_user_id === user2)){
                        // console.log("here dude");
                        resultArray.push(allUser1MatchesArray[i].id);
                        break;
                    }       
                }
                if(resultArray.length === 0){
                    resultArray.push(-1);
                }
                // console.log("resultArray ", resultArray);
                return resultArray;
            });
    }

    static getMatchId(user){
        return db.any(`select id from matches where (current_user_id=$1) or (viewed_user_id=$1)`, [user]);
    }

    static getMatchById(id) {
        return db.one(`select * from matches where id=$1`, [id]);
    }

    static blockUser(id) {
        return db.one(`update only matches set blocked = $1 where id=$2 returning true;`, ['TRUE', id]);
    }
}


// async function quickTest(){
//     const matchID = await Match.getMatchIdFromTwoUsers(1, 2);
//     // console.log("-----------");
//     // console.log("user1: ",1);
//     // console.log("user2: ",2);
//     // console.log("matchID: ",matchID);
//     // console.log("-----------");
//     // const value = await Match.getMatchIdFromTwoUsers(2, 1);
//     // console.log(value);
// }
// quickTest();

module.exports= Match;