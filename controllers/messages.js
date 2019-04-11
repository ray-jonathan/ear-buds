// functions for res.render-ing user info from routes
const  Message = require('../models/messages');
const Profile = require('../models/profile');
const Match = require('../models/match');

async function getMessages(req, res){
    // const matches = await Message.getMatches(req.session.passport.user.id)
    // console.log(matches)
    // console.log(req.session.user)
    const requestedUserID = (((req.url).split('/'))[2]);


    const matchIdsForCurrentUser = await Message.getMatchId(req.session.userid);
    // console.log("matchIdsForCurrentUser: ", matchIdsForCurrentUser);
    let allConversationsWithUser = [];
    for(let i = 0; i < matchIdsForCurrentUser.length; i++) { // forEach and map were giving us headache, back to basics
        let aConversation = await Message.getMessagesByMatch(matchIdsForCurrentUser[i].id);
        allConversationsWithUser.push(aConversation);
    }
    // console.log(" look here");
    // console.log(matchIdsForCurrentUser[0].id);
    // console.log(allConversationsWithUser);
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // // The below code should be a function that iterates over allConversationsWithUser and pulls out aConversation that has the latest timestamp // 
    const mostRecent = await Message.getMostRecentMessage(matchIdsForCurrentUser[0].id);
    // console.log("Most recent message: ",mostRecent);
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const theUser = await Profile.getBySpotifyId(req.session.passport.user.id);
    // console.log(theUser);
    let arrayOfOtherPeopleIds = [];
    // need to pass in iterated profile info for other users as well
    for(let i = 0; i < matchIdsForCurrentUser.length; i++) { // forEach and map were giving us headache, back to basics
        let aMatch = await Match.getMatchById(matchIdsForCurrentUser[i].id);
        if(!(theUser.id === aMatch.current_user_id)){
            arrayOfOtherPeopleIds.push(aMatch.current_user_id);
        }
        else{
            arrayOfOtherPeopleIds.push(aMatch.viewed_user_id);
        }
        // we want to push the other user's id # into the array
    }
    // console.log(arrayOfOtherPeopleIds);
    let arrayOfOtherPeople = [];
    for(let i = 0; i < arrayOfOtherPeopleIds.length; i++) { // forEach and map were giving us headache, back to basics
        const aUser = await Profile.getUserById(arrayOfOtherPeopleIds[i]);
        arrayOfOtherPeople.push(aUser);
    }
    console.log('');
    console.log(arrayOfOtherPeople);
    console.log('');

    let usersMatches;
    if(requestedUserID){
        usersMatches = await Match.getMatchesThatUserIsIn(requestedUserID);
    }else{
        usersMatches = await Match.getMatchesThatUserIsIn(mostRecent.user_id);
    }
    console.log('');
    console.log("usersMatches ",usersMatches);
    console.log('');




    console.log("length", matchIdsForCurrentUser.length);
    const conversationMatchId = [];
    for(let i = 0; i < matchIdsForCurrentUser.length; i++) { // forEach and map were giving us headache, back to basics
        console.log(i);
        console.log("lookie here: ", matchIdsForCurrentUser[i].id);
        let aMatch = await Match.getMatchById(matchIdsForCurrentUser[i].id);
        // let aMatch = await Match.getMatchById(usersMatches);
        if((theUser.id === aMatch.viewed_user_id)){
            conversationMatchId.push(aMatch.id);
        }
        // we want to push the other user's id # into the array
    }
    console.log('');
    console.log("conversationMatchId ",conversationMatchId);
    console.log('');


    let aUserId;
    let mostRecentMessage;
    if(requestedUserID){
        aUserId =  (requestedUserID);
    }else{
        mostRecentMessage = await Message.getMostRecentMessage(matchIdsForCurrentUser[0].id);
        aUserId = mostRecentMessage.user_id;
    }
    console.log('');
    console.log("aUserId: ",aUserId);
    console.log('');







    const aMatchIdObject = await Message.getMatchId(aUserId);
    const aMatchId = aMatchIdObject[0].id;
    console.log('');
    console.log("aMatchId: ",aMatchId);
    console.log('');




    
    const wholeConversation = await Message.getConversationByMatchId(aMatchId);



    // let wholeConversation;
    // if(conversationMatchId[0].length < 1){
    //     wholeConversation = await Message.getConversationByMatchId(mostRecent.user_id)
    // }else{
    // const wholeConversation = await Message.getConversationByMatchId(conversationMatchId[0]);
    // }
    console.log('');
    console.log("wholeConversation: ",wholeConversation);
    console.log('');

    // let resquestedUser;
    // if(requestedUserID){
    //     resquestedUser = await Profile.getUserById(requestedUserID);
    // }else{
    //     resquestedUser = await Profile.getUserById(conversationMatchId[0]);
    // }
    const resquestedUser = await Profile.getUserById(aUserId);

    console.log("resquestedUser: ", resquestedUser);

    res.render('./messages.html', {
        locals: { 
            // user: req.session.passport.user
            // need to send the selecter conversation's complete info
            // if possible, add ternary for adding "active" class of that conversation (maybe based on the URL path from before)
            recent: mostRecent,
            allMessages: allConversationsWithUser,
            user: theUser,
            otherUsers: arrayOfOtherPeople,
            wholeConversation: wholeConversation,
            resquestedUser: resquestedUser
            

        },
        partials:{
            headPartial: './partial-head'
        }
    });
}

module.exports = {
    getMessages
};

// // DB FRAMEWORK // //
// // Message history for all of Current User's matches
// `select * from table where user_id = req.session.user.id`
// inner join matches table (looking for blocked=false)