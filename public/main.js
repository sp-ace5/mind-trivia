let questionIndex = 0;
let score = 0;
let questions = [];

const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');

// Hide restart button on start
restartButton.style.display = 'none';

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
    showEndMessage();
    return;
  }

  const options = question.incorrect_answers.concat(question.correct_answer);
  options.sort(() => Math.random() - 0.5);

  const optionsHtml = options
    .map((option) => `<div class="col-sm-6 my-2 d-flex flex-wrap justify-content-center"><button class="option-btn btn btn-primary">${option}</button></div>`)
    .join('');

  questionContainer.innerHTML = `
    <h2>${question.question}</h2>
    ${optionsHtml}
  `;

  const optionButtons = document.querySelectorAll('.option-btn');
  optionButtons.forEach((button) => button.addEventListener('click', handleOptionClick));

  nextButton.style.display = 'none';
}

// Function to handle the user clicking on an option button and if it's the correct guess; increment score by one.
function handleOptionClick(event) {
  // Disable option buttons after clicking
  const optionButtons = document.querySelectorAll('.option-btn');
  optionButtons.forEach((button) => {
    button.removeEventListener('click', handleOptionClick);
  });

  const selectedOption = event.target.textContent;
  const currentQuestion = questions[questionIndex];
  const correctOption = currentQuestion.correct_answer;

  // Check if the selected option is correct or not
  if (selectedOption === correctOption) {
    // Change the button color to green for the correct guess
    event.target.classList.add('btn-success');
    score++;
  } else {
    // Change the button color to red for the wrong guess
    event.target.classList.add('btn-danger');

    // Find the correct option button and change its color to green
    optionButtons.forEach((button) => {
      if (button.textContent === correctOption) {
        button.classList.add('btn-success');
      }
    });
  }

  // Show the next button
  nextButton.style.display = 'block';
}

// Function to display the next question in the questions array by increasing the index by one.
function showNextQuestion() {
  questionIndex++;
  displayQuestion();
  scoreElement.textContent = score;
  nextButton.style.display = 'none';
}

// Function to display the end game screen.
function showEndMessage() {
  questionContainer.innerHTML = '<h2>Trivia game is over!</h2>';
  nextButton.style.display = 'none';
  restartButton.style.display = 'block';
}

function restartGame() {
  questionContainer.innerHTML = '';
  restartButton.style.display = 'none';
  scoreElement.textContent = 0;
  score = 0;
  questionIndex = 0;
  fetchQuestions();
}

// Add event handlers to the next/restart button to call a function when the button is clicked.
nextButton.addEventListener('click', showNextQuestion);
restartButton.addEventListener('click', restartGame);

// Call fetchQuestions() to start the game loop.
fetchQuestions();
