const routes = require('express').Router();
// export from lesson1 controller
const lesson1controller = require('../controllers');
// url routes
routes.get('/', lesson1controller.nameRoute);
routes.get('/stan', lesson1controller.stanRoute);

module.exports = routes;
