const axios = require('axios');
require('dotenv').config();

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

module.exports = {
  getQuestions,
};
