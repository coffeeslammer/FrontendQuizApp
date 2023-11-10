"use strict";

const base = document.querySelector(".html-container");
const intro = document.querySelector(".intro");
const quiz = document.querySelector(".quiz");
const headerLabel = document.querySelector(".header-left");
const questionNumber = document.querySelector(".question-number");
const theQuestion = document.querySelector(".the-question");
const btnAnswer = document.querySelector(".btn-answer");

let theData; //I'm sure there is a cleaner way to do this
let numOfQuestions = 0;
let questionCount = 1;
//TODO I may set this as an object. I want to treat it like an ENUM
//just for better readability in choosing quiz choice
const choice = ["HTML", "CSS", "Javascript", "Accessibility"];

async function anotherFetch() {
  const res = await fetch("../data.json");
  theData = await res.json();
  init(theData);
  setListener();
  console.log(theData);
}
anotherFetch();

function init(data) {
  data.quizzes.forEach((e) => {
    const btn = document.createElement("button");
    const li = document.createElement("li");
    const div = document.createElement("div");
    const div2 = document.createElement("div2");
    const img = document.createElement("img");
    const h = document.createElement("h2");
    img.classList.add(`img-${e.title}`);
    h.textContent = e.title;
    img.src = e.icon;
    btn.classList.add("subject");
    base.append(btn);
    btn.append(li);
    li.append(div2);
    div2.append(img);
    li.appendChild(h);
  });
}
function evaluateBtn(e) {
  if (base.innerHTML !== "") {
    base.innerHTML = "";
  }
  //TODO may add these three lines to a separate function
  intro.classList.add("hidden");
  quiz.classList.remove("hidden");
  btnAnswer.classList.remove("hidden");

  switch (e.target.textContent) {
    case "HTML": {
      renderQuizHeader(0);
      break;
    }
    case "CSS": {
      renderQuizHeader(1);
      break;
    }
    case "JavaScript": {
      renderQuizHeader(2);
      break;
    }
    case "Accessibility": {
      renderQuizHeader(3);
      break;
    }
  }
}
function setListener() {
  const btn = document.querySelectorAll("button");

  btn.forEach((e) => {
    e.addEventListener("click", evaluateBtn);
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

  renderQuiz(section);
}
//FIXME this functions needs more work and clean up
function renderQuiz(i) {
  //index 65 is for ascii A to iterate the alphabet
  let index = 65;
  //FIXME this line is hardcoded dummy code
  numOfQuestions = theData.quizzes[i].questions.length;
  questionNumber.textContent = `Question ${questionCount} of ${numOfQuestions}`;
  theQuestion.textContent = theData.quizzes[i].questions[0].question;
  //TODO need a way to get next question
  theData.quizzes[i].questions[0].options.forEach((e) => {
    const btn = document.createElement("button");
    const li = document.createElement("li");
    const div = document.createElement("div");
    const div2 = document.createElement("div2");

    div2.classList.add("square");
    div2.textContent = String.fromCharCode(index);
    index++;
    const h = document.createElement("h2");

    h.textContent = e;
    console.log(e.question);
    console.log(h.textContent);

    btn.classList.add("subject");
    base.append(btn);
    btn.append(li);
    li.append(div2);
    li.appendChild(h);
  });
}
