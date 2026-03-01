const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const { loadConfig } = require('../config/config');
const Player = require('../models/players')(mongoose);
const User = require('../models/user')(mongoose);

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
      clientID: loadConfig().GOOGLE_CLIENT_ID,
      clientSecret: loadConfig().GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    }, (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }));
  };

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
});