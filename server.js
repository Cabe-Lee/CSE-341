// express web server & Mongo DB connection setup
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const passport = require('passport');
const session = require('express-session');
const { initDb } = require('./db/connect');
const { loadConfig } = require('./config/config');

// Load configuration
const config = loadConfig();

// Passport configuration
require('./config/passport')(passport);

// Middleware setup
app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('frontend'));

// Session middleware
app.use(session({
  secret: config.session.secret,
  resave: config.session.resave,
  saveUninitialized: config.session.saveUninitialized,
  cookie: config.session.cookie
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes'));
    
app.use((req, res, next) => {
    res.status(404).send('Route not found. Please check the URL.');
});

process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

// logging
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// handlebars setup
const { engine } = require('express-handlebars');
app.engine('hbs', engine({ 
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layout/'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

// Make user available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
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
