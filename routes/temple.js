const routes = require('express').Router();
const temples = require('../controllers/temple.js');
const { verifyToken } = require('../middleware/auth');

// Public routes - GET requests are accessible without authentication
routes.get('/', temples.findAll);

// Protected routes - require JWT token authentication
routes.post('/', verifyToken, temples.create);

// Retrieve a single Temple with id
routes.get('/:temple_id', temples.findOne);

// Update a Temple with id
// routes.put('/:id', temples.update);

// Delete a Temple with id
// routes.delete('/:id', temples.delete);

// Create a new Temple
// routes.delete('/', temples.deleteAll);

module.exports = routes;
