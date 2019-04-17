// functions for res.render-ing user info from routes
const  Message = require('../models/messages');
const Profile = require('../models/profile');
const Match = require('../models/match');
const axios = require('axios');
const escapeHtml = require('escape-html');
// const moment = require('moment');



async function getMessages(req, res){
    // // Updates your last_vist value for status icons elsewhere
    await Profile.lastVist(req.session.userid);

    // // Prevent user from loading page if they have no matches or no unblocked matches
    const matchesList = await Match.getMatchesThatUserIsIn(req.session.userid);
    const notBlocked = matchesList.filter(matchObject => { return matchObject.blocked !== true;});
    const pagePath2 = (((req.url).split('/')[1]));
    const goTo = ('/match')
    const message1 = 'OOPS! Looks like you have no messages yet!'
    const message2 = 'Lets go get you one!'
    if (notBlocked.length < 1){
        res.render('alert.html', {
            locals: { 
                pagePath: pagePath2,
                goTo: goTo,
                message1: message1,
                message2: message2,
                messageNotification : false

            },
            partials:{
                headPartial: './partial-head',
                navPartial: './partial-nav'
            }
        });    
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
    else{
        const theMatchID = await Message.getMatchIdOfYourMostRecentMessage(req.session.userid);
        const thePair = await Match.getMatchById(theMatchID.matches_id);
        let theOtherUser;
        if (thePair.current_user_id === req.session.userid){
            theOtherUser = thePair.viewed_user_id;
        }else{
            theOtherUser = thePair.current_user_id;
        }
        requestedUserID = theOtherUser;
    }

// // Below is code for calculating how recent other users have been online
    let arrayOfMatchObjects = await Match.getMatchesThatUserIsIn(req.session.userid);
    // filter out the blocked folks
    arrayOfMatchObjects = arrayOfMatchObjects.filter((matchObject) => {
        return (matchObject.blocked !== true);
    });
    // make an array of the match ids
    let arrayOfMatchIDs = arrayOfMatchObjects.map((matchObject) => {
        return matchObject.id;
    });
    // for each person on their contacts pane, assign the ID a value of shortTerm, midTerm, or longTerm away status
    let timeStatusObject = {};
    for(let i=0; i < arrayOfMatchIDs.length; i++){
        let idOfCleanOtherUser = [];
        const matches = await Match.getMatchById(arrayOfMatchIDs[i]);
        if ((matches.liked === true)){
            const matchObject = await Match.getMatchById(matches.id);
            if(matchObject.current_user_id === req.session.userid){
                idOfCleanOtherUser.push(matchObject.viewed_user_id);
            }
            else{
                idOfCleanOtherUser.push(matchObject.current_user_id);
            }
            let lastActivity = await Profile.getUserById(idOfCleanOtherUser[0]);
            const otherUserLastVist = lastActivity.last_vist;
            const nowHourAgo = Date.now() - 3600000;
            const now6HoursAgo = Date.now() - 21600000;
            const now12HoursAgo = Date.now() - 43200000;
            if (otherUserLastVist > nowHourAgo){
                timeStatusObject[`${lastActivity.id}`] = 'online';
            }
            else if (otherUserLastVist > now6HoursAgo){
                timeStatusObject[`${lastActivity.id}`] = 'away';
            }
            else if (otherUserLastVist > now12HoursAgo){
                timeStatusObject[`${lastActivity.id}`] = 'busy';
            }
            else{
                timeStatusObject[`${lastActivity.id}`] = 'offline';
            }
        }
    }
//////////////////////////////////////////////////////////////////


    const matchIdOfWholeConversation = await Match.getMatchIdFromTwoUsers(requestedUserID, req.session.userid);
    const wholeConvo = await Message.getConversationByMatchId(matchIdOfWholeConversation[0]);


    const matchIdsForCurrentUser = await Message.getMatchId(req.session.userid);
    let allConversationsWithUser = [];
    for(let i = 0; i < matchIdsForCurrentUser.length; i++) { // forEach and map were giving us headache, back to basics
        let aConversation = await Message.getMessagesByMatch(matchIdsForCurrentUser[i].id);
        allConversationsWithUser.push(aConversation);
    }

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// // // The below code should be a function that iterates over allConversationsWithUser and pulls out aConversation that has the latest timestamp // 
// const mostRecent = await Message.getMostRecentMessage(matchIdsForCurrentUser[0].id);
// // console.log("Most recent message: ",mostRecent);
// ////////////////////////////////////////////////////////////////////////////////////////////////////
    const theUser = await Profile.getBySpotifyId(req.session.passport.user.id);
    let arrayOfOtherPeopleIds = [];
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
    let arrayOfOtherPeople = [];
    for(let i = 0; i < arrayOfOtherPeopleIds.length; i++) { // forEach and map were giving us headache, back to basics
        const aUser = await Profile.getUserById(arrayOfOtherPeopleIds[i]);
        arrayOfOtherPeople.push(aUser);
    }

    // let usersMatches;
    // if(requestedUserID){
    //     usersMatches = await Match.getMatchesThatUserIsIn(requestedUserID);
    // }else{
    //     usersMatches = await Match.getMatchesThatUserIsIn(mostRecent.user_id);
    // }




    // const conversationMatchId = [];
    // for(let i = 0; i < matchIdsForCurrentUser.length; i++) { // forEach and map were giving us headache, back to basics
    //     let aMatch = await Match.getMatchById(matchIdsForCurrentUser[i].id);
    //     // let aMatch = await Match.getMatchById(usersMatches);
    //     if((theUser.id === aMatch.viewed_user_id)){
    //         conversationMatchId.push(aMatch.id);
    //     }
    //     // we want to push the other user's id # into the array
    // }

    // const value = await Message.getIdsOfUsersSendingMeAMessage(req.session.userid);
    // let metaConvoArray = [];

    // for(let i = 0; i < value.length; i++) { // forEach and map were giving us headache, back to basics
    // // value.forEach(async (useriD) => {
    //     const matchid = await Match.getMatchIdFromTwoUsers(req.session.userid, value[i]);
    //     // const matchid = await Match.getMatchIdFromTwoUsers(req.session.userid, useriD);
    //     if(matchid > 0){
    //     convoArray = await Message.getConversationByMatchId(matchid);
    //     metaConvoArray.push(convoArray);
    //     }
    // }
    // let lastMetaConvoArray = [];
    // for(let i = 0; i < metaConvoArray.length; i++) { // forEach and map were giving us headache, back to basics
    //     const convo = metaConvoArray[i];
    //     const lastMessage = convo[(convo.length)-1];
    //     lastMetaConvoArray.push(lastMessage);
    // }

    // lastMetaConvoArray.sort(function(a, b) {
    //     return b.timestamp - a.timestamp;
    // });


    // let aUserId;
    // let mostRecentMessage;
    // if(requestedUserID){
    //     aUserId =  (requestedUserID);
    // }else{
    //     // aUserId should be the last person to have sent a message, else no messages, the last person to match
        
    //     mostRecentMessage = lastMetaConvoArray[0];
    //     const recentConvoMatchArray = await Match.getMatchById(mostRecentMessage.matches_id)
    //     const otherPesonInRecentConvo = (req.session.userid === recentConvoMatchArray.current_user_id)? recentConvoMatchArray.viewed_user_id : recentConvoMatchArray.current_user_id;
    //     // mostRecentMessage = await Message.getMostRecentMessage(matchIdsForCurrentUser[0].id);
    //     aUserId = otherPesonInRecentConvo;
    // }


    // const aMatchIdObject = await Message.getMatchId(aUserId);
    // const aMatchId = aMatchIdObject[0].id;


    
    // const wholeConversation = await Message.getConversationByMatchId(aMatchId);


    // let wholeConversation;
    // if(conversationMatchId[0].length < 1){
    //     wholeConversation = await Message.getConversationByMatchId(mostRecent.user_id)
    // }else{
    // const wholeConversation = await Message.getConversationByMatchId(conversationMatchId[0]);
    // }

    // let resquestedUser;
    // if(requestedUserID){
    //     resquestedUser = await Profile.getUserById(requestedUserID);
    // }else{
    //     resquestedUser = await Profile.getUserById(conversationMatchId[0]);
    // }
    const resquestedUser = await Profile.getUserById(requestedUserID);
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
            pagePath: pagePath,
            timeStatusObject: timeStatusObject,
            messageNotification : false
            

        },
        partials:{
            headPartial: './partial-head',
            navPartial: './partial-nav'
        }
    });
}

