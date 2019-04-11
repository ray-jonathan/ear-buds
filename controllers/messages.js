// functions for res.render-ing user info from routes

const  Message = require('../models/messages');

async function getMessages(req, res){
    const allMessages = await Message.getMessagesByMatch(1);
    //////////need to figure out which user it is/////////////
    // console.log(something);
    // console.log(typeof something)
    const mostRecent = await Message.getMostRecentMessage(1);
    console.log(mostRecent)
    res.render('./messages.html', {
        locals: { 
            // user: req.session.passport.user
            Messages: allMessages,
            recent: mostRecent,

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