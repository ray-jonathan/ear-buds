// functions for res.render-ing user info from routes

const  Message = require('../models/messages');

async function getMessages(req, res){
    // const matches = await Message.getMatches(req.session.passport.user.id)
    // console.log(matches)
    // console.log(req.session.user)
    const allZeMatches = await Message.getMatchId(2);
    console.log(allZeMatches)
    let groupsOfMessages = []
    for(let i = 0; i < allZeMatches.length; i++) {
        let oneGroup = await Message.getMessagesByMatch(allZeMatches[i].id)
        groupsOfMessages.push(oneGroup);
    }
    console.log(groupsOfMessages);
    //////////need to figure out which user it is/////////////
    const mostRecent = await Message.getMostRecentMessage(1);
    // console.log(mostRecent)
    res.render('./messages.html', {
        locals: { 
            // user: req.session.passport.user
            recent: mostRecent,
            allMessages: groupsOfMessages,
            

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