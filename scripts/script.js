"use strict";

const baseUL = document.querySelector(".btn-container");
const intro = document.querySelector(".intro");
const quiz = document.querySelector(".quiz");
const headerLabel = document.querySelector(".header-left");
const questionNumOnText = document.querySelector(".question-on-text");
const theQuestion = document.querySelector(".the-question");
const btnAnswer = document.querySelector(".btn-answer");
const subjectContainer = document.querySelector(".subjects-container");

let theData; //I'm sure there is a cleaner way to do this
// let numOfQuestions = 0;
// let questionCount = 1;
// let nextQuestion = 0;
let score = 0;
const currentQuiz = {
  index: 0,
  answer: "unknown",
  location: 0,
  correct: 0,
  nextQuestion: 0,
  questionCount: 1,
  numOfQuestions: 0,
};

async function fetchJson() {
  const res = await fetch("../data.json");
  theData = await res.json();
  init(theData);
  setSelectionListener();
  console.log(theData);
}
fetchJson();

function init(data) {
  data.quizzes.forEach((e) => {
    //the -1 is to trigger the if statement.
    createQuizButton(e, -1);
  });
}

function runSelection(e) {
  //TODO may add these three lines to a separate function
  intro.classList.add("hidden");
  quiz.classList.remove("hidden");
  btnAnswer.classList.remove("hidden");

  const choice = { HTML: 0, CSS: 1, Javascript: 2, Accessibility: 3 };

  switch (e.target.textContent) {
    case "HTML": {
      currentQuiz.numOfQuestions = theData.quizzes[currentQuiz.index].questions.length;
      renderQuizHeader(choice.HTML);
      renderQuiz(currentQuiz.index);
      break;
    }
    case "CSS": {
      currentQuiz.numOfQuestions = theData.quizzes[currentQuiz.index].questions.length;
      renderQuizHeader(choice.CSS);
      renderQuiz(currentQuiz.index);
      break;
    }
    case "JavaScript": {
      currentQuiz.numOfQuestions = theData.quizzes[currentQuiz.index].questions.length;
      renderQuizHeader(choice.Javascript);
      renderQuiz(currentQuiz.index);
      break;
    }
    case "Accessibility": {
      currentQuiz.numOfQuestions = theData.quizzes[currentQuiz.index].questions.length;
      renderQuizHeader(choice.Accessibility);
      renderQuiz(currentQuiz.index);
      break;
    }
  }
}
function setSelectionListener() {
  const btn = document.querySelectorAll("button.subject");

  btn.forEach((e) => {
    e.addEventListener("click", runSelection);
  });
}
function renderQuizHeader(section) {
  const img = document.createElement("img");

  img.classList.add(`img-${theData.quizzes[section].title}`);
  img.src = theData.quizzes[section].icon;

  const h3 = document.createElement("h3");
  h3.textContent = theData.quizzes[section].title;

  headerLabel.append(img);
  headerLabel.appendChild(h3);
}
function clearUL() {
  if (baseUL.innerHTML !== "") {
    baseUL.innerHTML = "";
  }
}
function renderQuiz(i) {
  clearUL();

  let asciiIndex = 65;

  questionNumOnText.textContent = `Question ${currentQuiz.questionCount} of ${currentQuiz.numOfQuestions}`;

  theQuestion.textContent = theData.quizzes[i].questions[currentQuiz.nextQuestion].question;

  currentQuiz.answer = theData.quizzes[i].questions[currentQuiz.nextQuestion].answer;

  theData.quizzes[i].questions[currentQuiz.nextQuestion].options.forEach((e, ix) => {
    if (currentQuiz.answer === e) {
      currentQuiz.location = ix;
    }
    createQuizButton(e, asciiIndex, ix);
    asciiIndex++;
  });

  setBtnChoiceListener(); //FIXME I think this keeps getting called and reran
  //I think I need a flag to run only once
}
function createQuizButton(e, ascii, ix) {
  const btn = document.createElement("button");
  const li = document.createElement("li");
  const div = document.createElement("div");

  if (ascii === -1) {
    const img = document.createElement("img");
    img.classList.add(`img-${e.title}`);
    btn.textContent = e.title;
    img.src = e.icon;
    div.append(img);
  } else {
    div.classList.add("square");
    div.textContent = String.fromCharCode(ascii);
    btn.textContent = e;
    btn.classList.add("choices");
    btn.setAttribute("index", ix);
  }
  btn.classList.add("subject");
  baseUL.append(li);
  li.append(btn);
  btn.append(div);
}
function clearActive(e) {
  //FIXME I need to build a safer for loop later
  console.log(
    e.currentTarget.parentElement.parentElement.children[0].children[0].classList.contains(
      "subject"
    )
  );
  //BUG get a better count then the magic number 4
  for (let i = 0; i < 4; i++) {
    if (
      e.currentTarget.parentElement.parentElement.children[i].children[0].classList.contains(
        "active"
      )
    ) {
      e.currentTarget.parentElement.parentElement.children[i].children[0].classList.remove(
        "active"
      );
    }
  }
}
function evaluateChoice(e) {
  clearActive(e);
  e.currentTarget.classList.add("active");

  console.log(e.currentTarget.textContent);

  if (e.currentTarget.textContent === currentQuiz.answer) {
    console.log("you get a cookie");
  }
}

