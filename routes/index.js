const routes = require('express').Router();
// export from lesson1 controller
const lesson1controller = require('../controllers/lesson1Con');

// url routes
routes.get('/kj', lesson1controller.nameRoute);
routes.get('/stan', lesson1controller.stanRoute);

// Login route - render login page with login layout
routes.get('/login', (req, res) => {
    res.render('login', { layout: 'loginLayout' });
});

// Registered route - shows user info after successful registration
routes.get('/registered', async (req, res) => {
    // User info is stored in localStorage by the client after registration
    // We can also check for token in query or header
    const token = req.query.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (token) {
        try {
            const jwt = require('jsonwebtoken');
            const { loadConfig } = require('../config/config');
            const config = loadConfig();
            
            const decoded = jwt.verify(token, config.jwtSecret);
            
            // Get user from database - need to convert string id to MongoDB ObjectId
            const { getDb } = require('../db/connect');
            const { ObjectId } = require('mongodb');
            const db = getDb();
            
            let userId;
            try {
                userId = new ObjectId(decoded.id);
            } catch (e) {
                userId = decoded.id;
            }
            
            const user = await db.collection('users').findOne({ _id: userId });
            
            if (user) {
                return res.render('registered', { 
                    layout: 'main', 
                    user: {
                        username: user.username,
                        email: user.email,
                        createdAt: user.createdAt ? user.createdAt.toDateString() : new Date().toDateString()
                    },
                    loginMethod: user.oauthProvider === 'google' ? 'Google' : 'Local'
                });
            }
        } catch (error) {
            console.error('Token verification error:', error);
        }
    }
    
    // Render the registered page without server-side user data
    // The client will populate it from localStorage
    res.render('registered', { layout: 'main' });
});

// Dashboard route - requires authentication (JWT token or passport session)
routes.get('/dashboard', async (req, res) => {
    // Check for JWT token in query, header, or localStorage (via cookie)
    const token = req.query.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (token) {
        // Verify token and get user info
        try {
            const jwt = require('jsonwebtoken');
            const { loadConfig } = require('../config/config');
            const config = loadConfig();
            
            const decoded = jwt.verify(token, config.jwtSecret);
            
            // Get user from database - need to convert string id to MongoDB ObjectId
            const { getDb } = require('../db/connect');
            const { ObjectId } = require('mongodb');
            const db = getDb();
            
            let userId;
            try {
                userId = new ObjectId(decoded.id);
            } catch (e) {
                userId = decoded.id;
            }
            
            const user = await db.collection('users').findOne({ _id: userId });
            
            if (user) {
                return res.render('dashboard', { layout: 'main', user: user, token: token });
            }
        } catch (error) {
            console.error('Token verification error:', error);
        }
    }
    
    // Check if authenticated via passport session
    if (req.isAuthenticated()) {
        return res.render('dashboard', { layout: 'main', user: req.user });
    }
    
    // Not authenticated - redirect to login
    return res.redirect('/login');
});

routes.use('/contacts', require('./contacts'));
// routes.use('/professional', require('./professional'));

routes.use('/', require('./swagger'));
routes.use('/temples', require('./temple'));

routes.use('/players', require('./players'));
routes.use('/npcs', require('./npcs'));

module.exports = routes;
