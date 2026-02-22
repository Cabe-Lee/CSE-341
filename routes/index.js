const routes = require('express').Router();
// export from lesson1 controller
const lesson1controller = require('../controllers/lesson1Con');

// url routes
routes.get('/kj', lesson1controller.nameRoute);
routes.get('/stan', lesson1controller.stanRoute);

// login and dashboard routes
routes.get('/login', (req, res) => {
    res.render('login');
    res.send('Login Page');
});

routes.get('/dashboard', (req, res) => {
    res.render('dashboard');
    res.send('Dashboard Page');
});


routes.use('/contacts', require('./contacts'));
// routes.use('/professional', require('./professional'));

routes.use('/', require('./swagger'));
routes.use('/temples', require('./temple'));

routes.use('/players', require('./players'));
routes.use('/npcs', require('./npcs'));
// routes.use(
//     '/',
//     (docData = (req, res) => {
//         let docData = ({
//             documentationURL: 'localhost:8080',
//         });
//         res.json(docData);
//     })
// );

module.exports = routes;
