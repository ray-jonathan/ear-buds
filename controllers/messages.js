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