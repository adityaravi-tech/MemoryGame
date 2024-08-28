const gameBoard = document.getElementById('game-board');
const moveCounter = document.getElementById('move-counter');
const resetButton = document.getElementById('reset-button');

let cards = [];
let flippedCards = [];
let moves = 0;
let time = 0;
let timeInterval;
let difficulty = 'very easy';
let scoreNumber = 0;
let bestScore;
let hintNumber =1;
let coin = 0;

function getBestScore(){
    const storedScore = localStorage.getItem('best-score');
    bestScore = isNaN(parseInt(storedScore)) ? 0 : parseInt(storedScore);
    document.getElementById('BestScore').textContent = `Best Score = ${bestScore} points`;
}

function getCoin(){
    const storedCoin = localStorage.getItem('coin-count');
    coin = isNaN(parseInt(storedCoin)) ? 0 : parseInt(storedCoin);
    document.getElementById('coinCount').textContent = `Coins = ${coin}`;
}

getBestScore();
getCoin();

document.getElementById('difficulty').addEventListener('change', function() {
    difficulty = this.value;
    resetGame();
});

function checkForMatch(){
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];

        if (document.querySelectorAll('.matched').length === cards.length) {
            setTimeout(() => alert('Congratulations! You won!'), 500);
            score();
            stopTimer(); 
            coinCount();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card1.textContent = '';
            card2.classList.remove('flipped');
            card2.textContent = '';
            flippedCards = [];
        }, 1000);
    }
}

const coinButton = document.getElementById('coin-system-button');
const closeCoinButton = document.getElementById('close-window');
const coinModal = document.getElementById('coin-modal');
const tutorialButton = document.getElementById('tutorial-button');
const closeTutorial = document.getElementById('close-tutorial');
const tutorialModal = document.getElementById('tutorial-modal');

coinButton.addEventListener('click', function (){
    coinModal.style.display = 'block';
})
closeCoinButton.addEventListener('click', function (){
    coinModal.style.display = 'none';
})
window.addEventListener('click',function(event){
    if(event.target == coinModal){
        coinModal.style.display = 'none';
    }
})

tutorialButton.addEventListener('click', function (){
    tutorialModal.style.display = 'block';
})
closeTutorial.addEventListener('click', function (){
    tutorialModal.style.display = 'none';
})
window.addEventListener('click',function(event){
    if(event.target == tutorialModal){
        tutorialModal.style.display = 'none';
    }
})

function score(){
    scoreNumber = Math.round(1000 * (moves / (time || 1))); 
    document.getElementById('Score').textContent = `Score = ${scoreNumber} points`;
    if (bestScore < scoreNumber) {
        bestScore = scoreNumber;
        storeScore(bestScore);
        document.getElementById('BestScore').textContent = `Best Score = ${bestScore} points`;
    }
    scoreNumber > 750 ? (coin+=250, setTimeout(() => alert("Bonus Recieved: 250 coins!"),2000)) : scoreNumber >= 500 && scoreNumber < 750 ?(coin+=125,setTimeout(() => alert("Bonus Recieved: 125 coins!"),2000)) : coin = coin;
}

function storeScore(points){
    localStorage.setItem('best-score', points);
}

document.getElementById('reset-bestscore').addEventListener('click', function() {
    localStorage.removeItem('best-score');
    bestScore = 0;
    document.getElementById('BestScore').textContent = `Best Score = ${bestScore}`;
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

document.getElementById('hint-button').addEventListener('click', useHint);

const gameContainer = document.getElementById('container');
function containerWidth(numPairs){
    numPairs > 31? gameContainer.style.maxWidth = '1500px' : gameContainer.style.maxWidth = '800px';

}

let numPairs = 0;
function generateCards(difficulty) {
    switch (difficulty) {
        case 'very easy':
            numPairs = 4;
            hintNumber = 1;
            break;
        case 'easy':
            numPairs = 8;
            hintNumber = 2;
            break;
        case 'medium':
            numPairs = 16;
            hintNumber = 3;
            break;
        case 'hard':
            numPairs = 32;
            hintNumber = 5;
            break;
        case 'impossible':
            numPairs = 64;
            hintNumber = 7;
            break;
    }
    containerWidth(numPairs);
    document.getElementById('hint-counter').textContent = `Hints Available: ${hintNumber}`;
    const cardValues = [];
    for(let i = 1; i<=numPairs ;i++){
        cardValues.push(i,i);
    }
    const cards = [];
    return cardValues.map(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', flipCard);
        return card;
    });
}

function backToHomePage(){
    window.location.href = 'index.html'    ;
}

function useHint(){
    if (hintNumber > 0) {
        hintNumber--;
        document.getElementById('hint-counter').textContent = `Hints Available: ${hintNumber}`;
        const unmatchedCards = cards.filter(card => !card.classList.contains('matched'));
        if (unmatchedCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * unmatchedCards.length);
            const selectedCard = unmatchedCards[randomIndex];
            const matchedCard = unmatchedCards.find(card => card.dataset.value === selectedCard.dataset.value && selectedCard !== card);
            selectedCard.classList.add('flipped');
            matchedCard.classList.add('flipped');
            selectedCard.textContent = selectedCard.dataset.value;
            matchedCard.textContent = matchedCard.dataset.value;

            setTimeout(() => {
                selectedCard.classList.remove('flipped');
                selectedCard.textContent = '';
                matchedCard.classList.remove('flipped');
                matchedCard.textContent = '';
            }, 2000);
        }
    } else {
        alert('No hints available.');
    }
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.textContent = this.dataset.value;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('move-counter').textContent = moves;
            checkForMatch();

            if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
                flippedCards.forEach(card => card.classList.add('matched'));
                flippedCards = [];
                score();
            } else {
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                        card.textContent = '';
                    });
                    flippedCards = [];
                }, 1000);
            }
        }
    }
}
resetButton.addEventListener('click', resetGame);

function resetGame() {
    gameBoard.innerHTML = '';
    clearInterval(timeInterval);
    time = 0;
    moves = 0;
    document.getElementById('move-counter').textContent = moves;
    document.getElementById('timer').textContent = `Time: ${time}s`;
    document.getElementById('hint-counter').textContent = `Hints Available: ${hintNumber}`;
    cards = generateCards(difficulty);
    const shuffledCards = shuffleArray([...cards, ...cards]);
    shuffledCards.forEach(card => gameBoard.appendChild(card));
    score();
    timeInterval = setInterval(() => {
        time++;
        document.getElementById('timer').textContent = `Time: ${time}s`;
    }, 1000);
}
resetGame();
