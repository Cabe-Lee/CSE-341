const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const { loadConfig } = require('./config');
const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');
const Player = require('../models/players');

const config = loadConfig();

module.exports = (passport) => {
  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const db = getDb();
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Local Strategy (email/password)
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        // Find user
        const db = getDb();
        const user = await db
          .collection('users')
          .findOne({ email: email, oauthProvider: 'local' });

        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        // Check if account is active
        if (!user.isActive) {
          return done(null, false, { message: 'Account is deactivated' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Google OAuth Strategy
  if (config.google.clientID && config.google.clientSecret) {
    passport.use(new GoogleStrategy(
      {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const db = getDb();
          const email = profile.emails[0].value;

          // Check if user already exists with Google ID
          let user = await db.collection('users').findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          }

          // Check if user exists with same email (might be local account)
          user = await db.collection('users').findOne({ email: email });

          if (user) {
            // Link Google account to existing user using updateOne
            await db.collection('users').updateOne(
              { _id: user._id },
              { 
                $set: { 
                  oauthProvider: 'google',
                  googleId: profile.id,
                  image: profile.photos[0]?.value || user.image
                } 
              }
            );
            // Fetch updated user
            user = await db.collection('users').findOne({ _id: user._id });
            return done(null, user);
          }

          // Create new user with Google info
          const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstname: profile.name?.givenName || '',
            lastname: profile.name?.familyName || '',
            image: profile.photos[0]?.value || '',
            email: email,
            username: profile.displayName || email.split('@')[0],
            oauthProvider: 'google',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const result = await db.collection('users').insertOne(newUser);
          newUser._id = result.insertedId;
          
          return done(null, newUser);
        } catch (error) {
          console.error('Google OAuth Error:', error);
          return done(error);
        }
      }
    ));
  } else {
    console.warn('Google OAuth not configured: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing');
  }
};
