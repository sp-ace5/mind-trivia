/* eslint-disable import/extensions */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const { passport, checkAuthenticated } = require('./userController.js');
const sequelize = require('./db');

const app = express();
const { SERVER_PORT } = process.env;
const {
  getQuestions,
  saveGameResults,
  registerUser,
  getUserStats,
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
  cookie: { secure: false },
}));
app.use(express.urlencoded({
  extended: true,
}));
app.use(passport.initialize());
app.use(passport.session());
// Serve static files from public folder.
app.use(express.static(path.join(__dirname, '../public')));

// Save user stats to database if user is authenticated
app.post('/api/saveResults', checkAuthenticated, async (req, res) => {
  console.log('Save results route hit');
  try {
    const result = await saveGameResults(req, req.body.categoryCounters);
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error saving game results:', error);
    res.status(500).json({ message: 'Error saving game results' });
  }
});

// Route to fetch trivia questions from the API using the controller
app.get('/api/questions', getQuestions);

// User Registration Route
app.post('/api/register', registerUser);

// Route to fetch user stats from the database
app.get('/api/user_stats', getUserStats);

// User Login Route
app.post(
  '/api/login/',
  passport.authenticate('local', {
    successRedirect: '/index.html?login=true',
    failureRedirect: '/login.html?login=false',
  }),
  (err, req, res, next) => {
    if (err) next(err);
  },
);

// Logout Route
app.post('/api/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/index.html?logout=true');
  });
});

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
