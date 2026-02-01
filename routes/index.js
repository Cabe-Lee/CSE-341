const routes = require('express').Router();
// export from lesson1 controller
const lesson1controller = require('../controllers/lesson1Con');

// url routes
routes.get('/kj', lesson1controller.nameRoute);
routes.get('/stan', lesson1controller.stanRoute);

routes.use('/contacts', require('./contacts'));

routes.use('/', require('./swagger'));
routes.use('/temples', require('./temple'));
routes.use(
    '/',
    (docData = (req, res) => {
        let docData = ({
            documentationURL: 'localhost:8080',
        });
        res.json(docData);
    })
);

module.exports = routes;
