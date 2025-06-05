const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const xScoreEl = document.getElementById('x-score');
const oScoreEl = document.getElementById('o-score');
const winLine = document.getElementById('win-line');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let xScore = 0;
let oScore = 0;
let gameActive = true;

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8], // Rows
  [0,3,6], [1,4,7], [2,5,8], // Columns
  [0,4,8], [2,4,6]           // Diagonals
];

cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', () => {
  restartBtn.disabled = true;
  restartBtn.innerText = "Resetting...";
  setTimeout(() => {
    restartGame();
    restartBtn.disabled = false;
    restartBtn.innerText = "Play Again 🔁";
  }, 1200);
});

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] || !gameActive) return;

  board[index] = currentPlayer;
  e.target.classList.add(currentPlayer.toLowerCase());
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    gameActive = false;
    message.textContent = `${currentPlayer} wins!`;
    updateScore(currentPlayer);
  } else if (!board.includes("")) {
    message.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    message.textContent = `Turn: ${currentPlayer}`;
  }
}

function checkWin() {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      highlightWinningCells(combo);
      return true;
    }
  }
  return false;
}

function highlightWinningCells(combo) {
  combo.forEach(index => {
    cells[index].classList.add('win');
  });
  drawWinLine(combo);
}

function drawWinLine(combo) {
  const positions = {
    0: [0, 0],
    1: [1, 0],
    2: [2, 0],
    3: [0, 1],
    4: [1, 1],
    5: [2, 1],
    6: [0, 2],
    7: [1, 2],
    8: [2, 2]
  };

  const [startIdx, , endIdx] = combo;
  const [startX, startY] = positions[startIdx];
  const [endX, endY] = positions[endIdx];

  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

  const cellSize = window.innerWidth < 600 ? 80 : 100;
  const offsetX = startX * (cellSize + 10) + cellSize / 2;
  const offsetY = startY * (cellSize + 10) + cellSize / 2;

  winLine.style.left = `${offsetX}px`;
  winLine.style.top = `${offsetY}px`;
  winLine.style.transform = `rotate(${angle}deg) scaleX(1)`;
}

function updateScore(player) {
  if (player === "X") {
    xScore++;
    xScoreEl.textContent = xScore;
  } else {
    oScore++;
    oScoreEl.textContent = oScore;
  }
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  message.textContent = "Turn: X";
  winLine.style.transform = 'scaleX(0)';
  cells.forEach(cell => {
    cell.textContent = "";
    cell.className = "cell";
  });
}
