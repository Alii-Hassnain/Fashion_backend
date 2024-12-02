// var GoogleStrategy = require('passport-google-oauth20').Strategy;
// const passport = require('passport');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/userModel');
const { generateAccessAndRefreshToken } = require('../controllers/userControler');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
},
    async (accessToken, refreshToken, profile, cb) => {
        console.log("profile : ", profile);
        try {
            // let user=await User.findOne({email:profile._json.email});
            let user = await User.findOne(
                {
                    $or:
                        [
                            { username: profile._json.name },
                            { email: profile._json.email }
                        ]
                });
            if (!user) {
                // const lastSixDigitId = profile.id.substring(profile.id.length - 6)
                // const newPassword = lastSixDigitId + lastTwoDigitsOfId
                // const lastTwoDigitsOfId = profile._json.name.substring(profile._json.name.length - 2)

                if (user) {
                    user.username = profile._json.name + "_" + Date.now();
                }
                user = await User.create({
                    username: profile._json.name,
                    email: profile._json.email,
                    isVerified: true,
                    password: profile._json.name
                })
            }
            // const accessToken = await user.generateAccessToken();
            // const refreshToken = await user.generateRefreshToken();
            // Generate jwt token 
            const { refreshToken, accessToken ,accessTokenExpiresIn,refreshTokenExpiresIn} = await generateAccessAndRefreshToken(user._id)
            return cb(null, { user, accessToken, refreshToken });
                //  accessTokenExpiresIn, refreshTokenExpiresIn });
        } catch (error) {
            console.log("error in google strategy : ", error)
            return cb(error);
        }




        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
    }
));