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


// // DB FRAMEWORK // //

// // Potential matches for logged-in user to review
// inner join user_id from top_artists table where viewed_user_id from matches isn't

// // Add match result 
// insert (etc)