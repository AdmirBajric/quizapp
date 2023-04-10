import { questions } from "./data.js";

const startBtn = document.querySelector(".content-start");
const contentStart = document.querySelector("#content-start");
const questionsContainer = document.querySelector("#questions-container");
const question = questionsContainer.querySelector(".question");
const answersContainer = document.querySelector(".answers-container");
const nextBtn = document.querySelector("#next");
const completeQuiz = document.querySelector("#complete-quiz");
const userScore = document.querySelector("#user-score");
const replayGame = document.querySelector("#replay");
const progress = document.querySelector(".progress-bar");

let count = 0;
let correctAnswers = 0;
let correct;
let correctCharacters = ["A", "B", "C", "D"];

startBtn.addEventListener("click", () => {
  changeDisplayView();
  disableBtn();
  startQuiz();
  addEventListeners();
});

const changeDisplayView = () => {
  contentStart.style.display = "none";
  questionsContainer.style.display = "flex";
};

const startQuiz = () => {
  question.innerHTML = questions[count]["question"];

  answersContainer.innerHTML = "";

  for (let i = 1; i < 5; i++) {
    answersContainer.innerHTML += /*html*/ `
                <div class='answer' id='answer_${i}'>
                  <span>${correctCharacters[i - 1]}</span>
                  <p>${questions[count][`answer_${i}`]}</p>
                </div>
    `;
  }
};

const addEventListeners = () => {
  const allAnswers = document.querySelectorAll(".answer");
  let listenerFunction;
  let clicked = false;

  allAnswers.forEach((a) => {
    if (+a.id.slice(-1) === questions[count]["right_answer"]) {
      correct = a;
    }
    listenerFunction = () => {
      if (!clicked) {
        clicked = true;
        if (+a.id.slice(-1) === questions[count]["right_answer"]) {
          rightAnswer(a);
        } else {
          wrongAnswer(a);
        }
        allAnswers.forEach((answer) => {
          answer.removeEventListener("click", listenerFunction);
        });
      }
    };
    a.addEventListener("click", listenerFunction);
  });
};

const rightAnswer = (a) => {
  playAudio("success");
  correctAnswers++;
  changeStyle(a, "successBGC", "chooseSuccessBGC");
  enableBtn();
};

const wrongAnswer = (a) => {
  playAudio("fail");
  changeStyle(a, "dangerBGC", "chooseDangerBGC");
  changeStyle(correct, "successBGC", "chooseSuccessBGC");
  enableBtn();
};

const playAudio = (x) => {
  const audio = new Audio(`./audio/${x}.mp3`);
  audio.play();
};

const changeStyle = (a, divColor, chooseColor) => {
  a.style.backgroundColor = `var(--${divColor})`;
  a.firstChild.nextSibling.style.backgroundColor = `var(--${chooseColor})`;
  a.firstChild.nextSibling.style.color = "var(--white)";
};

const disableBtn = () => {
  nextBtn.disabled = true;
  nextBtn.style.color = "var(--progressBar)";
  nextBtn.style.backgroundColor = "var(--disabledBTN)";
};

const enableBtn = () => {
  nextBtn.disabled = false;
  nextBtn.style.color = "var(--white)";
  nextBtn.style.backgroundColor = "var(--sideBar)";
};

nextBtn.addEventListener("click", () => {
  progressBar();
  count++;
  if (count === 5) {
    completeQuiz.style.display = "flex";
    questionsContainer.style.display = "none";
    userScore.innerHTML = `${correctAnswers}/${questions.length}`;
  } else {
    nextQuestion();
  }
});

const nextQuestion = () => {
  disableBtn();
  startQuiz();
  addEventListeners();
};

const progressBar = () => {
  progress.style.width = `${(count + 1) * 20}%`;
  progress.innerHTML = `${(count + 1) * 20}%`;
};

replayGame.addEventListener("click", () => {
  count = 0;
  correctAnswers = 0;
  completeQuiz.style.display = "none";
  progress.style.width = `0%`;
  progress.innerHTML = ``;
  changeDisplayView();
  disableBtn();
  startQuiz();
  addEventListeners();
});
