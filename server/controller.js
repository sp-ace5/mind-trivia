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
    const userId = req.user.user_id;
    console.log(categoryCounter);
    const [userStats] = await UserStats.findOrCreate({ where: { user_id: userId } });

    Object.entries(categoryCounter).forEach(([category, value]) => {
      if (category !== 'totalquestionsanswered') {
        const formattedCategory = category.replace(/:\s+/g, ': ').replace(/ & /g, ' &');
        userStats[formattedCategory] += value;
        console.log(`Updating ${formattedCategory} with value ${value}`);
      }
    });

    await userStats.save();
    return { success: true, message: 'Game results saved.' };
  } catch (error) {
    console.error('Error saving game results:', error);
    throw error;
  }
}
module.exports = saveGameResults;

// Register new user to the database and login user in.
// eslint-disable-next-line consistent-return
async function registerUser(req, res) {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({ username, password: hashedPassword });

    req.login(newUser, (err) => {
      if (err) {
        console.error('Error logging in user after registration:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      console.log('Registration and login successful');
      res.redirect('/index.html?registered=true');
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const stats = await UserStats.findOne({ where: { user_id: userId } });
    res.json(stats);
    console.log(stats, 'Get user stats route hit OMGGGGGGGGGGGGGGGGG');
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error });
  }
};

module.exports = {
  getQuestions,
  saveGameResults,
  registerUser,
  getUserStats,
};
