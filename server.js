// express web server & Mongo DB connection setup
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
// const bodyParser = require('body-parser');
const { initDb } = require('./db/connect');

// const professionalRoutes = require('./routes/professional');



// const swaggerAutogen = require('swagger-autogen');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// Middleware setup
app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('frontend'));

// Routes
app.use('/', require('./routes'));
    
app.use((req, res, next) => {
    res.status(404).send('Route not found. Please check the URL.');
});

// MongoDB connection
initDb((err) => {
  if (err) {
    console.log('MongoDB connection error:', err);
  } else {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log('Connected to MongoDB');
    });
  }
});

console.log();