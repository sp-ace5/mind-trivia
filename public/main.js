/* eslint-disable no-undef */
let questionIndex = 0;
let score = 0;
let questions = [];

const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');

restartButton.style.display = 'none';
nextButton.addEventListener('click', showNextQuestion);
restartButton.addEventListener('click', restartGame);

// Async function to fetch our questions from the server.
async function fetchQuestions() {
  // Display a loading indicator that spins until the fetch is complete.
  questionContainer.innerHTML = '<div class="spinner-border text-light" role="status"></div>';

  try {
    const response = await fetch('/api/questions');
    const data = await response.json();
    questions = data;
    displayQuestion();
  } catch (error) {
    console.error('Failed to fetch questions:', error);
  }
}

// Function to display the question by index. Randomly sort questions and display them accordingly.
function displayQuestion() {
  const question = questions[questionIndex];
  if (!question) {
    endGameLogic();
    return;
  }

  const options = question.incorrect_answers.concat(question.correct_answer);
  options.sort(() => Math.random() - 0.5);

  const optionsHtml = options
    .map((option) => `<div class="col-sm-6 my-2 d-flex flex-wrap justify-content-center"><button class="option-btn btn btn-primary">${option}</button></div>`)
    .join('');

  questionContainer.innerHTML = `
    <h3>${question.question}</h3>
    ${optionsHtml}
  `;

  const optionButtons = document.querySelectorAll('.option-btn');
  optionButtons.forEach((button) => button.addEventListener('click', handleOptionClick));

  nextButton.style.display = 'none';
}

// Function to handle the user clicking on an option button and if it's the correct guess; increment score by one.
function handleOptionClick(event) {
  const optionButtons = document.querySelectorAll('.option-btn');
  optionButtons.forEach((button) => {
    button.removeEventListener('click', handleOptionClick);
  });

  const selectedOption = event.target.textContent;
  const currentQuestion = questions[questionIndex];
  const correctOption = currentQuestion.correct_answer;

  if (selectedOption === correctOption) {
    event.target.classList.add('btn-success');
    score++;
  } else {
    event.target.classList.add('btn-danger');
    optionButtons.forEach((button) => {
      if (button.textContent === correctOption) {
        button.classList.add('btn-success');
      }
    });
  }
  nextButton.style.display = 'block';
}

// Function to display the next question in the questions array by increasing the index by one.
function showNextQuestion() {
  const currentQuestion = questions[questionIndex];
  const { category } = currentQuestion;

  questionIndex++;
  answerQuestion(category);
  displayQuestion();
  scoreElement.textContent = score;
  nextButton.style.display = 'none';
}

function displayGameOver() {
  questionContainer.innerHTML = '<h2>Trivia game is over!</h2>';
  nextButton.style.display = 'none';
  restartButton.style.display = 'block';
  console.log(categoryCounters);
}

function restartGame() {
  questionContainer.innerHTML = '';
  restartButton.style.display = 'none';
  scoreElement.textContent = 0;
  score = 0;
  questionIndex = 0;
  fetchQuestions();
}

// Define the categoryCounters object
const categoryCounters = {
  'General Knowledge': 0,
  'Entertainment: Books': 0,
  'Entertainment: Film': 0,
  'Entertainment: Music': 0,
  'Entertainment: Musicals & Theatres': 0,
  'Entertainment: Television': 0,
  'Entertainment: Video Games': 0,
  'Entertainment: Board Games': 0,
  'Science & Nature': 0,
  'Science: Computers': 0,
  'Science: Mathematics': 0,
  Mythology: 0,
  Sports: 0,
  Geography: 0,
  History: 0,
  Politics: 0,
  Art: 0,
  Celebrities: 0,
  Animals: 0,
  Vehicles: 0,
  'Entertainment: Comics': 0,
  'Science: Gadgets': 0,
  'Entertainment: Japanese Anime & Manga': 0,
  'Entertainment: Cartoon & Animations': 0,
};

// Async function to send the end game results to the server
async function endGameLogic() {
  try {
    console.log('Before sending results:', categoryCounters);
    await axios.post('/api/saveResults', {
      categoryCounters,
    });
    console.log('Game results saved.');
    displayGameOver();
  } catch (error) {
    console.error('Error saving game results:', error);
  }
}

// Function to increment counters when a question is answered
function answerQuestion(category) {
  categoryCounters[category]++;
  console.log(categoryCounters);
}

function showMsgContainer(message) {
  const popup = document.getElementById('msgContainer');
  popup.innerText = message;
  popup.style.display = 'block';

  setTimeout(() => {
    popup.style.visibility = 'hidden';
  }, 3000);
}

const urlParams = new URLSearchParams(window.location.search);

const logoutSuccess = urlParams.get('logout');
if (logoutSuccess) {
  showMsgContainer('You have been successfully logged out.');
}

const registered = urlParams.get('registered');
if (registered) {
  showMsgContainer('You have been successfully registered.');
}

const login = urlParams.get('login');
if (login) {
  showMsgContainer('You have been successfully login.');
}

function drawChart() {
  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(fetchDataAndDraw);
}

function fetchDataAndDraw() {
  axios.get('/api/user_stats')
    .then((response) => {
      const userStatsData = response.data;
      drawActualChart(userStatsData);
    })
    .catch((error) => console.error(error));
}

function drawActualChart(userStatsData) {
  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Category');
  data.addColumn('number', 'Value');

  Object.entries(userStatsData).forEach(([category, value]) => {
    if (category !== 'user_id') {
      data.addRow([category, value]);
    }
  });

  const options = {
    title: 'Number of questions answered by category',
    width: 400,
    height: 400,
  };

  // Draw the pie chart
  const chart = new google.visualization.PieChart(document.getElementById('userStatsPieChart'));
  chart.draw(data, options);

  // Draw the bar chart with the same options
  const barChart = new google.visualization.BarChart(document.getElementById('userStatsBarChart'));
  barChart.draw(data, options);
}

fetchQuestions();
