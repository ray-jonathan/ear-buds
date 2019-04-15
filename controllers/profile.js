// functions for res.render-ing user info from routes

const  Profile = require('../models/profile');
const  Artists = require('../models/artists');
const {
    getTop3Artists,
    getRecentlyPlayed
    } = require('../controllers/artists');
const Match = require('../models/match');
const Message = require('../models/messages');

async function getProfile(req, res, next){
    const firstVisitBool = await Profile.checkSpotifyID(req.session.passport.user.id);
    let user;
    if (!(firstVisitBool.exists)){
        await Profile.add(req.session.passport.user);
        user = await Profile.getBySpotifyId(req.session.passport.user.id);
        req.session.userid = user.id;
        await getTop3Artists(req, res, next, req.session.passport.accessToken);
        console.log("You should see this");
        console.log(" ");
        console.log(" ");
        console.log(" ");
        await getRecentlyPlayed(req, res, next, req.session.passport.accessToken);
    }
    else{
        user = await Profile.getBySpotifyId(req.session.passport.user.id);
        req.session.userid = user.id;
    }
    // console.log(thing);
    // by this time, the user is for sure in the db
    const userArrayOfArtists = await Artists.getArtists(user.id);
    const emptyObject = {
        id: '',
        user_id: '',
        artist_name: 'Add an artist',
        artist_picture: 'http://secure.hmepowerweb.com/Resources/Images/NoImageAvailableLarge.jpg'
    };
    let artistIncompleter = false;
    if(userArrayOfArtists.length !== 4){
        artistIncompleter = true;
        while(userArrayOfArtists.length < 4){
            emptyObject.id = null;
            userArrayOfArtists.push(emptyObject);
            // console.log(emptyObject);
        }
        while(userArrayOfArtists.length > 4){
            userArrayOfArtists.pop();
        }
    }


    const pagePath = (((req.url).split('/')[1]));


    let messageNotification;
    // // Code for adding message notification icon when there is an unread message
    // get all of a user's matches
    let arrayOfMatchObjects = await Match.getMatchesThatUserIsIn(req.session.userid);
    // filter out the blocked folks
    arrayOfMatchObjects = arrayOfMatchObjects.filter((matchObject) => {
        return (matchObject.blocked !== true);
    });
    // console.log("arrayOfMatchObjects", arrayOfMatchObjects);
    // make an array of the match ids
    let arrayOfMatchIDs = arrayOfMatchObjects.map((matchObject) => {
        return matchObject.id;
    });
    // console.log("arrayOfMatchIDs ", arrayOfMatchIDs);
    // get all the messages that have those match ids
    let arrayOfMessages = [];
    for(let i = 0; i < arrayOfMatchIDs.length; i++) { // forEach and map were giving us headache, back to basics
        const newMessage = await Message.getConversationByMatchId(arrayOfMatchIDs[i]);
        arrayOfMessages.push(newMessage);
    }
    // console.log("arrayOfMessages ", arrayOfMessages);
    // reverse the array that you just produced, making it descend chronologically
    let reverseArrayOfMessages = arrayOfMessages.reverse();
    // grab the match_id of the first item in that array
    let niftyNewArray = [];
    reverseArrayOfMessages.forEach(message => {
        if(message.length > 0){
            niftyNewArray.push(message);
            return message;
        }
    });
    // console.log("niftyNewArray ", niftyNewArray);
    if(niftyNewArray.length > 0){
        if(!(niftyNewArray[0])){
                console.log("Safely aborting!");
                res.redirect('/profile');
            }
            // console.log(" ");
        const you = await Profile.getUserById(req.session.userid);
        // console.log(you.last_vist);
        if(((niftyNewArray[0].reverse())[0].timestamp) > you.last_visit){
            console.log("New messages waiting for you!");
            messageNotification = true;
        }else{
            console.log(" No new message");
            messageNotification = false;
        }
        // const mostRecentMatchIdConversedWith = niftyNewArray[0][0].matches_id;
        // // use that match_id to find the users in the matches table by that id
        // const matchObject = await Match.getMatchById(mostRecentMatchIdConversedWith);
    }
    else{
        messageNotification = false;
    }
    //////////////////////////////////////////////////////////////////
    console.log("messageNotification ", messageNotification);
    // render the profile page!
    function renderProfile(){
        res.render('profile.html', {
            locals: { 
                userId: user.id,
                userSpotifyId: user.spotifyId,
                userName: user.name,
                userPhoto: user.picture,
                userArtists: userArrayOfArtists,
                artistIncomplete: artistIncompleter,
                hideMe: false,
                firstVist: firstVisitBool.exists,
                pagePath: pagePath
                ,messageNotification: messageNotification

            },
            partials:{
                headPartial: './partial-head',
                navPartial: './partial-nav'
            }
            });
            return;
    }
    renderProfile();
}


module.exports = {
    getProfile
};

// // Notes on Axios:
// const axios = require('axios');
// axios.{{METHOD}}('{{URL}}').then((response)=>{console.log(response)});
// // example of GET and POST with options:
// axios.get('/user', {params: {ID: 12345}}).then(function (response) {console.log(response);}).catch(function (error) {console.log(error);});
// axios.post('/user', {firstName: 'Fred',lastName: 'Flintstone'}).then(function (response) {console.log(response);}).catch(function (error) {console.log(error);});
// // there's even support for Promise.All: https://www.npmjs.com/package/axios#user-content-example

// // API FRAMEWORK // //

// // Top three artists for logged-in user
// Endpoint: https://api.spotify.com/v1/me/top/{type}?time_range={time_range}&limit={limit}
// Type: artists
// Time Range: short_term
// Limit: 3
// Scopes: user-top-read
// Returns: Object
// Desired Info: Object.items[n] .name, .images[2].url

// // Lookup and add artist to list
// Endpoint: https://api.spotify.com/v1/search?q={Lucy%20Dacus}&type={artist}&limit={1}
// q: [Artist Name] (needs to be url-encoded)
// Type: artist
// Limit: 1
// Scopes: null
// Returns: Object
// Desired Info: Object.artists.items[n] .name, .images[2].url



// // DB FRAMEWORK // //

// // Update/Insert top_artists table 

