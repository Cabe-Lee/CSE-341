const routes = require('express').Router();
// export from lesson1 controller
const lesson1controller = require('../controllers/lesson1Con');
// url routes
routes.get('/', lesson1controller.nameRoute);
routes.get('/stan', lesson1controller.stanRoute);

// routes.use('/contacts', require('./contacts'));

module.exports = routes;
