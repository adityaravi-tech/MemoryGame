
var mySound = new Audio('backgroundaudio.mp3');
mySound.loop = true;

function toggleAudio() {
    const audioButton = document.getElementById('background-audio');
    
    if (mySound.paused) {
        mySound.play();
        audioButton.textContent = "Audio: ON";
    } else {
        mySound.pause();
        audioButton.textContent = "Audio: OFF";
    }
}

document.getElementById('background-audio').addEventListener('click', toggleAudio);

document.addEventListener('DOMContentLoaded', () => {
    const audioButton = document.getElementById('background-audio');
    if (mySound.paused) {
        audioButton.textContent = "Audio: OFF";
    } else {
        audioButton.textContent = "Audio: ON";
    }
});

function toGamePage(){
    window.location.href = 'game.html';
}