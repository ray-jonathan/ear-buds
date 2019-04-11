// functions for res.render-ing user info from routes

const  Message = require('../models/messages');

async function getMessages(req, res){
    // const matches = await Message.getMatches(req.session.passport.user.id)
    // console.log(matches)
    // console.log(req.session.user)
    const matchIdsForCurrentUser = await Message.getMatchId(2);
    // console.log("matchIdsForCurrentUser: ", matchIdsForCurrentUser);
    let allConversationsWithUser = [];
    for(let i = 0; i < matchIdsForCurrentUser.length; i++) { // forEach and map were giving us headache, back to basics
        let aConversation = await Message.getMessagesByMatch(matchIdsForCurrentUser[i].id);
        allConversationsWithUser.push(aConversation);
    }
    console.log(allConversationsWithUser);
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // // The below code should be a function that iterates over allConversationsWithUser and pulls out aConversation that has the latest timestamp // 
    const mostRecent = await Message.getMostRecentMessage(matchIdsForCurrentUser[1].id);
    // console.log("Most recent message: ",mostRecent);
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    res.render('./messages.html', {
        locals: { 
            // user: req.session.passport.user
            recent: mostRecent,
            allMessages: allConversationsWithUser,
            

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