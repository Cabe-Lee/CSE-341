function loadConfig() {
  require('dotenv').config();

  const config = {
    mongodbUri: process.env.MONGODB_URI,
    port: process.env.PORT || 8080,
    
    // JWT Configuration
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    
    // Google OAuth Configuration
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
    },
    
    // Session Configuration
    session: {
      secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      }
    }
  };

  // Basic validation
  if (!config.mongodbUri) {
    throw new Error('MONGODB_URI is required');
  }

  return config;
}

module.exports = { loadConfig };
