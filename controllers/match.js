// functions for res.render-ing user info from routes

// const  Match = require('../models/match');

async function getMatch(req, res){
    res.render('match.html', {
        locals: { 
            user: req.session.passport.user
        },
        partials:{
            headPartial: './partial-head'
        }
    });
}

module.exports = {
    getMatch
};