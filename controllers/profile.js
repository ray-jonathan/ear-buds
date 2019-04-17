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
        console.log(`~~~ NEW USER SIGN UP ~~~`);
        user = await Profile.getBySpotifyId(req.session.passport.user.id);
        console.log(`Name: ${user.name}`);
        console.log(`Spotify ID: ${user.id}`);
        req.session.userid = user.id;
        await getTop3Artists(req, res, next, req.session.passport.accessToken);
        // console.log("You should see this");
        // console.log(" ");
        // console.log(" ");
        // console.log(" ");
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


// // Code for adding message notification icon when there is an unread message
    let messageNotification;
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

    // put them in one big array
    let arrayOfMess = [];
    for(let i = 0; i < arrayOfMessages.length; i++){
        for(let j = 0; j < arrayOfMessages[i].length; j++){
            arrayOfMess.push(arrayOfMessages[i][j]);
        }
    }

    // sort that array by most recent
    arrayOfMess.sort((a,b) => {
        return b.timestamp - a.timestamp
    });

    // make sure the user has conversations
    if(arrayOfMess.length > 0){
        if(!(arrayOfMess[0])){
                console.log(`${user.id} is: `);
                console.log("safely aborting to /profile!");
                res.redirect('/profile');
            }
        const you = await Profile.getUserById(req.session.userid);
        
        // compare the latest message to the user's last visit to the messages page
        if((arrayOfMess[0].timestamp) > parseInt(you.last_vist)){
            // console.log("New messages waiting for you!");
            messageNotification = true;
        }else{
            // console.log(" No new message");
            messageNotification = false;
        }
    }
    else{
        messageNotification = false;
    }
//////////////////////////////////////////////////////////////////

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
                pagePath: pagePath,
                messageNotification: messageNotification

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

