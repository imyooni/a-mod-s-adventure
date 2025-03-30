

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
function playSound(url) {
    fetch(url) 
        .then(response => response.arrayBuffer())
        .then(data => {
            audioContext.decodeAudioData(data, (buffer) => {
                const soundSource = audioContext.createBufferSource();
                soundSource.buffer = buffer;
                const gainNode = audioContext.createGain();
                soundSource.connect(gainNode);
                gainNode.connect(audioContext.destination);
                soundSource.start();
                gainNode.gain.setValueAtTime(1, audioContext.currentTime);
            });
        })
        .catch(error => console.error('Error loading sound:', error));
}

function showElements(elements, mode) {
    elements.forEach(element => {
        if (mode === "show") {
            element.style.opacity = "1"
        } else {
            element.style.opacity = "0"
        }
    })
}


document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

document.addEventListener('dragstart', (event) => {
    event.preventDefault();
});


//██████████████████████//
//   GLOBAL VARIABLES   //
//██████████████████████//

let scene = 'intro';
let language = 'en';


//███████████//
//   INTRO   //
//███████████//

const languageSelector = document.querySelector(".languageSelector");
const monitorImage = document.querySelector(".monitorScreen");
const monitorButton = document.querySelector(".monitorButton");

const languages = {
    en: { name: "English", flag: "./assets/Sprites/EN.png" }, 
    kor: { name: "한국어", flag: "./assets/Sprites/KOR.png" }, 
};


document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        let elements = [languageSelector];
        showElements(elements, "show");
        languageButtons()
    }, 200);
});

function languageButtons(){
    Object.entries(languages).forEach(([code, data]) => {
        const button = document.createElement("div");
        button.classList.add("languageButton");
        const flagImg = document.createElement("img");
        flagImg.src = data.flag; 
        button.appendChild(flagImg);
        button.appendChild(document.createTextNode(`${data.name}`));
        button.onclick = () => setLanguage(code);
        languageSelector.appendChild(button);
    });
}

function setLanguage(lang){
    if (scene !== "intro") return
    language = lang
    scene = "game"
    showElements([languageSelector], "hide")
    setTimeout(() => {
         languageSelector.style.zindex = "0"
         monitorImage.style.opacity = "1"
         monitorButton.style.backgroundColor = "rgb(0,255,0)"
       //  createGrid()
      //   initializeElements()
    }, 500);
}
// scoreContainer.style.backgroundImage = "url('./assets/Sprites/ES.png')";  

document.addEventListener('keydown', function (event) {
    if (event.key === "8") {
        createGrid()
    }
});

function generateRandomColumns() {
    return Math.floor(Math.random() * 5) + 1; // Returns 1 to 5
}

let gridItems = [];
function createGrid() {
    const gridContainer = document.getElementById('grid');
    const numColumns = generateRandomColumns();
    const numItems = numColumns; 
    gridContainer.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
    gridContainer.innerHTML = '';
    gridItems = [];
    for (let i = 0; i < numItems; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItems.push(gridItem);
        gridContainer.appendChild(gridItem);
    }
}
