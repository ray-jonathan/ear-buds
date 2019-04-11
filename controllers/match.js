// functions for res.render-ing user info from routes

const  Match = require('../models/match');
const Artists = require('../models/artists');
const Profile = require('../models/profile');


async function getMatch(req, res){
    const userId = req.session.userid 
    const arrayOfAllUsersId = await Match.getAllUsersId(userId)
    const matchIdsForCurrentUser = await Match.getMatchId(userId);
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
        // we want to push the other user's id # into the array
    }
    let arrayofmatches = [];
    for(let i = 0; i < arrayOfMatchesId.length; i++) { // forEach and map were giving us headache, back to basics
        const aUser = await Profile.getUserById(arrayOfMatchesId[i]);
        arrayofmatches.push(aUser);
    }

    totallyNewPeopleId = []
    for(let i = 0; i < arrayOfAllUsersId.length; i++) {
        // console.log(arrayOfAllUsersId[i].id)
        // console.log('people matched with', arrayOfMatchesId)
        if (!(arrayOfMatchesId.includes(arrayOfAllUsersId[i].id))){
            totallyNewPeopleId.push(arrayOfAllUsersId[i].id)
        }
    }

    console.log(totallyNewPeopleId);

    const userArrayOfArtists = await Artists.getArtists(totallyNewPeopleId[0]);
    const displayedUserInfo = await Match.getAllUsers(totallyNewPeopleId[0]);
    console.log(displayedUserInfo)





    res.render('match.html', {
        locals: { 
            user: req.session.passport.user,
            // otherUsers: arrayOfAllUsersId,
            userArtists: userArrayOfArtists,
            hideMe: false,
        },
        partials:{
            headPartial: './partial-head'
        }
    });


}

module.exports = {
    getMatch
};


// // DB FRAMEWORK // //

// // Potential matches for logged-in user to review
// inner join user_id from top_artists table where viewed_user_id from matches isn't

// // Add match result 
// insert (etc)