// functions for res.render-ing user info from routes

const  Match = require('../models/match');
const Artists = require('../models/artists');
const Profile = require('../models/profile');
const Message = require('../models/messages');
// const moment = require('moment');


async function giveTheCardsInfo(userId) {
    const matchIdsForCurrentUser = await Match.getMatchId(userId);
    const arrayOfAllUsersId = await Match.getAllUsersId(userId)
    let arrayOfMatchesId = [];
    // need to pass in iterated profile info for other users as well
    for(let i = 0; i < matchIdsForCurrentUser.length; i++) { // forEach and map were giving us headache, back to basics
        let aMatch = await Match.getMatchById(matchIdsForCurrentUser[i].id);
        if(!(userId === aMatch.current_user_id)){
            arrayOfMatchesId.push(aMatch.current_user_id);
        }
        else{
            arrayOfMatchesId.push(aMatch.viewed_user_id);
        }
    }
    totallyNewPeopleId = []
    for(let i = 0; i < arrayOfAllUsersId.length; i++) {
        // console.log(arrayOfAllUsersId[i].id)
        // console.log('people matched with', arrayOfMatchesId)
        if (!(arrayOfMatchesId.includes(arrayOfAllUsersId[i].id))){
            totallyNewPeopleId.push(arrayOfAllUsersId[i].id)
        }
    }
    return totallyNewPeopleId[0];
}


async function getMatch(req, res){
    // console.log(req.body);
    const userId = req.session.userid 
    const idOfCard = await giveTheCardsInfo(userId)
    // console.log(idOfCard)

    const displayedUserInfo = await Match.getUser(idOfCard);
    // console.log(displayedUserInfo)
    
    
    const userArrayOfArtists = await Artists.getArtists(idOfCard);
    // console.log(userArrayOfArtists);
    const pagePath = (((req.url).split('/')[1]));
    const goTo = '/messages';
    const message1 = 'There are currently no more users to check out!';
    const message2 = 'You are being automatically redirected to Messages now!';
    const bgoTo = '/profile';
    const bmessage1 = 'You have no matches!';
    const bmessage2 = 'You are too picky, try again later!';

    await Profile.lastVist(req.session.userid);

    // // Prevent user from loading page if they have no matches or no unblocked matches
    const matchesList = await Match.getMatchesThatUserIsIn(req.session.userid);
    // console.log(matchesList);
    const notLiked = matchesList.filter(matchObject => { return matchObject.liked === true;});
    // console.log('look here', notLiked)



// // Code for adding message notification icon when there is an unread message
    let messageNotification;
    // get all of a user's matches
    let arrayOfMatchObjects = await Match.getMatchesThatUserIsIn(req.session.userid);
    // filter out the blocked folks
    arrayOfMatchObjects = arrayOfMatchObjects.filter((matchObject) => {
        return (matchObject.blocked !== true);
    });
    // console.log("arrayOfMatchObjects", arrayOfMatchObjects);
    // make an array of the match ids
    let arrayOfMatchIDs = arrayOfMatchObjects.map((matchObject) => {
        return matchObject.id;
    });
    // console.log("arrayOfMatchIDs ", arrayOfMatchIDs);
    // get all the messages that have those match ids
    let arrayOfMessages = [];
    for(let i = 0; i < arrayOfMatchIDs.length; i++) { // forEach and map were giving us headache, back to basics
        const newMessage = await Message.getConversationByMatchId(arrayOfMatchIDs[i]);
        arrayOfMessages.push(newMessage);
    }

    // put them in one big array
    let arrayOfMess = [];
    for(let i = 0; i < arrayOfMessages.length; i++){
        for(let j = 0; j < arrayOfMessages[i].length; j++){
            arrayOfMess.push(arrayOfMessages[i][j]);
        }
    }

    // sort that array by most recent
    arrayOfMess.sort((a,b) => {
        return b.timestamp - a.timestamp
    });

    // make sure the user has conversations
    if(arrayOfMess.length > 0){
        if(!(arrayOfMess[0])){
                console.log(`${user.id} is: `);
                console.log("safely aborting to /profile!");
                res.redirect('/profile');
            }
        const you = await Profile.getUserById(req.session.userid);
        
        // compare the latest message to the user's last visit to the messages page
        if((arrayOfMess[0].timestamp) > parseInt(you.last_vist)){
            // console.log("New messages waiting for you!");
            messageNotification = true;
        }else{
            // console.log(" No new message");
            messageNotification = false;
        }
    }
    else{
        messageNotification = false;
    }
//////////////////////////////////////////////////////////////////


    if(displayedUserInfo) {
        res.render('match.html', {
            locals: { 
                user: req.session.passport.user,
                // otherUsers: arrayOfAllUsersId,
                userArtists: userArrayOfArtists,
                hideMe: false,
                displayedUser: displayedUserInfo,
                pagePath: pagePath,
                messageNotification: messageNotification

            },
            partials:{
                headPartial: './partial-head',
                navPartial: './partial-nav'
            }
        });
    } else if (notLiked.length < 1){
        res.render('alert.html', {
            locals: { 
                pagePath: pagePath,
                goTo: bgoTo,
                message1: bmessage1,
                message2: bmessage2,
                messageNotification : false
            },
            partials:{
                headPartial: './partial-head',
                navPartial: './partial-nav'
            }
        });    
    } else {
        res.render('alert.html', {
            locals: { 
                pagePath: pagePath,
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
}

async function addMatch(req,res) {
    // console.log(" ");
    // console.log(" ");
    // console.log(" ");
    // console.log(" ");
    // console.log(" ");
    // console.log(" ");
    // console.log("req");
    // console.log(" ");
    // console.log(req.body);
    // console.log('we made it here')
    const userId = req.session.userid;
    // console.log(userId)
    const idOfCard = await giveTheCardsInfo(userId);
    const viewedUserInfo = await Match.getUser(idOfCard);
    // console.log(viewedUserInfo.id)

    
    // req.body.buttonclicked
    
    
    const addMatch = {
        current_user_id: userId,
        viewed_user_id: viewedUserInfo.id,
        liked: req.body.buttonclicked,
        blocked: "False"
    }

    if (req.body.buttonclicked === 'True'){
        console.log(`User ${userId} LIKED User ${viewedUserInfo.id}`);
    }
    else if(req.body.buttonclicked === 'False'){
        console.log(`User ${userId} SKIPPED User ${viewedUserInfo.id}`);
    }
    

    // console.log('show me it:', req.body.buttonclicked)

    const matchAdd = await Match.add(addMatch);

    // console.log(matchAdd);
    // console.log(userId)
    // console.log(matchAdd.id)
    const initialMessage= {
        matchesId: matchAdd.id,
        message: 'Hey! I really like your taste in music!',
        timestamp: Date.now(),
        userId: userId
    }

    if(matchAdd.liked){
        await Message.addMessage(initialMessage);
    }
    // console.log(matchAdd.liked)
    // console.log("are we making it here?")

    await res.redirect('/match');


}

module.exports = {
    getMatch,
    addMatch
};


// // DB FRAMEWORK // //

// // Potential matches for logged-in user to review
// inner join user_id from top_artists table where viewed_user_id from matches isn't

// // Add match result 
// insert (etc)
