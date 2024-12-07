const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User'); // Modelo de usuario

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://futbol360.ddns.net/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Busca o crea el usuario en la base de datos
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            const sanitizedUsername = profile.displayName.replace(/\s+/g, '').toLowerCase();
            user = new User({
                googleId: profile.id,
                username: sanitizedUsername,
                email: profile.emails[0].value,
                fotoPerfil: profile.photos[0].value,
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "https://futbol360.ddns.net/api/auth/twitter/callback",
}, async (token, tokenSecret, profile, done) => {
    try {
        // Busca o crea el usuario en la base de datos
        let user = await User.findOne({ twitterId: profile.id });
        if (!user) {
            user = new User({
                twitterId: profile.id,
                username: profile.username,
                email: profile.emails[0].value,
                fotoPerfil: profile.photos[0]?.value || null,
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
