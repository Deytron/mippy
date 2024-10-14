// Create vars
const wordList = [];
const wordListPath = "diceware-fr-alt.txt";

let format, sep, numbersnumber, wordsnumber;

// Main loop
initializeSettings();
getWordlist(wordListPath);

// Function to initialize settings and apply event listeners
function initializeSettings() {
  // Get settings from localStorage or set defaults
  format = localStorage.getItem("format") || "up";
  sep = localStorage.getItem("sep") || "-";
  wordsnumber = parseInt(localStorage.getItem("wordsnumber") || "4", 10);
  numbersnumber = parseInt(localStorage.getItem("numbersnumber") || "1", 10);

  // Store defaults back to localStorage if not set
  localStorage.setItem("format", format);
  localStorage.setItem("sep", sep);
  localStorage.setItem("numbersnumber", numbersnumber);
  localStorage.setItem("wordsnumber", wordsnumber);

  // Set initial values for UI elements
  document.getElementById("letterFormat").value = format;
  document.getElementById("separator").value = sep;
  document.getElementById("numbersnumber").innerText = numbersnumber;
  document.getElementById("wordsnumber").innerText = wordsnumber;

  // Set up event listeners for inputs
  document.getElementById("letterFormat").addEventListener("change", (e) => {
    format = e.target.value;
    localStorage.setItem("format", format);
    generatePassphrase();
  });

  document.getElementById("separator").addEventListener("change", (e) => {
    sep =
      e.target.value === "none"
        ? ""
        : e.target.value === "space"
        ? " "
        : e.target.value;
    localStorage.setItem("sep", sep);
    generatePassphrase();
  });

  document.getElementById("numberminus").addEventListener("click", () => {
    if (numbersnumber > 0) {
      numbersnumber--;
      updateNumbersCount();
    }
  });

  document.getElementById("numberplus").addEventListener("click", () => {
    numbersnumber++;
    updateNumbersCount();
  });

  document.getElementById("wordminus").addEventListener("click", () => {
    if (wordsnumber > 1) {
      wordsnumber--;
      updateWordsCount();
    }
  });

  document.getElementById("wordplus").addEventListener("click", () => {
    wordsnumber++;
    updateWordsCount();
  });

  // Generate the initial passphrase
  generatePassphrase();
}

// Helper functions to update counts and regenerate passphrase
function updateNumbersCount() {
  localStorage.setItem("numbersnumber", numbersnumber);
  document.getElementById("numbersnumber").innerText = numbersnumber;
  generatePassphrase();
}

function updateWordsCount() {
  localStorage.setItem("wordsnumber", wordsnumber);
  document.getElementById("wordsnumber").innerText = wordsnumber;
  generatePassphrase();
}

// Fetch the word list from 'diceware-fr-alt.txt'
function getWordlist(path) {
  fetch(path)
    .then((response) => response.text())
    .then((data) => {
      wordList.push(...data.split(/\r?\n/).map((word) => word.trim()));
      generatePassphrase(); // Call after the word list is loaded
    })
    .catch((error) => console.error("Error fetching word list:", error));
}

// Function to generate the passphrase
function generatePassphrase() {
  if (!wordList.length) {
    return;
  }

  let passphrase = [];

  // Select random words from the list
  for (let i = 0; i < wordsnumber; i++) {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    passphrase.push(formatWord(word, format));
  }

  // Join words with the selected separator
  let passphraseString = passphrase.join(sep);

  // Generate random numbers and add them at the end without the separator
  let numbers = "";
  for (let i = 0; i < numbersnumber; i++) {
    numbers += Math.floor(Math.random() * 10).toString();
  }

  // Concatenate the words and numbers
  passphraseString += numbers;

  // Display the passphrase
  document.getElementById("password").innerText = passphraseString;
}

// Function to format words based on selected format
function formatWord(word, format) {
  switch (format) {
    case "up":
      return word.charAt(0).toUpperCase() + word.slice(1);
    case "caps":
      return word.toUpperCase();
    case "no":
    default:
      return word.toLowerCase();
  }
}
