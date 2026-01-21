// express web server & Mongo DB connection setup
const express = require('express');
const bodyParser = require('body-parser');
const professionalRoutes = require('./routes/professional');
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('./db/connect');

const port = process.env.PORT || 8080;

const app = express();
app
    .use(bodyParser.json())
    .use(express.static('frontend'))
    .use('/', require('./routes'))
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    })
    .use('/professional', professionalRoutes)
    
    .use((req, res, next) => {
        res.status(404).send('Route not found. Please check the URL.');
    });

mongodb.initDb((err, mongodb) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`✅ Web Server is listening at port ${port}\n...`);
    }
});

console.log();