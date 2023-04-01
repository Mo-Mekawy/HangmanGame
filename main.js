const USED_LETTERS = "abcdefghijklmnopqrstuvwxyz";

let word, category, gameWords; // will change when game starts

fetch("words.json")
  .then((data) => data.json())
  .then((words) => {
    gameWords = words;
    startGame();
  });

const lettersContainer = document.querySelector("[data-letters]");
const wrongTreis = document.querySelector("[data-tries-count]");
const categoryContainer = document.querySelector("[data-category]");
const wordContainer = document.querySelector("[data-letters-placeholder]");
const hangmanDraw = document.querySelector("[data-hangman]");

function addLetters(letters, container) {
  letters.forEach((letter) => {
    const li = document.createElement("li");
    li.textContent = letter;
    li.className = "letter";

    li.addEventListener("click", () => {
      let isWrongTry = true;
      word.forEach((char, index) => {
        if (char.toLowerCase() === li.textContent.toLowerCase()) {
          isWrongTry = false;
          wordContainer.children[index].setAttribute("data-done", true);
          wordContainer.children[index].textContent = char;
        }
      });

      li.classList.add("done");

      if (isWrongTry) {
        wrongTreis.textContent++;
        hangmanDraw.classList.add(`active-${wrongTreis.textContent}`);
        document.querySelector("[data-sound=failure]").play();
      } else document.querySelector("[data-sound=success]").play();

      checkWin();
    });

    container.append(li);
  });
}

function startGame() {
  // get random category and its words
  category =
    Object.keys(gameWords)[
      Math.floor(Math.random() * Object.keys(gameWords).length)
    ];

  // show the category to user
  categoryContainer.textContent = category;

  // get a random word from that category
  word =
    gameWords[category][
      Math.floor(Math.random() * gameWords[category].length)
    ].split("");

  wordContainer.innerHTML = "";
  hangmanDraw.className = "game-draw";
  word.forEach((char) => {
    const li = document.createElement("li");
    li.setAttribute("data-done", false);

    if (char === " ") {
      li.className = "white-space";
      li.setAttribute("data-done", true);
    }

    wordContainer.append(li);
  });
}

function checkWin() {
  function createPopup(msg) {
    const createConfirmBtn = () => {
      const confirmBtn = document.createElement("button");
      confirmBtn.setAttribute("type", "submit");
      confirmBtn.className = "confirm";

      confirmBtn.textContent = "Continue";

      confirmBtn.addEventListener("click", (e) => {
        e.target.parentElement.remove();
        document.body.classList.remove("blur");

        wrongTreis.textContent = 0;
        Array.from(lettersContainer.children).forEach((letter) => {
          letter.classList.remove("done");
        });

        startGame();
      });

      return confirmBtn;
    };

    const popUp = document.createElement("div");
    popUp.classList.add("pop-up");

    const messageP = document.createElement("p");
    messageP.textContent = msg;
    messageP.className = "popup-msg";

    popUp.append(messageP);
    popUp.append(createConfirmBtn());

    document.body.append(popUp);
    document.body.classList.add("blur");
  }

  const won = Array.from(wordContainer.children).every(
    (el) => el.getAttribute("data-done") === "true"
  );

  if (won)
    createPopup(
      `Congratulations You Won! With ${wrongTreis.textContent} Wrong Tries`
    );
  else if (+wrongTreis.textContent === 7)
    createPopup(`GameOver You Lost! the word is ${word.join("")}`);
}

addLetters([...USED_LETTERS], lettersContainer);
