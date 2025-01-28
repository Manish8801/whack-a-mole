"useStrict";
const COUNTDOWN_CONTAINER = getElementById("countdown");
const GAME_CONTAINER = getElementById("game-container");
const GAME = getElementById("game");
const START_MENU = getElementById("level-select-menu");
const START_BUTTON = getElementById("start-game-button");
const LEVELS_CONTAINER = getElementById("levels-container");
const LIVE_SCORE_CONTAINER = getElementById("live-score-container");
const LIVE_SCORE = getElementById("live-score");
const EASY_HIGHSCORE = getElementById("easy-high-score");
const MEDIUM_HIGHSCORE = getElementById("medium-high-score");
const HARD_HIGHSCORE = getElementById("hard-high-score");
const PRO_HIGHSCORE = getElementById("pro-high-score");

const LEVEL_AVAILABLE = {
  easy: 1000,
  medium: 800,
  hard: 700,
  pro: 600,
};

const MOLE_IMAGE = getImage("./images/mole.png");
const PLANT_IMAGE = getImage("./images/plant.png");

let places = [];
let timeoutId;
let intervalId;
let currLevel = LEVEL_AVAILABLE.easy;
let selectedLevel = getElementById("selected");
let currScore;
let pointsPerClick =
  currLevel === 1000
    ? 10
    : currLevel === 800
    ? 15
    : currLevel === 700
    ? 20
    : 30;
let isGameStarted = false;

MOLE_IMAGE.classList.add("mole");
PLANT_IMAGE.classList.add("plant");

LEVELS_CONTAINER.addEventListener("click", handleLevelSelection);
START_BUTTON.addEventListener("click", startGame);
MOLE_IMAGE.addEventListener("mousedown", onMoleClick);
PLANT_IMAGE.addEventListener("mousedown", finishGame);

function getElementById(selector) {
  return document.getElementById(selector);
}

function getImage(src) {
  const img = document.createElement("img");
  img.src = src;

  img.setAttribute("draggable", false);
  return img;
}

function changeDisplay(elem, display) {
  elem.style.display = display;
}

function editContent(elem, content) {
  elem.textContent = content;
}

function showCounter(upto) {
  let counter = upto;

  changeDisplay(COUNTDOWN_CONTAINER, "block");
  editContent(COUNTDOWN_CONTAINER, counter--);

  let timerId = setTimeout(function ticktick() {
    if (counter < 1) {
      clearTimeout(timerId);
      changeDisplay(COUNTDOWN_CONTAINER, "none");
      return;
    }

    editContent(COUNTDOWN_CONTAINER, counter--);
    timerId = setTimeout(() => ticktick(), 1000);
  }, 1000);
}

function resetCurrentScore() {
  currScore = 0;
}

function handleLevelSelection(e) {
  if (e.target.tagName !== "BUTTON") return;

  selectedLevel.removeAttribute("id");
  e.target.id = "selected";
  currLevel = LEVEL_AVAILABLE[e.target.textContent.toLowerCase()];
  selectedLevel = e.target;
}

function onMoleClick() {
  currScore = +LIVE_SCORE.textContent + pointsPerClick;
  editContent(LIVE_SCORE, currScore);
}

function setUpGame() {
  for (let i = 0; i < 9; i++) {
    const place = document.createElement("div");
    const pipeImage = getImage("./images/pipe.png");

    place.classList.add("place");
    pipeImage.classList.add("pipe");

    place.append(pipeImage);
    places.push(place);
  }
  GAME.append(...places);
}

function placeMoleAndPlant() {
  const molePosition = Math.floor(Math.random() * 9);
  const plantPosition = Math.floor(Math.random() * 9);

  if (molePosition === plantPosition) {
    placeMoleAndPlant();
  } else {
    places[molePosition].append(MOLE_IMAGE);
    places[plantPosition].append(PLANT_IMAGE);
  }
}

function startGame() {
  changeDisplay(START_MENU, "none");
  changeDisplay(GAME, "flex");
  changeDisplay(LIVE_SCORE_CONTAINER, "block");

  showCounter(3);
  setUpGame();

  isGameStarted = true;

  timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      placeMoleAndPlant();
    }, currLevel);
  }, 3000);
}

function checkHighScore() {
  if (currLevel === 1000) {
    return [EASY_HIGHSCORE, +EASY_HIGHSCORE.textContent];
  } else if (currLevel === 800) {
    return [MEDIUM_HIGHSCORE, +MEDIUM_HIGHSCORE.textContent];
  } else if (currLevel === 700) {
    return [HARD_HIGHSCORE, +HARD_HIGHSCORE.textContent];
  } else if (currLevel === 600) {
    return [PRO_HIGHSCORE, +PRO_HIGHSCORE.textContent];
  }
}

function recordHighScore() {
  let [recordContainer, highScore] = checkHighScore();

  if (currScore > highScore) {
    editContent(recordContainer, currScore);
  }
}

function finishGame() {
  recordHighScore();
  resetCurrentScore();

  changeDisplay(START_MENU, "block");
  changeDisplay(LIVE_SCORE_CONTAINER, "none");
  changeDisplay(GAME, "none ");

  editContent(LIVE_SCORE, 0);

  GAME.innerHTML = "";
  places.length = 0;

  clearInterval(intervalId);
  clearTimeout(timeoutId);
}
