// functions for res.render-ing user info from routes
const  Message = require('../models/messages');
const Profile = require('../models/profile');
const Match = require('../models/match');
const axios = require('axios');
const escapeHtml = require('escape-html');
const moment = require('moment');



async function getMessages(req, res){
    // const updateTime = await Profile.lastVist(req.session.userid);
    await Profile.lastVist(req.session.userid);
    // console.log("Able to update last vist time: ", updateTime.bool);
    // // Prevent user from loading page if they have no matches or no unblocked matches
    const matchesList = await Match.getMatchesThatUserIsIn(req.session.userid);
    // console.log(matchesList);
    const notBlocked = matchesList.filter(matchObject => { return matchObject.blocked !== true;});
    // console.log("We good here 1");
    if (notBlocked.length < 1){
        res.redirect('/match');
    }

    ////////////////////////////////////////////////////
    let requestedUserID;
    if (((req.url).split('/')).length === 3){
        requestedUserID = (((req.url).split('/'))[2]);
        if (!(requestedUserID)){
            res.redirect('/messages');
        }
        const matchID = await Match.getMatchIdFromTwoUsers(requestedUserID, req.session.userid);
        if(matchID[0] < 0){
            res.redirect('/messages');
        }
        const matchObject = await Match.getMatchById(matchID[0]);
        if (matchObject.blocked === true){
            res.redirect('/messages');
        }
    }
    else{ // URL path is set to /messages
        // get all of a user's matches
        let arrayOfMatchObjects = await Match.getMatchesThatUserIsIn(req.session.userid);
        // filter out the blocked folks
        arrayOfMatchObjects = arrayOfMatchObjects.filter((matchObject) => {
            return (matchObject.blocked !== true);
        });
        console.log("arrayOfMatchObjects", arrayOfMatchObjects);
        // make an array of the match ids
        let arrayOfMatchIDs = arrayOfMatchObjects.map((matchObject) => {
            return matchObject.id;
        });
        console.log("arrayOfMatchIDs ", arrayOfMatchIDs);
        // get all the messages that have those match ids
        let arrayOfMessages = [];
        for(let i = 0; i < arrayOfMatchIDs.length; i++) { // forEach and map were giving us headache, back to basics
            const newMessage = await Message.getConversationByMatchId(arrayOfMatchIDs[i]);
            arrayOfMessages.push(newMessage);
        }
        // reverse the array that you just produced, making it descend chronologically
        let reverseArrayOfMessages = arrayOfMessages.reverse();
        // grab the match_id of the first item in that array
        let niftyNewArray = [];
        reverseArrayOfMessages.forEach(message => {
            if(message.length > 0){
                niftyNewArray.push(message);
                return message;
            }
        });
        if(!(niftyNewArray[0])){
            console.log("Safely aborting!");
            res.redirect('/profile');
        }
        const mostRecentMatchIdConversedWith = niftyNewArray[0][0].matches_id;
        // use that match_id to find the users in the matches table by that id
        const matchObject = await Match.getMatchById(mostRecentMatchIdConversedWith);
        // find the user that isn't you
        if (matchObject.current_user_id === req.session.userid){
            requestedUserID = matchObject.viewed_user_id;
        }else{
            requestedUserID = matchObject.current_user_id;
        }
    }
    // console.log("requestedUserID :", requestedUserID);
    // console.log("My Id :", req.session.userid);
    // console.log("requestedUserID ", requestedUserID);

    const matchIdOfWholeConversation = await Match.getMatchIdFromTwoUsers(requestedUserID, req.session.userid)
    // console.log("matchIdOfWholeConversation ............................. ", matchIdOfWholeConversation);
    // console.log(" ");

    // const matches = await Message.getMatches(req.session.passport.user.id)
    // console.log(matches)
    // console.log(req.session.user)
    // const requestedUserID = (((req.url).split('/'))[2]);
    // console.log("Before?");
    const wholeConvo = await Message.getConversationByMatchId(matchIdOfWholeConversation[0]);
    // console.log("Did I break it?");
    // console.log("wholeConvo        ");
    // console.log(wholeConvo);
    // console.log(" ");
    // console.log(" ");
    // console.log(" ");
    // console.log("WHAT THE WHAT THE WHAT THE WHAT THE WHAT THE WHAT THE WHAT");

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
    // ////////////////////////////////////////////////////////////////////////////////////////////////////
    // // // The below code should be a function that iterates over allConversationsWithUser and pulls out aConversation that has the latest timestamp // 
    // const mostRecent = await Message.getMostRecentMessage(matchIdsForCurrentUser[0].id);
    // // console.log("Most recent message: ",mostRecent);
    // ////////////////////////////////////////////////////////////////////////////////////////////////////
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
    // // console.log('');
    // // console.log(arrayOfOtherPeople);
    // // console.log('');

    // let usersMatches;
    // if(requestedUserID){
    //     usersMatches = await Match.getMatchesThatUserIsIn(requestedUserID);
    // }else{
    //     usersMatches = await Match.getMatchesThatUserIsIn(mostRecent.user_id);
    // }
    // // console.log('');
    // // console.log("usersMatches ",usersMatches);
    // // console.log('');




    // // console.log("length", matchIdsForCurrentUser.length);
    // const conversationMatchId = [];
    // for(let i = 0; i < matchIdsForCurrentUser.length; i++) { // forEach and map were giving us headache, back to basics
    //     // console.log(i);
    //     // console.log("lookie here: ", matchIdsForCurrentUser[i].id);
    //     let aMatch = await Match.getMatchById(matchIdsForCurrentUser[i].id);
    //     // let aMatch = await Match.getMatchById(usersMatches);
    //     if((theUser.id === aMatch.viewed_user_id)){
    //         conversationMatchId.push(aMatch.id);
    //     }
    //     // we want to push the other user's id # into the array
    // }
    // // console.log('');
    // // console.log("conversationMatchId ",conversationMatchId);
    // // console.log('');

    // // console.log("USER MATCHES",usersMatches);
    // // console.log(req.session.userid);
    // const value = await Message.getIdsOfUsersSendingMeAMessage(req.session.userid);
    // console.log("value here", value);
    // let metaConvoArray = [];

    // for(let i = 0; i < value.length; i++) { // forEach and map were giving us headache, back to basics
    // // value.forEach(async (useriD) => {
    //     const matchid = await Match.getMatchIdFromTwoUsers(req.session.userid, value[i]);
    //     // const matchid = await Match.getMatchIdFromTwoUsers(req.session.userid, useriD);
    //     if(matchid > 0){
    //     convoArray = await Message.getConversationByMatchId(matchid);
    //     // console.log("convoArray",convoArray);
    //     metaConvoArray.push(convoArray);
    //     }
    // }
    // let lastMetaConvoArray = [];
    // for(let i = 0; i < metaConvoArray.length; i++) { // forEach and map were giving us headache, back to basics
    //     const convo = metaConvoArray[i];
    //     const lastMessage = convo[(convo.length)-1];
    //     lastMetaConvoArray.push(lastMessage);
    // }
    // console.log("lastMetaConvoArray",lastMetaConvoArray);

    // lastMetaConvoArray.sort(function(a, b) {
    //     return b.timestamp - a.timestamp;
    // });

    // console.log("lastMetaConvoArray", lastMetaConvoArray);





    // let aUserId;
    // let mostRecentMessage;
    // if(requestedUserID){
    //     aUserId =  (requestedUserID);
    // }else{
    //     // aUserId should be the last person to have sent a message, else no messages, the last person to match
        
    //     mostRecentMessage = lastMetaConvoArray[0];
    //     const recentConvoMatchArray = await Match.getMatchById(mostRecentMessage.matches_id)
    //     const otherPesonInRecentConvo = (req.session.userid === recentConvoMatchArray.current_user_id)? recentConvoMatchArray.viewed_user_id : recentConvoMatchArray.current_user_id;
    //     // console.log("otherPesonInRecentConvo", otherPesonInRecentConvo);
    //     // mostRecentMessage = await Message.getMostRecentMessage(matchIdsForCurrentUser[0].id);
    //     aUserId = otherPesonInRecentConvo;
    // }
    // // console.log('');
    // // console.log("aUserId: ",aUserId);
    // // console.log('');







    // const aMatchIdObject = await Message.getMatchId(aUserId);
    // const aMatchId = aMatchIdObject[0].id;
    // console.log('');
    // console.log("aMatchId: ",aMatchId);
    // console.log('');




    
    // const wholeConversation = await Message.getConversationByMatchId(aMatchId);



    // let wholeConversation;
    // if(conversationMatchId[0].length < 1){
    //     wholeConversation = await Message.getConversationByMatchId(mostRecent.user_id)
    // }else{
    // const wholeConversation = await Message.getConversationByMatchId(conversationMatchId[0]);
    // }
    // console.log('');
    // console.log("wholeConversation: ",wholeConversation);
    // console.log('');

    // let resquestedUser;
    // if(requestedUserID){
    //     resquestedUser = await Profile.getUserById(requestedUserID);
    // }else{
    //     resquestedUser = await Profile.getUserById(conversationMatchId[0]);
    // }
    const resquestedUser = await Profile.getUserById(requestedUserID);
    // console.log("resquestedUser.id ",resquestedUser.id);
    // console.log("resquestedUser: ", resquestedUser);
    // console.log(resquestedUser.name);
    const pagePath = (((req.url).split('/')[1]));

    res.render('./messages', {
        locals: { 
            // user: req.session.passport.user
            // need to send the selecter conversation's complete info
            // if possible, add ternary for adding "active" class of that conversation (maybe based on the URL path from before)
            // recent: mostRecent,
            // allMessages: allConversationsWithUser,
            user: theUser,
            otherUsers: arrayOfOtherPeople,
            wholeConversation: wholeConvo,
            resquestedUser: resquestedUser,
            pagePath: pagePath
            

        },
        partials:{
            headPartial: './partial-head',
            navPartial: './partial-nav'
        }
    });
}

