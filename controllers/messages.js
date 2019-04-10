// functions for res.render-ing user info from routes

// const  Message = require('../models/message');

async function getMessages(req, res){
    res.render('./messages.html', {
        locals: { 
            user: req.session.passport.user
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