/* eslint-disable import/extensions */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sequelize = require('./db');
const User = require('./userModel');
const strategy = require('./userController');

const app = express();
const { SERVER_PORT } = process.env;
const {
  getQuestions,
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

// Route to fetch trivia questions from the API using the controller
app.get('/api/questions', getQuestions);

// Serve static files from public folder.
app.use(express.static(path.join(__dirname, '../public')));

// User Registration Route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists in the database
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user in the database
    const newUser = await User.create({ username, password: hashedPassword });

    // Registration successful
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login Route
app.post('/api/login', passport.authenticate('local'), (req, res) => {
  // If the authentication is successful, this callback will be called.
  // You can handle the response here, such as sending a success message or redirecting to a dashboard.
  res.json({ message: 'Login successful' });
});

// Logout Route
app.get('/api/logout', (req, res) => {
  // Passport provides the `logout` function to terminate a login session.
  // It will clear the login session and remove the `req.user` property.
  req.logout();
  res.json({ message: 'Logged out successfully' });
});

// Protected Route
app.get('/api/dashboard', (req, res) => {
  // This route is protected and requires the user to be authenticated.
  // Passport's session handling will ensure that only authenticated users can access this route.
  if (req.isAuthenticated()) {
    res.json({ message: 'Welcome to the dashboard!' });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Start the app on the default port
app.listen(SERVER_PORT, async () => {
  console.log(`app listening at http://localhost:${SERVER_PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
