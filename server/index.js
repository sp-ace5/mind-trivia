/* eslint-disable import/extensions */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('./userController.js');
const sequelize = require('./db');

const app = express();
const { SERVER_PORT } = process.env;
const {
  getQuestions,
  logout,
  saveGameResults,
  registerUser,
  loginUser,
  checkAuthentication,
} = require('./controller.js');

require('dotenv').config();

// Middleware to parse request bodies as JSON
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
// Serve static files from public folder.
app.use(express.static(path.join(__dirname, '../public')));

// Route to fetch trivia questions from the API using the controller
app.get('/api/questions', getQuestions);

// User Registration Route
app.post('/api/register', registerUser);

// User Login Route
app.post(
  '/api/login/',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  (req, res) => {
    res.redirect('/index.html?login=true');
  },
);

// Logout Route
app.post('/api/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/index.html?logout=true');
  });
});

// Save user stats to database
app.post('/api/saveResults', saveGameResults);

app.get('/api/checkAuthentication', checkAuthentication);

// Start the app on the default port and test database connection
app.listen(SERVER_PORT, async () => {
  console.log(`app listening at http://localhost:${SERVER_PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
