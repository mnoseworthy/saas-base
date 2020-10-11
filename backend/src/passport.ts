import passport from 'passport';
import passportFacebook from 'passport-facebook';
import { User } from './Models/User'
import * as config from "./config";
const FacebookStrategy = passportFacebook.Strategy;

const PORT = process.env.PORT || config.SERVER_PORT;
const SERVER_ROOT_DOMAIN =  process.env.SERVER_ROOT_DOMAIN || config.SERVER_ROOT_DOMAIN;
const FACEBOOK_CLIENT_ID =  process.env.FACEBOOK_CLIENT_ID || config.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET =  process.env.FACEBOOK_CLIENT_SECRET || config.FACEBOOK_CLIENT_SECRET;

// Register Facebook Passport strategy
passport.use(new FacebookStrategy({
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: `${SERVER_ROOT_DOMAIN}:${PORT}/auth/facebook/callback`,
        profileFields: ['id','email','first_name','last_name','picture']
    },
    // Gets called when user authorizes access to their profile
    async function (accessToken : string, refreshToken : string, profile : any, done : any) {
        console.log("FB Authorize Callback")
        //console.log(profile);
        let user : User = await User.findOne({ uuid: profile.id })
        if (user === undefined) {
            // Create new user
            console.log("Creating new user...")
            user = new User;
            user.email = profile.emails[0];
            user.uuid = profile.id;
            user = await user.save();
            done(null, user)
        } else {
            // User signed in
            console.log("User existed, signing in...")
            done(null, user)
        }
    }
));

// Serialize user into the sessions
passport.serializeUser((user : User , done) => {
    console.log("serializeUser")
    console.log(user);
    done(null, user.uuid);
});

// Deserialize user from the sessions
passport.deserializeUser((uuid : string, done) => {
    console.log("deserializeUser")
    User.findOne({ where: { uuid } }).then(function(user){
        done(null, user);
    }) 
});
