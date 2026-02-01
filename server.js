// express web server & Mongo DB connection setup
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');

const professionalRoutes = require('./routes/professional');



const swaggerAutogen = require('swagger-autogen');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use(require('cors'))
    .use(express.urlencoded({ extended: true }))
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
    
const db = require('./models');
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log('Connected to the database!');
    app.listen(port);
    console.log(`✅ Web Server is listening at port ${port}\n...`);
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

console.log();