async function addMessage(req, res){
    if (req.body.blockUser){ // blocking users
        const userToBlock = parseInt(req.body.blockUser);
        const myself = parseInt(req.session.userid);
        const matchID = await Match.getMatchIdFromTwoUsers(myself, userToBlock);
        await Match.blockUser(matchID[0]);
        res.redirect('/messages');
    }

    const requestedUserID = parseInt(((req.url).split('/'))[2]);
    const userMessage = escapeHtml(req.body.userMessage[1]);

    const matchID = await Match.getMatchIdFromTwoUsers(req.session.userid, requestedUserID);
    const messageObject = {
        matchesId : matchID[0], 
        message : userMessage, 
        userId : req.session.userid,
        timestamp: moment().format()};
    
    await Message.addMessage(messageObject);
    res.redirect('/messages');

}

async function otherUserID(req, res){
    let requestedUserID;
    if (((req.url).split('/')).length === 3){
        requestedUserID = (((req.url).split('/'))[2]);
        console.log(req.url);
        console.log("...........SHOULDN'T IF..........");
    }
    else{ // URL path is set to /messages
        // get all of a user's matches
        arrayOfMatchObjects = await Match.getMatchesThatUserIsIn(req.session.userid);
        // console.log("arrayOfMatchObjects", arrayOfMatchObjects);
        // make an array of the match ids
        const arrayOfMatchIDs = arrayOfMatchObjects.map((matchObject) => {
            return matchObject.id;
        });
        // get all the messages that have those match ids
        let arrayOfMessages = [];
        for(let i = 0; i < arrayOfMatchIDs.length; i++) { // forEach and map were giving us headache, back to basics
            const newMessage = await Message.getConversationByMatchId(arrayOfMatchIDs[i]);
            arrayOfMessages.push(newMessage);
        }
        // reverse the array that you just produced, making it descend chronologically
        const reverseArrayOfMessages = arrayOfMessages.reverse();
        // grab the match_id of the first item in that array
        const mostRecentMatchIdConversedWith = reverseArrayOfMessages[0][0].matches_id;
        // use that match_id to find the users in the matches table by that id
        const matchObject = await Match.getMatchById(mostRecentMatchIdConversedWith);
        // find the user that isn't you
        if (matchObject.current_user_id === req.session.userid){
            requestedUserID = matchObject.viewed_user_id;
        }else{
            requestedUserID = matchObject.current_user_id;
        }
    }
    console.log("FEE FI FO FUM, SHIT SHIT SHIT: ", requestedUserID);
    return requestedUserID;
}


module.exports = {
    getMessages,
    addMessage
};

// // DB FRAMEWORK // //
// // Message history for all of Current User's matches
// `select * from table where user_id = req.session.user.id`
// inner join matches table (looking for blocked=false)