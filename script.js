const gameBoard = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const errorsElement = document.getElementById('errors');
const difficultySelector = document.getElementById('difficulty');
const winModal = document.getElementById('winModal');
const playerNameInput = document.getElementById('playerName');
let score = 0;
let errors = 0;
let multiplier = 1;
let matchStreak = 0;
let selectedCards = [];
let concepts = [
    "Vector", "Magnitud", "Dirección", "Gradiente", "Límite", 
    "Derivada", "Integral", "∇f (Gradiente)", "∇g (Gradiente)", 
    "∂f/∂x (Derivada Parcial)", "∂f/∂y (Derivada Parcial)", 
    "d/dx (Derivada)", "f(x) = x²", "f(x) = sin(x)"
  ];
  
function startGame() {
  const numCards = parseInt(difficultySelector.value);
  resetGame();
  createCards(numCards);
}

function resetGame() {
  score = 0;
  errors = 0;
  multiplier = 1;
  matchStreak = 0;
  selectedCards = [];
  scoreElement.textContent = score;
  errorsElement.textContent = errors;
  gameBoard.innerHTML = '';
  winModal.style.display = 'none';
}

function createCards(numCards) {
    const selectedConcepts = shuffleArray(concepts).slice(0, numCards / 2);
    const cardSet = shuffleArray([...selectedConcepts, ...selectedConcepts]);
  
    // Ajusta el número de columnas según el número de cartas
    gameBoard.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(numCards))}, 1fr)`;
    gameBoard.innerHTML = ''; // Limpiar el tablero antes de agregar nuevas cartas
    
    cardSet.forEach(concept => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">${concept}</div>
        </div>
      `;
      card.addEventListener('click', () => flipCard(card, concept));
      gameBoard.appendChild(card);
    });
  }
  
function flipCard(card, concept) {
  if (selectedCards.length < 2 && !card.classList.contains('flip')) {
    card.classList.add('flip');
    selectedCards.push({ card, concept });

    if (selectedCards.length === 2) {
      setTimeout(checkMatch, 800);
    }
  }
}

function checkMatch() {
  const [first, second] = selectedCards;
  if (first.concept === second.concept) {
    score += 10 * multiplier;
    matchStreak++;
    if (matchStreak > 2) multiplier = 2;
    first.card.removeEventListener('click', flipCard);
    second.card.removeEventListener('click', flipCard);
  } else {
    errors++;
    multiplier = 1;
    matchStreak = 0;
    first.card.classList.remove('flip');
    second.card.classList.remove('flip');
  }
  scoreElement.textContent = score;
  errorsElement.textContent = errors;
  selectedCards = [];

  if (document.querySelectorAll('.card:not(.flip)').length === 0) {
    endGame();
  }
}

let highScores = []; // Array para almacenar los puntajes altos

function saveScore(playerName, score) {
  // Agrega el puntaje al array de puntajes altos
  highScores.push({ name: playerName, score: score });
  
  // Ordena el array para que el puntaje más alto esté al principio
  highScores.sort((a, b) => b.score - a.score);

  // Limita la tabla a los 5 mejores puntajes
  if (highScores.length > 5) highScores.pop();

  updateScoreBoard();
}

function updateScoreBoard() {
  const scoreBoardBody = document.querySelector("#scoreBoard tbody");
  scoreBoardBody.innerHTML = ""; // Limpia la tabla antes de actualizarla

  highScores.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${entry.name}</td><td>${entry.score}</td>`;
    scoreBoardBody.appendChild(row);
  });
}


function endGame() {
  winModal.style.display = 'flex';
}

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('saveScore').addEventListener('click', () => {
  const playerName = playerNameInput.value;
  console.log(`Jugador: ${playerName}, Puntaje: ${score}`);
  winModal.style.display = 'none';
});

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
