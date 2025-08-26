let username = "";
let language = "en";
let questions = [];
let currentQuestion = 0;
let score = 0;

// Go to login
function goToLogin() {
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("loginScreen").style.display = "block";
}

// Go to language screen
function goToLanguage() {
  username = document.getElementById("username").value;
  if (username.trim() === "") {
    alert("Please enter your name!");
    return;
  }
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("langScreen").style.display = "block";
}

// Set language and load questions from JSON file
async function setLanguage(lang) {
  language = lang;
  document.getElementById("langScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "block";

  try {
    const response = await fetch(`questions_${lang}.json`);
    questions = await response.json();

    currentQuestion = 0;
    score = 0;
    showQuestion();
  } catch (error) {
    console.error("Error loading questions:", error);
    alert("Could not load questions. Please check your JSON file!");
  }
}

// Show current question
function showQuestion() {
  let q = questions[currentQuestion];
  let quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = `
    <h2>${q.q}</h2>
    ${q.options.map(opt => 
      `<button class="optionBtn" onclick="checkAnswer('${opt}')">${opt}</button>`
    ).join("")}
  `;
  document.getElementById("progress").innerText = 
    `Question ${currentQuestion+1} of ${questions.length}`;
  document.getElementById("nextBtn").style.display = "none";
}

function checkAnswer(selected) {
  let correct = questions[currentQuestion].answer;
  let optionButtons = document.querySelectorAll(".optionBtn");

  optionButtons.forEach(btn => {
    if (btn.innerText === correct) {
      btn.classList.add("correct");
    } else if (btn.innerText === selected) {
      btn.classList.add("wrong");
    }
    btn.disabled = true;
  });

  if (selected === correct) {
    score++;
  }
  document.getElementById("nextBtn").style.display = "block";
}

// Next question
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// Show result
function showResult() {
  document.getElementById("quizScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "block";
  document.getElementById("finalScore").innerText = 
    `${username}, You scored ${score} out of ${questions.length}!`;
}

// Restart quiz
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById("resultScreen").style.display = "none";
  document.getElementById("welcomeScreen").style.display = "block";
}

// ✅ Quit quiz anytime
function quitQuiz() {
  document.getElementById("quizScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "block";
  document.getElementById("finalScore").innerText =
    `${username}, You quit the quiz! Your score is ${score} out of ${questions.length}.`;
}
