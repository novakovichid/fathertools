const gameBoard = document.getElementById('game-board');
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart-button');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(25).fill('');

const players = ['X', 'O', 'Y'];
let currentPlayerIndex = 0;
const winningCombinations = [
    // Add all possible winning combinations for a 5x5 board
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24], // Rows
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24], // Columns
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20] // Diagonals
];

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = [...cells].indexOf(cell);

    if (gameState[cellIndex] || !gameActive) {
        return;
    }

    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;

    checkResult();
}
function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c, d, e] = winningCombinations[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c] && gameState[a] === gameState[d] && gameState[a] === gameState[e]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        status.textContent = `Игрок ${currentPlayer} выиграл!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        status.textContent = 'Ничья!';
        gameActive = false;
        return;
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    currentPlayer = players[currentPlayerIndex];
    status.textContent = `Ход игрока ${currentPlayer}`;
}


function restartGame() {
    currentPlayerIndex = 0;
    currentPlayer = players[currentPlayerIndex];
    gameActive = true;
    gameState = Array(25).fill('');
    status.textContent = `Ход игрока ${currentPlayer}`;
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);

status.textContent = `Ход игрока ${currentPlayer}`;
