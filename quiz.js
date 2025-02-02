function parseCSV(csv) {
  const rows = csv.split("\r\n").map((row) => row.split(","));
  return rows.map((row) => ({
    index: Number(row[0]),
    hiragana: row[1],
    katakana: row[2],
    romaji: row[3],
  }));
}

async function loadDataFromCSV() {
  try {
    const response = await fetch("quiz_list.csv");
    const text = await response.text();
    questions = parseCSV(text);
    new_question();
  } catch (error) {
    console.error("Error loading CSV: ", error);
  }
}

let questions = [];
function new_question() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  const selectedQuestion = questions[randomIndex];
  document.getElementById("question").textContent = selectedQuestion.katakana;
  const options = createOptions(selectedQuestion);
  const optionsContainer = document.getElementById("options");
  let i = 1;
  optionsContainer.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.style.backgroundColor = "#007BFF";
    button.textContent = option[0];
    button.dataset.index = option[1];
    button.addEventListener(
      "click",
      (e) => answerClickHandler(e, selectedQuestion.index),
      { once: true }
    );
    optionsContainer.appendChild(button);
    i++;
  });
}

function createOptions(selectedQuestion) {
  let filteredQuestions = questions.filter(
    (_, index) => index !== selectedQuestion.index
  );
  let options = [[selectedQuestion.hiragana, selectedQuestion.index]];

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const selectedOption = filteredQuestions[randomIndex];
    options.push([selectedOption.hiragana, selectedOption.index]);

    // To prevent duplicate options
    filteredQuestions = filteredQuestions.filter(
      (_, index) => index !== randomIndex
    );
  }
  console.log(filteredQuestions);
  // Randomize the list of options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = options[i];
    options[i] = options[j];
    options[j] = temp;
  }
  return options;
}

function answerClickHandler(e, correctIndex) {
  if (e.target.dataset.index == correctIndex) {
    e.target.style.backgroundColor = "green";

    let rightAudio = new Audio("right.mp3");
    rightAudio.play();

    setTimeout(() => {
      new_question();
    }, 1000);
  } else {
    e.target.style.backgroundColor = "red";

    let wrongAudio = new Audio("wrong.mp3");
    wrongAudio.play();
  }
}

window.onload = loadDataFromCSV();
