

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let bgmSource = null; // Global variable to store the BGM source

function playSound(url, volume = 100, loop = false) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            audioContext.decodeAudioData(data, (buffer) => {
                if (bgmSource) {
                    bgmSource.stop(); // Stop previous BGM if playing
                }

                bgmSource = audioContext.createBufferSource();
                bgmSource.buffer = buffer;
                bgmSource.loop = loop; // Enable looping if needed

                const gainNode = audioContext.createGain();
                gainNode.gain.setValueAtTime(volume / 100, audioContext.currentTime); // Set volume (0 to 1)

                bgmSource.connect(gainNode);
                gainNode.connect(audioContext.destination);

                bgmSource.start();
            });
        })
        .catch(error => console.error('Error loading sound:', error));
}

// To stop the BGM later
function stopBGM() {
    if (bgmSource) {
        bgmSource.stop(); // Stop the BGM sound
        bgmSource = null;  // Reset the reference
    }
}

// To pause and resume BGM (optional)
function pauseBGM() {
    if (bgmSource) {
        bgmSource.stop(); // Stop the BGM, but can be restarted later
    }
}

// To restart the BGM (optional)
function restartBGM(url, volume = 100, loop = false) {
    if (bgmSource) {
        bgmSource.stop(); // Stop the current BGM
    }
    playSound(url, volume, loop); // Restart BGM from the beginning
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
let money = 0;


//███████████//
//   INTRO   //
//███████████//

const languageSelector = document.querySelector(".languageSelector");
const monitorImage = document.querySelector(".monitorScreen");
const monitorButton = document.querySelector(".monitorButton");
const moneyBorder = document.querySelector('.money-border');
const moneySprite = document.querySelector('.money-sprite');

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
    playSound("./assets/Audio/SFX/System_Ok.ogg")
    language = lang
    scene = "game"
    showElements([languageSelector], "hide")
    setTimeout(() => {
        const gameLogo = document.querySelector('.gameLogo');
        gameLogo.style.animation = 'bounceIn 1s ease-out forwards';
        gameLogo.addEventListener('animationend', () => {
            gameLogo.classList.remove('bounceIn'); // Optional: Reset the animation class for future use
        });
        playSound('./assets/Audio/BGM/bgm000.ogg', 50, true)
         languageSelector.style.zindex = "0"
         monitorImage.style.opacity = "1"
         moneySprite.style.opacity = "1"
         monitorButton.style.backgroundColor = "rgb(0,255,0)"
         updateMoneyDisplay(0)

       //  createGrid()
      //   initializeElements()
    }, 500);
}
// scoreContainer.style.backgroundImage = "url('./assets/Sprites/ES.png')";  

document.addEventListener('keydown', function (event) {
    if (event.key === "8") {
        playSound("./assets/Audio/SFX/System_Money.ogg")
        updateMoneyDisplay(5,"add")
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


let currentAnimation = null;
let targetMoney = 0;

function updateMoneyDisplay(value, mode = "add") {
    if (mode === "add") {
        targetMoney += value;  // Accumulate changes properly
    } else if (mode === "set") {
        targetMoney = Math.max(0, value);
    }

    if (currentAnimation) {
        return; // If animation is running, let it handle the updates
    }

    let startMoney = money;
    let duration = 300;
    let steps = 20;
    let stepTime = duration / steps;
    let currentStep = 0;

    function animateStep() {
        currentStep++;
        let progress = currentStep / steps;
        let easingProgress = 1 - Math.pow(1 - progress, 3);
        let animatedValue = Math.floor(startMoney + (targetMoney - startMoney) * easingProgress);
        renderMoney(animatedValue);

        if (currentStep < steps) {
            currentAnimation = setTimeout(animateStep, stepTime);
        } else {
            money = targetMoney;  // Finalize the money value
            currentAnimation = null;
        }
    }

    animateStep();
}

function renderMoney(amount) {
    const moneyDisplay = document.getElementById('money-display');
    moneyDisplay.innerHTML = '';
    const numberStr = amount.toString().padStart(7, '0');
    for (let i = 0; i < numberStr.length; i++) {
        const digit = numberStr[i];
        const digitElement = document.createElement('span');
        const digitWidth = 11;
        digitElement.style.backgroundPosition = `-${digit * digitWidth}px 0`;
        moneyDisplay.appendChild(digitElement);
    }
}