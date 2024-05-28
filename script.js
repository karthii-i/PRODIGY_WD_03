let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;
let gameMode = 'human'; // 'human' or 'computer'

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function startGame(mode) {
  gameMode = mode;
  document.getElementById('gameMode').style.display = 'none';
  document.getElementById('board').style.display = 'grid';
  document.getElementById('newGameButton').style.display = 'inline-block';
  document.getElementById('backButton').style.display = 'inline-block';
  restartGame();
}

function handleClick(index) {
  if (gameOver || board[index] !== '') return;

  board[index] = currentPlayer;
  render();

  if (checkWin(currentPlayer)) {
    document.getElementById('message').innerText = `${currentPlayer} wins!`;
    gameOver = true;
    return;
  }

  if (checkDraw()) {
    document.getElementById('message').innerText = "It's a draw!";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (gameMode === 'computer' && currentPlayer === 'O') {
    computerMove();
  }
}

function computerMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  handleClick(move);
}

function minimax(board, depth, isMaximizing) {
  if (checkWin('O')) {
    return 10 - depth;
  } else if (checkWin('X')) {
    return depth - 10;
  } else if (checkDraw()) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWin(player) {
  return winningCombos.some(combo => {
    return combo.every(index => {
      return board[index] === player;
    });
  });
}

function checkDraw() {
  return board.every(cell => cell !== '');
}

function render() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    cell.innerText = board[index];
  });
}

function restartGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameOver = false;
  document.getElementById('message').innerText = '';
  render();
}

function goBack() {
  document.getElementById('gameMode').style.display = 'block';
  document.getElementById('board').style.display = 'none';
  document.getElementById('newGameButton').style.display = 'none';
  document.getElementById('backButton').style.display = 'none';
  document.getElementById('message').innerText = '';
  restartGame();
}