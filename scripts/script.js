"use strict";

const base = document.querySelector(".html-container");
const intro = document.querySelector(".intro");
const quiz = document.querySelector(".quiz");
const headerLabel = document.querySelector(".header-left");

let theData;

function fetchData() {
  fetch("../data.json")
    .then((res) => res.json())
    .then((data) => {
      theData = data;
      console.log(data.quizzes[0].title);
      console.log(data.quizzes[0]);
      init(data);
      setListener();
    });
}
fetchData();

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
  intro.classList.add("hidden");
  quiz.classList.remove("hidden");

  switch (e.target.textContent) {
    case "HTML": {
      HTMLSection();

      break;
    }
    case "CSS": {
      CSSSection();

      break;
    }
    case "JavaScript": {
      JSSection();

      break;
    }
    case "Accessibility": {
      AccSection();

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
function HTMLSection() {
  console.log(theData);
  const img = document.createElement("img");
  img.classList.add(`img-${theData.quizzes[0].title}`);
  img.src = theData.quizzes[0].icon;
  const h3 = document.createElement("h3");
  h3.textContent = theData.quizzes[0].title;
  headerLabel.append(img);
  headerLabel.appendChild(h3);
  renderQuiz(theData.quizzes, 0);
  console.log("So far so good HTML");
}
function CSSSection() {
  renderQuiz(theData.quizzes, 1);
  console.log("So far so good css");
}
function JSSection() {
  renderQuiz(theData.quizzes, 2);
  console.log("So far so good JavaScript");
}
function AccSection() {
  renderQuiz(theData.quizzes, 3);
  console.log("So far so good Accessibility");
}

function renderQuiz(data, i) {
  //index 65 is for ascii A to iterate the alphabet
  let index = 65;
  //TODO need a way to get next question
  data[i].questions[0].options.forEach((e) => {
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
