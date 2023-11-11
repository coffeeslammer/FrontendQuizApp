"use strict";

const baseUL = document.querySelector(".btn-container");
const intro = document.querySelector(".intro");
const quiz = document.querySelector(".quiz");
const headerLabel = document.querySelector(".header-left");
const questionNumOnText = document.querySelector(".question-on-text");
const theQuestion = document.querySelector(".the-question");
const btnAnswer = document.querySelector(".btn-answer");

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
//TODO I may set this as an object. I want to treat it like an ENUM
//just for better readability in choosing quiz choice
// const choice = { HTML: 0, CSS: 1, Javascript: 2, Accessibility: 3 };

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
  if (baseUL.innerHTML !== "") {
    baseUL.innerHTML = "";
  }
  //TODO may add these three lines to a separate function
  intro.classList.add("hidden");
  quiz.classList.remove("hidden");
  btnAnswer.classList.remove("hidden");
  const choice = { HTML: 0, CSS: 1, Javascript: 2, Accessibility: 3 };

  //FIXME I think I need to add which index the answer is located at in the currentAnswer object
  //maybe change its name and use it to store more info like which subject, which question, correct, incorrect, etc...
  switch (e.target.textContent) {
    case "HTML": {
      renderQuizHeader(choice.HTML);
      renderQuiz(currentQuiz.index);
      break;
    }
    case "CSS": {
      renderQuizHeader(choice.CSS);
      renderQuiz(currentQuiz.index);
      break;
    }
    case "JavaScript": {
      renderQuizHeader(choice.Javascript);
      renderQuiz(currentQuiz.index);
      break;
    }
    case "Accessibility": {
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

function renderQuiz(i) {
  //index 65 is for ascii A to iterate the alphabet
  let asciiIndex = 65;

  currentQuiz.numOfQuestions = theData.quizzes[i].questions.length;

  questionNumOnText.textContent = `Question ${currentQuiz.questionCount} of ${currentQuiz.numOfQuestions}`;

  theQuestion.textContent = theData.quizzes[i].questions[currentQuiz.nextQuestion].question;

  currentQuiz.answer = theData.quizzes[i].questions[currentQuiz.index].answer;

  theData.quizzes[i].questions[currentQuiz.nextQuestion].options.forEach((e, ix) => {
    if (currentQuiz.answer === e) currentQuiz.location = ix;
    createQuizButton(e, asciiIndex, ix);
    asciiIndex++;
  });
  console.log(currentQuiz.location);
  setBtnChoiceListener();
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
  if (e.currentTarget.classList.contains("active")) {
    e.currentTarget.classList.remove("active");
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
  if (answer) {
    imgPass.src = "../images/icon-correct.svg";
    answerButton.append(imgPass);
  } else {
    imgPass.src = "../images/icon-incorrect.svg";
    answerButton.append(imgPass);
  }
}
function checkAnswer() {
  console.log("checking answer");
  document.querySelectorAll(".btn-container li button").forEach((b) => {
    if (b.getAttribute("index") == currentQuiz.location) {
      insertAnswerIcon(b, true);
    }
    if (b.classList.contains("active")) {
      if (b.getAttribute("index") == currentQuiz.location) {
        b.classList.remove("active");
        b.classList.add("correct");
        console.log("Yay");
        score++; //TODO decide how to handel this. may put in the object I'm using
      } else {
        //this is for wrong answer code
        insertAnswerIcon(b, false);
        b.classList.remove("active");
        b.classList.add("wrong");
      }
    }
    console.log(b);
  });
}
btnAnswer.addEventListener("click", checkAnswer);