async function addMessage(req, res){
    let matchID;
    if (req.body.blockUser){ // blocking users
        const userToBlock = parseInt(req.body.blockUser);
        const myself = parseInt(req.session.userid);
        matchID = await Match.getMatchIdFromTwoUsers(myself, userToBlock);
        await Match.blockUser(matchID[0]);
        console.log(`XXXXXXXXXXXXXXXX User ${myself} is BLOCKING User ${userToBlock} XXXXXXXXXXXXXXXX`);
        res.redirect('/messages');
    }


    let requestedUserID;
    if (((req.url).split('/')).length === 3){
        requestedUserID = (((req.url).split('/'))[2]);
        matchID = await Match.getMatchIdFromTwoUsers(requestedUserID, req.session.userid);
    }
    else{ // URL path is set to /messages
        // get all of a user's matches
        let arrayOfMatchObjects = await Match.getMatchesThatUserIsIn(req.session.userid);
        // filter out the blocked folks
        arrayOfMatchObjects = arrayOfMatchObjects.filter((matchObject) => {
            return (matchObject.blocked !== true);
        });
        // make an array of the match ids
        let arrayOfMatchIDs = arrayOfMatchObjects.map((matchObject) => {
            return matchObject.id;
        });
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
            console.log(`${req.session.userid} is: `);
            console.log("safely aborting to /profile!");
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


    const userMessage = escapeHtml(req.body.userMessage[1]);

    // let matchID = await Match.getMatchIdFromTwoUsers(req.session.userid, requestedUserID);
    const messageObject = {
        matchesId : matchID[0], 
        message : userMessage, 
        userId : req.session.userid,
        timestamp: Date.now()};

    await Message.addMessage(messageObject);

    console.log(`User ${req.session.userid} is sending this message to User ${requestedUserID}:`);
    console.log(userMessage);
    console.log(" ");

    res.redirect('/messages');

}

async function otherUserID(req, res){
    let requestedUserID;
    if (((req.url).split('/')).length === 3){
        requestedUserID = (((req.url).split('/'))[2]);
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
    return requestedUserID;
}


module.exports = {
    getMessages,
    addMessage
};