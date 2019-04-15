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
    console.log('look here', notLiked)

if(displayedUserInfo) {
    res.render('match.html', {
        locals: { 
            user: req.session.passport.user,
            // otherUsers: arrayOfAllUsersId,
            userArtists: userArrayOfArtists,
            hideMe: false,
            displayedUser: displayedUserInfo,
            pagePath: pagePath
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
            message2: bmessage2
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
            message2, message2
        },
        partials:{
            headPartial: './partial-head',
            navPartial: './partial-nav'
        }
    });
}
}

async function addMatch(req,res) {
    // console.log('we made it here')
    const userId = req.session.userid 
    // console.log(userId)
    const idOfCard = await giveTheCardsInfo(userId)
    const viewedUserInfo = await Match.getUser(idOfCard)
    // console.log(viewedUserInfo.id)

    
    req.body.buttonclicked
    
    
    const addMatch = {
        current_user_id: userId,
        viewed_user_id: viewedUserInfo.id,
        liked: req.body.buttonclicked,
        blocked: "False"
    }



    // console.log('show me it:', req.body.buttonclicked)

    const matchAdd = await Match.add(addMatch)

    console.log(userId)
    console.log(matchAdd.id)
    const initialMessage= {
        matchesId: matchAdd.id,
        message: 'Hey! I really like your taste in music!',
        timestamp: Date.now(),
        userId: userId
    }

    if(matchAdd.liked){
        await Message.addMessage(initialMessage);
    }
    console.log(matchAdd.liked)
    console.log("are we making it here?")

    await res.redirect('/match')


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
