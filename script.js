const input = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");
const error = document.getElementById("error");

const wordEl = document.getElementById("word");
const phoneticEl = document.getElementById("phonetic");
const posEl = document.getElementById("pos");
const meaningEl = document.getElementById("meaning");
const exampleEl = document.getElementById("example");
const audioBtn = document.getElementById("audioBtn");

let audio = null;

searchBtn.addEventListener("click", searchWord);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchWord();
});

function searchWord() {
    const word = input.value.trim();

    if (word === "") {
        error.textContent = "⚠ Please enter a word!";
        result.classList.add("hidden");
        return;
    }

    error.textContent = "";
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(res => res.json())
        .then(data => displayResult(data))
        .catch(() => {
            error.textContent = "❌ Word not found. Please try another word.";
            result.classList.add("hidden");
        });
}

function displayResult(data) {
    const entry = data[0];
    const meaningData = entry.meanings[0];

    wordEl.textContent = entry.word;
    phoneticEl.textContent = entry.phonetic || "";

    posEl.textContent = meaningData.partOfSpeech;
    meaningEl.textContent = meaningData.definitions[0].definition;

    exampleEl.textContent =
        meaningData.definitions[0].example || "Example not available";

    const audioSrc = entry.phonetics.find(p => p.audio)?.audio;

    if (audioSrc) {
        audio = new Audio(audioSrc);
        audioBtn.classList.remove("hidden");
        audioBtn.onclick = () => audio.play();
    } else {
        audioBtn.classList.add("hidden");
    }

    result.classList.remove("hidden");
}