function setBtnChoiceListener() {
  const btnChoice = document.querySelectorAll(".choices");

  btnChoice.forEach((btn) => {
    btn.addEventListener("click", evaluateChoice);
  });
}
function insertAnswerIcon(answerButton, answer) {
  const imgPass = document.createElement("img");
  if (answer === "pass") {
    imgPass.src = "../images/icon-correct.svg";
    answerButton.append(imgPass);
  } else if (answer === "fail") {
  } else {
    imgPass.src = "../images/icon-incorrect.svg";
    answerButton.classList.add("error");
    answerButton.append(imgPass);
  }
}
function checkAnswer() {
  const button = document.querySelectorAll(".btn-container li button");
  const activeCheck = { index: -1 };

  button.forEach((b, index) => {
    if (b.classList.contains("active")) {
      activeCheck.index = index;
    }
  });
  if (activeCheck.index == -1) {
    insertAnswerIcon(subjectContainer, "error");
  } else {
    if (subjectContainer.contains(document.querySelector(".error"))) {
      subjectContainer.lastElementChild.remove();
    }
    if (
      baseUL.children[activeCheck.index].children[0].classList.contains("active") &&
      button[activeCheck.index].getAttribute("index") == currentQuiz.location
    ) {
      insertAnswerIcon(button[activeCheck.index], "pass");
      button[activeCheck.index].classList.add("correct");
      currentQuiz.correct++;
    } else {
      insertAnswerIcon(button[activeCheck.index], "fail");
      insertAnswerIcon(button[currentQuiz.location], "pass");
      button[activeCheck.index].classList.add("wrong");
    }
    console.log("this is where we move on");
    btnAnswer.textContent = "Next Question";
    nextQuestion();
  }
  console.log(baseUL.childElementCount);
  //TODO get the next question button working here
}
function nextQuestion() {
  // index: 0,
  //   answer: "unknown",
  //   location: 0,
  //   correct: 0,
  //   nextQuestion: 0,
  //   questionCount: 1,
  currentQuiz.nextQuestion++;
  currentQuiz.questionCount++;
  // currentQuiz.index++;
  //   numOfQuestions: 0,
  // if (currentQuiz.nextQuestion === currentQuiz.questionCount) {
  //   TODO; //game is done show final screen
  //   showFinalScreen();
  // }
}
function showFinalScreen() {
  const completedQuizScreen = document.querySelector(".completed");
  const completedImg = document.querySelector(".completed div img");
  const sectionTitle = document.querySelector(".section-title");
  console.log(completedImg);
  clearUL();
  btnAnswer.textContent = "Play Again";
  completedImg.src = theData.quizzes[currentQuiz.index].icon;
  sectionTitle.textContent = theData.quizzes[currentQuiz.index].title;
  document.querySelector(".completed h2").textContent = currentQuiz.correct;
  document.querySelector(".completed .p").textContent = `out of ${currentQuiz.numOfQuestions}`;
}
btnAnswer.addEventListener("click", () => {
  if (currentQuiz.numOfQuestions === currentQuiz.nextQuestion) {
    showFinalScreen();
  } else if (btnAnswer.textContent === "Next Question") {
    btnAnswer.textContent = "Submit Answer";
    renderQuiz(currentQuiz.index);
  } else {
    checkAnswer();
  }
});
