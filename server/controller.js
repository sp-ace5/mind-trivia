const axios = require('axios');
const bcrypt = require('bcrypt');
const { UserStats, User } = require('./userModel');

// Function to fetch questions from the API using axios
async function getQuestions(req, res) {
  try {
    const amount = 2;
    const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}`);
    const questions = response.data.results;
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ error: 'Error fetching questions' });
  }
}

// Save the user stats
async function saveGameResults(req, categoryCounter) {
  try {
    if (req.isAuthenticated()) {
      const userId = req.user.user_id;
      const userStats = await UserStats.findOne({ where: { user_id: userId } });
      console.log('User Stats:', userStats);
      if (userStats) {
        console.log('User statistics found for user_id:', userId);
        userStats.total_questions_answered += categoryCounter.totalQuestionsAnswered;

        Object.entries(categoryCounter).forEach(([category, value]) => {
          if (category !== 'totalQuestionsAnswered') {
            userStats[category] += value;
            console.log(`Updating ${category} with value ${value}`);
          }
        });

        // Save the updated userStats object
        console.log(userStats);
        await userStats.save();
      } else {
        console.error('User statistics not found for user_id:', userId);
      }
    } else {
      console.error('User not authenticated.');
    }
  } catch (error) {
    console.error('Error saving game results:', error);
    throw error;
  }
}

// Register new user to the database and login user in.
// eslint-disable-next-line consistent-return
async function registerUser(req, res, next) {
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

    // Authenticate the user after creating the account
    req.login(newUser, (err) => {
      if (err) {
        console.error('Error logging in user after registration:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      // Registration and login successful
      console.log('Registration and login successful');
      res.redirect('/index.html?registered=true');
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

function checkAuthentication(req, res) {
  res.json({ isAuthenticated: req.isAuthenticated() });
}

module.exports = {
  getQuestions,
  saveGameResults,
  registerUser,
  checkAuthentication,
};
