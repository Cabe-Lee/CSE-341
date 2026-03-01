const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth');
const { verifyToken } = require('../middleware/auth');

// Public routes - Local authentication

// Register with email/password
router.post('/register', authController.register);

// Login with email/password
router.post('/login', authController.login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login?error=google_failed' }),
  authController.googleAuthCallback
);

// Protected routes (require JWT token)

// Get current user
router.get('/me', verifyToken, authController.getCurrentUser);

// Change password (for local accounts)
router.post('/change-password', verifyToken, authController.changePassword);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
