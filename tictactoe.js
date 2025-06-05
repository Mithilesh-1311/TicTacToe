const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const xScore = document.getElementById('x-score');
const oScore = document.getElementById('o-score');
const drawScore = document.getElementById('draw-score');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');

let currentPlayer = 'X';
let board = Array(9).fill('');
let gameActive = true;
let scores = { X: 0, O: 0, D: 0 };

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function updateStatus(message) {
  statusText.textContent = message;
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.display = 'flex';
}

function closePopup() {
  popup.style.display = 'none';
}

function checkWinner() {
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      showPopup(`🎉 Player ${board[a]} Wins!`);
      scores[board[a]]++;
      updateScore();
      return;
    }
  }

  if (!board.includes('')) {
    gameActive = false;
    showPopup("🤝 It's a Draw!");
    scores.D++;
    updateScore();
  }
}

function updateScore() {
  xScore.textContent = scores.X;
  oScore.textContent = scores.O;
  drawScore.textContent = scores.D;
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add(currentPlayer);

  checkWinner();

  if (gameActive) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Player ${currentPlayer}'s turn`);
  }
}

function restartGame() {
  updateStatus("🔄 Restarting game...");
  restartBtn.disabled = true;
  restartBtn.textContent = "Resetting...";

  setTimeout(() => {
    board = Array(9).fill('');
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('X', 'O');
    });
    currentPlayer = 'X';
    gameActive = true;
    updateStatus("Player X's turn");
    closePopup();

    restartBtn.disabled = false;
    restartBtn.textContent = "Play Again 🔁";
  }, 2000); // 2-second delay
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);

updateStatus("Player X's turn");
