// functions for res.render-ing user info from routes

const  Match = require('../models/match');
const Artists = require('../models/artists');
const Profile = require('../models/profile');


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
    console.log(idOfCard)

    const displayedUserInfo = await Match.getUser(idOfCard);
    console.log(displayedUserInfo)
    
    
    const userArrayOfArtists = await Artists.getArtists(idOfCard);



    res.render('match.html', {
        locals: { 
            user: req.session.passport.user,
            // otherUsers: arrayOfAllUsersId,
            userArtists: userArrayOfArtists,
            hideMe: false,
            displayedUser: displayedUserInfo
        },
        partials:{
            headPartial: './partial-head',
            navPartial: './partial-nav'
        }
    });


}

async function addMatch(req,res) {
    console.log('we made it here')
    const userId = req.session.userid 
    console.log(userId)
    const idOfCard = await giveTheCardsInfo(userId)
    const viewedUserInfo = await Match.getUser(idOfCard)
    console.log(viewedUserInfo.id)

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