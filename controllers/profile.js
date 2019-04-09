// functions for res.render-ing user info from routes

// const  Profile = require('../models/profile');

async function getProfile(req, res){
    res.render('profile.html', {
        locals: { 
            user: req.session.passport.user
        },
        partials:{
            headPartial: './partial-head'
        }
    });
}

module.exports = {
    getProfile
};


